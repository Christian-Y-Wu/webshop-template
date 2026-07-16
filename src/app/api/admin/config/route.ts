import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, writesAllowed } from '@/lib/admin/auth';
import { validateSettings, type StoreSettings } from '@/config/settings-schema';
import { applyStoreSettings, siteDefaults } from '@/config/site';
import { demoCatalog } from '@/lib/data/products';
import { collections } from '@/lib/data/collections';
import type { Product } from '@/lib/types';
import { resolveSiteUrl } from '@/lib/site-url';

/* ==========================================================================
   /api/admin/config — the Admin Studio's read/write endpoint for
   store-settings.json.

   GET  → current overrides + the effective (merged) config + catalogue
          summary + environment status. One call powers the whole studio.
   PUT  → validate and write store-settings.json. Local development only —
          the deployed site is immutable by design (see SECURITY.md).
   ========================================================================== */

// Never statically optimise this route — auth and file state are per-request.
export const dynamic = 'force-dynamic';

const SETTINGS_PATH = path.join(process.cwd(), 'src', 'config', 'store-settings.json');
const PRODUCTS_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'custom-products.json');

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  const settings = await readJson<StoreSettings>(SETTINGS_PATH, {});
  const customProducts = await readJson<Product[]>(PRODUCTS_PATH, []);
  const effective = applyStoreSettings(siteDefaults, settings);

  return NextResponse.json({
    settings,
    effective,
    customProducts,
    demoProducts: demoCatalog,
    collections: collections.map((c) => ({ handle: c.handle, title: c.title })),
    meta: {
      writable: writesAllowed(),
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
      siteUrl: resolveSiteUrl(),
      siteUrlFromEnv: Boolean(
        process.env.NEXT_PUBLIC_SITE_URL ||
          process.env.VERCEL_PROJECT_PRODUCTION_URL ||
          process.env.VERCEL_URL,
      ),
      adminPasswordLength: (process.env.ADMIN_PASSWORD ?? '').length,
    },
  });
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin(req, { mutation: true });
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  if (!writesAllowed()) {
    return NextResponse.json({ error: 'read_only' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const settings = body?.settings as StoreSettings | undefined;
  const problems = validateSettings(settings);

  if (settings && problems.length === 0) {
    // Cross-check: the featured product must exist in the resulting catalogue.
    const customProducts = await readJson<Product[]>(PRODUCTS_PATH, []);
    const effective = applyStoreSettings(siteDefaults, settings);
    const slugs = new Set([
      ...customProducts.map((p) => p.slug),
      ...(effective.hideDemoCatalog ? [] : demoCatalog.map((p) => p.slug)),
    ]);
    if (slugs.size === 0) {
      problems.push('Cannot hide the demo catalogue while you have no products of your own.');
    } else if (!slugs.has(effective.featuredProductSlug)) {
      problems.push(
        `featuredProductSlug "${effective.featuredProductSlug}" doesn't match any product in the resulting catalogue.`,
      );
    }
  }

  if (!settings || problems.length > 0) {
    return NextResponse.json({ error: 'invalid_settings', problems }, { status: 400 });
  }

  await writeFile(SETTINGS_PATH, `${JSON.stringify(settings, null, 2)}\n`, 'utf8');
  return NextResponse.json({ ok: true });
}
