import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { products, getProduct, getRelatedProducts, getBoughtTogether } from '@/lib/data/products';
import { collectionMap } from '@/lib/data/collections';
import { buildMetadata, productJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductBuyBox } from '@/components/product/product-buy-box';
import { ProductInformation } from '@/components/product/product-information';
import { ProductReviews } from '@/components/product/product-reviews';
import { BoughtTogether } from '@/components/product/bought-together';
import { StickyAddBar } from '@/components/product/sticky-add-bar';
import { ProductRail } from '@/components/product/product-rail';
import { RecentlyViewed } from '@/components/product/recently-viewed';
import { SectionHeader } from '@/components/ui/section-header';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProduct(params.slug);
  if (!product) return buildMetadata({ title: 'Product not found' });
  return buildMetadata({
    title: product.title,
    description: product.subtitle ? `${product.subtitle}. ${product.description}` : product.description,
    path: `/products/${product.slug}`,
  });
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 8);
  const boughtTogether = getBoughtTogether(product);
  const primaryCollection = product.collections.find((c) => c !== 'all');
  const collection = primaryCollection ? collectionMap.get(primaryCollection) : undefined;

  const crumbs = [
    { name: 'Home', href: '/' },
    ...(collection ? [{ name: collection.title, href: `/collections/${collection.handle}` }] : []),
    { name: product.title, href: `/products/${product.slug}` },
  ];

  return (
    <>
      <JsonLd data={[productJsonLd(product), breadcrumbJsonLd(crumbs)]} />

      <div className="container-page pb-28 pt-6 lg:pb-16">
        <Breadcrumbs items={crumbs} className="mb-6" />

        {/* Gallery + buy box */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <ProductGallery product={product} />
          <ProductBuyBox product={product} />
        </div>

        {/* Info + bundle */}
        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-2 lg:gap-14">
          <ProductInformation product={product} />
          <div className="space-y-14">
            <BoughtTogether product={product} items={boughtTogether} />
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 border-t border-line pt-14 lg:mt-24">
          <ProductReviews product={product} />
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-page">
          <SectionHeader eyebrow="You may also like" title="Complete the look" cta={{ label: 'Shop all', href: '/collections/all' }} />
          <ProductRail products={related} className="mt-9" />
        </section>
      )}

      <RecentlyViewed excludeId={product.id} />

      <StickyAddBar product={product} />
    </>
  );
}
