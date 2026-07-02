import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { collections } from '@/lib/data/collections';
import { getProductsByCollection } from '@/lib/data/products';
import { buildMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { MediaImage } from '@/components/ui/media-image';
import { Reveal } from '@/components/ui/reveal';

export const metadata: Metadata = buildMetadata({
  title: 'All Collections',
  description: 'Browse every AURA collection — from new arrivals to the pieces our community loves most.',
  path: '/collections',
});

export default function CollectionsIndexPage() {
  const shown = collections.filter((c) => c.handle !== 'all');

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Collections', href: '/collections' }]} className="mb-6" />
      <header className="max-w-2xl">
        <p className="eyebrow mb-3">Explore</p>
        <h1 className="text-display">All Collections</h1>
        <p className="mt-4 text-ink-soft">
          Thoughtfully curated edits for every corner of life. Find the pieces that feel like you.
        </p>
      </header>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {shown.map((c, i) => {
          const count = getProductsByCollection(c.handle).length;
          return (
            <Reveal key={c.handle} delay={(i % 3) * 60}>
              <Link
                href={`/collections/${c.handle}`}
                className="group relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-card p-6 text-white"
              >
                <MediaImage seed={c.seed} alt={c.title} monogram={false} sizes="(max-width: 1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-all duration-500 group-hover:from-black/70" />
                <div className="relative flex items-end justify-between gap-3">
                  <div>
                    {c.eyebrow && <p className="text-xs uppercase tracking-eyebrow text-white/75">{c.eyebrow}</p>}
                    <h2 className="mt-1 font-serif text-2xl text-white">{c.title}</h2>
                    <p className="mt-0.5 text-sm text-white/70">{count} pieces</p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition-all group-hover:bg-white group-hover:text-ink">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
