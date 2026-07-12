import Fuse from 'fuse.js';
import { products } from '@/lib/data/products';
import type { Product } from '@/lib/types';

/**
 * Typo-tolerant, ranked product search. Replaces plain substring matching so
 * a shopper typing "sweeter" still finds "sweater", and results are ordered
 * by relevance instead of catalogue order.
 */
const index = new Fuse(products, {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'subtitle', weight: 0.2 },
    { name: 'tags', weight: 0.15 },
    { name: 'brand', weight: 0.1 },
    { name: 'collections', weight: 0.05 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

export function searchProducts(query: string, limit?: number): Product[] {
  const q = query.trim();
  if (!q) return [];
  const results = index.search(q, limit ? { limit } : undefined);
  return results.map((r) => r.item);
}
