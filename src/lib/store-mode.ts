/* ==========================================================================
   STORE MODE helpers.

   The template runs in one of two modes, controlled by `storeMode` in
   src/config/site.ts:

     'single'  → a one-product landing store (the default starting point).
     'catalog' → a full multi-product shop.

   Import these helpers anywhere you need to branch behaviour instead of
   comparing the raw config string, so the intent reads clearly in the code.
   ========================================================================== */

import { siteConfig } from '@/config/site';
import { products, getProduct } from '@/lib/data/products';

/** True when the store is configured to sell a single hero product. */
export const isSingleProduct = siteConfig.storeMode === 'single';

/** True when the store is configured as a full multi-product catalogue. */
export const isCatalog = siteConfig.storeMode === 'catalog';

/**
 * The one product a 'single' store is built around. Falls back to the first
 * product in the catalogue if `featuredProductSlug` doesn't match anything,
 * so the homepage never renders empty during setup.
 */
export function getFeaturedProduct() {
  return getProduct(siteConfig.featuredProductSlug) ?? products[0];
}
