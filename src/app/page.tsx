import { isSingleProduct } from '@/lib/store-mode';
import { siteConfig } from '@/config/site';
import { SingleProductHome } from '@/components/home/single-product-home';

import { Hero } from '@/components/home/hero';
import { Marquee } from '@/components/home/marquee';
import { FeaturedCollections } from '@/components/home/featured-collections';
import { FeaturedProducts } from '@/components/home/featured-products';
import { ValueProps } from '@/components/home/value-props';
import { PromoBanner } from '@/components/home/promo-banner';
import { CategoryGrid } from '@/components/home/category-grid';
import { Editorial } from '@/components/home/editorial';
import { Story } from '@/components/home/story';
import { Testimonials } from '@/components/home/testimonials';
import { InstagramGallery } from '@/components/home/instagram';
import { BlogPreview } from '@/components/home/blog-preview';
import { FaqHome } from '@/components/home/faq-home';
import { NewsletterBand } from '@/components/home/newsletter-band';
import { RecentlyViewed } from '@/components/product/recently-viewed';

export default function HomePage() {
  // The homepage adapts to the store mode set in src/config/site.ts:
  //   'single'  → a focused one-product landing page (SingleProductHome).
  //   'catalog' → the full multi-product storefront below.
  if (isSingleProduct) {
    return <SingleProductHome />;
  }

  // Each section can be switched off in the Admin Studio (Homepage section);
  // the page recomposes without gaps. Defaults live in src/config/site.ts.
  const show = siteConfig.homeSections;

  return (
    <>
      <Hero />
      {show.marquee && <Marquee />}
      {show.featuredCollections && <FeaturedCollections />}
      {show.featuredProducts && <FeaturedProducts />}
      {show.valueProps && <ValueProps />}
      {show.promoBanner && <PromoBanner />}
      {show.categoryGrid && <CategoryGrid />}
      {show.editorial && <Editorial />}
      {show.story && <Story />}
      {show.testimonials && <Testimonials />}
      {show.blogPreview && <BlogPreview />}
      {show.instagram && <InstagramGallery />}
      {show.faq && <FaqHome />}
      {show.recentlyViewed && <RecentlyViewed />}
      {show.newsletter && <NewsletterBand />}
    </>
  );
}
