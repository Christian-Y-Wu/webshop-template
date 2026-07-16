import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, writesAllowed } from '@/lib/admin/auth';
import { validateProducts } from '@/lib/admin/validate-products';
import { applyStoreSettings, siteDefaults } from '@/config/site';
import type { StoreSettings } from '@/config/settings-schema';
import { demoCatalog } from '@/lib/data/products';
import { collections } from '@/lib/data/collections';

/* ==========================================================================
   PUT /api/admin/products — write custom-products.json from the Admin
   Studio's product manager. Local development only, like the config route.
   ========================================================================== */

const SETTINGS_PATH = path.join(process.cwd(), 'src', 'config', 'store-settings.json');
const PRODUCTS_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'custom-products.json');

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin(req, { mutation: true });
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  if (!writesAllowed()) {
    return NextResponse.json({ error: 'read_only' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { errors, products } = validateProducts(body?.products, {
    collectionHandles: new Set(collections.map((c) => c.handle)),
    reservedIds: new Set(demoCatalog.map((p) => p.id)),
    reservedSlugs: new Set(demoCatalog.map((p) => p.slug)),
  });

  // The featured product must survive this save.
  if (errors.length === 0) {
    let settings: StoreSettings = {};
    try {
      settings = JSON.parse(await readFile(SETTINGS_PATH, 'utf8')) as StoreSettings;
    } catch {
      /* missing/blank settings file — defaults apply */
    }
    const effective = applyStoreSettings(siteDefaults, settings);
    const slugs = new Set([
      ...products.map((p) => p.slug),
      ...(effective.hideDemoCatalog ? [] : demoCatalog.map((p) => p.slug)),
    ]);
    if (slugs.size === 0) {
      errors.push('The store needs at least one product — add yours before deleting the last one while the demo catalogue is hidden.');
    } else if (!slugs.has(effective.featuredProductSlug)) {
      errors.push(
        `The featured product ("${effective.featuredProductSlug}") would no longer exist. ` +
          'Change it in Store settings first, then save products.',
      );
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: 'invalid_products', problems: errors }, { status: 400 });
  }

  await writeFile(PRODUCTS_PATH, `${JSON.stringify(products, null, 2)}\n`, 'utf8');
  return NextResponse.json({ ok: true });
}
