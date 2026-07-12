/* ==========================================================================
   SINGLE-PRODUCT HOME — the homepage when `storeMode === 'single'`.

   Instead of the multi-category "big shop" homepage, this renders a focused,
   conversion-first landing page built entirely around one hero product (the
   one named by `featuredProductSlug` in src/config/site.ts).

   It deliberately reuses the same building blocks as the product detail page
   (gallery, buy box, information, reviews) so a single-product store and a
   full catalogue share one design language. To grow into a full shop, flip
   `storeMode` to 'catalog' in site.ts — this file is no longer used and the
   catalogue homepage takes over.

   Section ids (#product, #details, #reviews, #faq) are the anchor targets for
   the single-mode navigation in src/config/navigation.ts.
   ========================================================================== */

import { getFeaturedProduct } from '@/lib/store-mode';
import { siteConfig } from '@/config/site';
import { compactNumber } from '@/lib/utils';

import { Marquee } from '@/components/home/marquee';
import { ValueProps } from '@/components/home/value-props';
import { Editorial } from '@/components/home/editorial';
import { Testimonials } from '@/components/home/testimonials';
import { FaqHome } from '@/components/home/faq-home';
import { NewsletterBand } from '@/components/home/newsletter-band';

import { ProductGallery } from '@/components/product/product-gallery';
import { ProductBuyBox } from '@/components/product/product-buy-box';
import { ProductInformation } from '@/components/product/product-information';
import { ProductReviews } from '@/components/product/product-reviews';
import { StickyAddBar } from '@/components/product/sticky-add-bar';
import { StarRating } from '@/components/ui/star-rating';

export function SingleProductHome() {
  const product = getFeaturedProduct();

  return (
    <>
      {/* Hero — the product front and centre */}
      <section id="product" className="container-page scroll-mt-24 pt-6 lg:pt-10">
        <div className="mx-auto mb-8 max-w-2xl text-center lg:mb-12">
          <p className="eyebrow">{product.brand ?? siteConfig.name}</p>
          <p className="mt-3 font-serif text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] text-balance">
            {product.tagline ?? product.title}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2.5 text-sm text-ink-soft">
            <StarRating rating={product.rating.rating} size={15} />
            <span>
              {product.rating.rating} · Loved by {compactNumber(product.rating.count)}+ customers
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <ProductGallery product={product} />
          <ProductBuyBox product={product} />
        </div>
      </section>

      <Marquee />

      {/* Why buy */}
      <ValueProps />

      {/* Brand story */}
      <Editorial />

      {/* Everything about the product */}
      <section id="details" className="container-page mt-20 scroll-mt-24 lg:mt-28">
        <ProductInformation product={product} />
      </section>

      {/* Social proof */}
      <Testimonials />

      {/* Reviews (component already renders id="reviews") */}
      <div className="container-page mt-20 border-t border-line pt-14 lg:mt-28">
        <ProductReviews product={product} />
      </div>

      {/* FAQ */}
      <div id="faq" className="scroll-mt-24">
        <FaqHome />
      </div>

      <NewsletterBand />

      {/* Persistent add-to-cart on scroll */}
      <StickyAddBar product={product} />
    </>
  );
}
