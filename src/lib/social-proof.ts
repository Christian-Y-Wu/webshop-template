/* ==========================================================================
   SOCIAL PROOF helpers.

   A brand-new store has no reviews. Rather than printing "Rated 4.8/5 by 0+
   customers" — or worse, shipping invented numbers as if they were real — the
   storefront hides every ratings claim until the store actually has some.

   Two switches feed this:
     features.reviews   → review sections and star ratings at all.
     trust.ratingCount  → how many reviews exist. 0 means "none yet".

   Import `hasSocialProof` anywhere you're about to render a rating, a review
   count or a "loved by thousands" claim, and render nothing when it's false.
   ========================================================================== */

import { siteConfig } from '@/config/site';

/**
 * True when the store has review numbers worth showing. False on a fresh
 * store, which is the default — see the "Fresh launch" preset.
 */
export const hasSocialProof =
  siteConfig.features.reviews && siteConfig.trust.ratingCount > 0;
