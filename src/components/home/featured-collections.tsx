import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { featuredCollections } from '@/lib/data/collections';
import { getProductsByCollection } from '@/lib/data/products';
import { MediaImage } from '@/components/ui/media-image';
import { SectionHeader } from '@/components/ui/section-header';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

export function FeaturedCollections() {
  const cols = featuredCollections.slice(0, 5);
  // Editorial mosaic: first card is tall, next four in a 2x2 grid.
  return (
    <section className="container-page mt-20 lg:mt-28">
      <SectionHeader
        eyebrow="Curated edits"
        title="Explore our collections"
        description="From season-defining arrivals to the pieces our community can’t stop reordering."
        cta={{ label: 'All collections', href: '/collections' }}
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:gap-5">
        <CollectionCard collection={cols[0]} className="lg:row-span-2 lg:min-h-[560px]" large />
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:gap-5">
          {cols.slice(1, 5).map((c) => (
            <CollectionCard key={c.handle} collection={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({
  collection,
  className,
  large,
}: {
  collection: (typeof featuredCollections)[number];
  className?: string;
  large?: boolean;
}) {
  const count = getProductsByCollection(collection.handle).length;
  return (
    <Reveal className={cn('h-full', className)}>
      <Link
        href={`/collections/${collection.handle}`}
        className={cn(
          'group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-card p-6 text-white',
          large && 'p-8',
        )}
      >
        <MediaImage
          seed={collection.seed}
          alt={collection.title}
          monogram={false}
          sizes={large ? '(max-width: 1024px) 100vw, 33vw' : '(max-width: 1024px) 50vw, 25vw'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent transition-all duration-500 group-hover:from-black/70" />
        <div className="relative">
          {collection.eyebrow && (
            <p className="text-xs font-medium uppercase tracking-eyebrow text-white/80">{collection.eyebrow}</p>
          )}
          <div className="mt-1.5 flex items-end justify-between gap-3">
            <div>
              <h3 className={cn('font-serif leading-tight text-white', large ? 'text-3xl' : 'text-2xl')}>
                {collection.title}
              </h3>
              <p className="mt-1 text-sm text-white/70">{count} pieces</p>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition-all duration-300 group-hover:bg-white group-hover:text-ink">
              <ArrowUpRight size={20} />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
