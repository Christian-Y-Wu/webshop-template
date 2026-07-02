import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { collections, getCollection } from '@/lib/data/collections';
import { getProductsByCollection } from '@/lib/data/products';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { MediaImage } from '@/components/ui/media-image';
import { CollectionView } from '@/components/collection/collection-view';

export function generateStaticParams() {
  return collections.map((c) => ({ handle: c.handle }));
}

export function generateMetadata({ params }: { params: { handle: string } }): Metadata {
  const collection = getCollection(params.handle);
  if (!collection) return buildMetadata({ title: 'Collection not found' });
  return buildMetadata({
    title: collection.title,
    description: collection.description,
    path: `/collections/${collection.handle}`,
  });
}

export default function CollectionPage({ params }: { params: { handle: string } }) {
  const collection = getCollection(params.handle);
  if (!collection) notFound();

  const products = getProductsByCollection(collection.handle);
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/collections' },
    { name: collection.title, href: `/collections/${collection.handle}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      {/* Collection hero */}
      <section className="container-page pt-6">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <div className="relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-[26px] p-8 text-white sm:min-h-[300px] sm:p-12">
          <MediaImage seed={collection.seed} alt={collection.title} monogram={false} priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5" />
          <div className="relative max-w-xl">
            {collection.eyebrow && (
              <p className="text-xs font-medium uppercase tracking-eyebrow text-white/80">{collection.eyebrow}</p>
            )}
            <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-tight text-white">
              {collection.title}
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/85">{collection.description}</p>
          </div>
        </div>
      </section>

      <div className="container-page mt-10 lg:mt-12">
        <CollectionView products={products} />
      </div>
    </>
  );
}
