import { Hero } from '@/components/home/hero';
import { Marquee } from '@/components/home/marquee';
import { FeaturedCollections } from '@/components/home/featured-collections';
import { FeaturedProducts } from '@/components/home/featured-products';
import { ValueProps } from '@/components/home/value-props';
import { PromoBanner } from '@/components/home/promo-banner';
import { CategoryGrid } from '@/components/home/category-grid';
import { Editorial } from '@/components/home/editorial';
import { Testimonials } from '@/components/home/testimonials';
import { InstagramGallery } from '@/components/home/instagram';
import { BlogPreview } from '@/components/home/blog-preview';
import { FaqHome } from '@/components/home/faq-home';
import { NewsletterBand } from '@/components/home/newsletter-band';
import { RecentlyViewed } from '@/components/product/recently-viewed';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedCollections />
      <FeaturedProducts />
      <ValueProps />
      <PromoBanner />
      <CategoryGrid />
      <Editorial />
      <Testimonials />
      <BlogPreview />
      <InstagramGallery />
      <FaqHome />
      <RecentlyViewed />
      <NewsletterBand />
    </>
  );
}
