/* ==========================================================================
   CONTENT VALIDATOR — catches broken cross-file references before they
   silently produce an empty collection page or a 404 homepage.

   TypeScript already enforces the *shape* of each object in src/lib/data.
   What it can't catch is a plain string that's supposed to match a value in
   a different file — a collection handle, a pairsWith product id, the
   featured product slug. This script checks those by hand and prints an
   actionable message (with a "did you mean" suggestion) instead of letting
   the mistake ship silently.

   Runs automatically via the "predev"/"prebuild" npm scripts.
   ========================================================================== */

import { products } from '../src/lib/data/products';
import { collections } from '../src/lib/data/collections';
import { siteConfig } from '../src/config/site';

function levenshtein(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d: number[][] = Array.from({ length: rows }, (_, i) => [i, ...Array(cols - 1).fill(0)]);
  for (let j = 1; j < cols; j++) d[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[rows - 1][cols - 1];
}

function nearest(target: string, candidates: Iterable<string>): string | undefined {
  let best: string | undefined;
  let bestDistance = Infinity;
  for (const candidate of candidates) {
    const distance = levenshtein(target, candidate);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  }
  // Only suggest when it's plausibly a typo, not a completely different word.
  return bestDistance <= Math.max(3, target.length / 2) ? best : undefined;
}

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const v of values) {
    if (seen.has(v)) dupes.add(v);
    seen.add(v);
  }
  return [...dupes];
}

const errors: string[] = [];

function fail(message: string) {
  errors.push(message);
}

function suggestionSuffix(target: string, candidates: Iterable<string>): string {
  const suggestion = nearest(target, candidates);
  return suggestion ? ` Did you mean "${suggestion}"?` : '';
}

/* ---- Build lookup sets --------------------------------------------------- */
const collectionHandles = new Set(collections.map((c) => c.handle));
const productIds = new Set(products.map((p) => p.id));
const productSlugs = new Set(products.map((p) => p.slug));

/* ---- Uniqueness ----------------------------------------------------------- */
const dupSlugs = findDuplicates(products.map((p) => p.slug));
if (dupSlugs.length) fail(`products.ts: duplicate product slug(s): ${dupSlugs.join(', ')}`);

const dupIds = findDuplicates(products.map((p) => p.id));
if (dupIds.length) fail(`products.ts: duplicate product id(s): ${dupIds.join(', ')}`);

const dupHandles = findDuplicates(collections.map((c) => c.handle));
if (dupHandles.length) fail(`collections.ts: duplicate collection handle(s): ${dupHandles.join(', ')}`);

/* ---- Cross-file references ------------------------------------------------ */
for (const product of products) {
  for (const handle of product.collections) {
    if (!collectionHandles.has(handle)) {
      fail(
        `products.ts: product "${product.slug}" lists collection "${handle}", which doesn't exist ` +
          `in collections.ts.${suggestionSuffix(handle, collectionHandles)}`,
      );
    }
  }

  for (const pairId of product.pairsWith ?? []) {
    if (!productIds.has(pairId)) {
      fail(
        `products.ts: product "${product.slug}" has pairsWith id "${pairId}", which doesn't match ` +
          `any product's id.${suggestionSuffix(pairId, productIds)}`,
      );
    }
  }
}

if (!productSlugs.has(siteConfig.featuredProductSlug)) {
  fail(
    `site.ts: featuredProductSlug "${siteConfig.featuredProductSlug}" doesn't match any product slug ` +
      `in products.ts.${suggestionSuffix(siteConfig.featuredProductSlug, productSlugs)}`,
  );
}

/* ---- Report ---------------------------------------------------------------- */
if (errors.length) {
  console.error(`\n✗ Content validation failed (${errors.length} issue${errors.length > 1 ? 's' : ''}):\n`);
  errors.forEach((e, i) => console.error(`  ${i + 1}. ${e}`));
  console.error('\nFix the reference(s) above in src/lib/data or src/config/site.ts.\n');
  process.exit(1);
} else {
  console.log(`✓ Content validated — ${products.length} products, ${collections.length} collections, all references resolve.`);
}
