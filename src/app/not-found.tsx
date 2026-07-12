import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { products } from '@/lib/data/products';
import { isSingleProduct, getFeaturedProduct } from '@/lib/store-mode';
import { ProductRail } from '@/components/product/product-rail';

export default function NotFound() {
  const featured = getFeaturedProduct();
  // In single-product mode the "shop" fallback is the one product; otherwise
  // it's the full catalogue. Suggestions always fall back to something.
  const suggestions = isSingleProduct
    ? [featured]
    : products.filter((p) => p.bestSeller).slice(0, 8);

  return (
    <div className="container-page py-20 lg:py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-serif text-[clamp(5rem,18vw,11rem)] leading-none text-accent/25">404</p>
        <h1 className="mt-2 font-serif text-3xl lg:text-4xl">This page has wandered off</h1>
        <p className="mt-4 text-ink-soft">
          The page you’re looking for doesn’t exist or has moved. Let’s get you back to the good stuff.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back to home <ArrowRight size={16} />
          </Link>
          {isSingleProduct ? (
            <Link href={`/products/${featured.slug}`} className="btn-outline">
              <Search size={16} /> View the product
            </Link>
          ) : (
            <Link href="/collections/all" className="btn-outline">
              <Search size={16} /> Shop all
            </Link>
          )}
        </div>
      </div>

      <div className="mt-20">
        <p className="eyebrow mb-6 text-center">You might like these</p>
        <ProductRail products={suggestions} />
      </div>
    </div>
  );
}
