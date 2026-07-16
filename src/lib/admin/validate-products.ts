import type { Product } from '@/lib/types';

/* ==========================================================================
   Validation for products submitted from the Admin Studio. Returns
   human-readable problems (empty = valid). Deliberately checks the fields
   the storefront actually renders — everything else is optional.
   ========================================================================== */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateProducts(
  input: unknown,
  opts: { collectionHandles: Set<string>; reservedIds?: Set<string>; reservedSlugs?: Set<string> },
): { errors: string[]; products: Product[] } {
  const errors: string[] = [];
  if (!Array.isArray(input)) return { errors: ['Products payload must be an array.'], products: [] };
  if (input.length > 500) return { errors: ['Too many products (max 500).'], products: [] };

  const ids = new Set<string>();
  const slugs = new Set<string>();

  input.forEach((raw, index) => {
    const label = `Product ${index + 1}`;
    if (typeof raw !== 'object' || raw === null) {
      errors.push(`${label}: must be an object.`);
      return;
    }
    const p = raw as Record<string, unknown>;

    for (const key of ['id', 'slug', 'title', 'description'] as const) {
      if (typeof p[key] !== 'string' || !(p[key] as string).trim()) {
        errors.push(`${label}: "${key}" is required.`);
      }
    }
    const slug = String(p.slug ?? '');
    const id = String(p.id ?? '');
    if (slug && !SLUG_RE.test(slug)) {
      errors.push(`${label}: slug "${slug}" must be lowercase letters, digits and dashes.`);
    }
    if (slug) {
      if (slugs.has(slug)) errors.push(`Duplicate slug "${slug}".`);
      if (opts.reservedSlugs?.has(slug)) errors.push(`Slug "${slug}" collides with a demo product. Pick another or hide the demo catalogue.`);
      slugs.add(slug);
    }
    if (id) {
      if (ids.has(id)) errors.push(`Duplicate id "${id}".`);
      if (opts.reservedIds?.has(id)) errors.push(`Id "${id}" collides with a demo product.`);
      ids.add(id);
    }

    if (typeof p.price !== 'number' || !Number.isFinite(p.price) || p.price < 0 || p.price > 1_000_000) {
      errors.push(`${label}: price must be a number between 0 and 1,000,000.`);
    }
    if (
      p.compareAtPrice !== undefined &&
      p.compareAtPrice !== null &&
      (typeof p.compareAtPrice !== 'number' || !Number.isFinite(p.compareAtPrice))
    ) {
      errors.push(`${label}: compareAtPrice must be a number or empty.`);
    }
    if (typeof p.stock !== 'number' || !Number.isInteger(p.stock) || p.stock < 0) {
      errors.push(`${label}: stock must be a whole number ≥ 0.`);
    }

    if (!Array.isArray(p.images) || p.images.length === 0) {
      errors.push(`${label}: needs at least one image (a seed is enough).`);
    } else {
      for (const img of p.images as unknown[]) {
        const i = img as Record<string, unknown>;
        if (!i || typeof i.seed !== 'string' || typeof i.alt !== 'string') {
          errors.push(`${label}: every image needs a "seed" and an "alt" text.`);
          break;
        }
        if (i.src !== undefined && i.src !== '' && typeof i.src === 'string' && !/^https?:\/\//.test(i.src)) {
          errors.push(`${label}: image src must be an http(s) URL (or empty for a placeholder).`);
        }
      }
    }

    if (!Array.isArray(p.collections) || p.collections.length === 0) {
      errors.push(`${label}: assign at least one collection (e.g. "all").`);
    } else {
      for (const handle of p.collections as unknown[]) {
        if (typeof handle !== 'string' || !opts.collectionHandles.has(handle)) {
          errors.push(`${label}: collection "${String(handle)}" doesn't exist in collections.ts.`);
        }
      }
    }

    if (p.rating !== undefined) {
      const r = p.rating as Record<string, unknown>;
      if (
        typeof r !== 'object' || r === null ||
        typeof r.rating !== 'number' || (r.rating as number) < 0 || (r.rating as number) > 5 ||
        typeof r.count !== 'number' || (r.count as number) < 0
      ) {
        errors.push(`${label}: rating must be { rating: 0–5, count: ≥0 }.`);
      }
    }
  });

  return { errors, products: input as Product[] };
}
