'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { products } from '@/lib/data/products';
import { ProductRail } from '@/components/product/product-rail';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

const tabs = [
  { key: 'best', label: 'Best Sellers', filter: (p: (typeof products)[number]) => p.bestSeller, href: '/collections/best-sellers' },
  { key: 'new', label: 'New Arrivals', filter: (p: (typeof products)[number]) => p.newArrival, href: '/collections/new-arrivals' },
  { key: 'trending', label: 'Trending', filter: (p: (typeof products)[number]) => p.trending, href: '/collections/trending' },
] as const;

export function FeaturedProducts() {
  const [active, setActive] = useState<(typeof tabs)[number]['key']>('best');
  const tab = tabs.find((t) => t.key === active)!;
  const items = products.filter(tab.filter).slice(0, 8);

  return (
    <section className="container-page mt-20 lg:mt-28">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <p className="eyebrow mb-3">Shop the edit</p>
          <h2 className="text-headline">Pieces you’ll reach for</h2>
        </Reveal>
        <div className="flex flex-wrap items-center gap-1 rounded-pill border border-line bg-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={cn(
                'rounded-pill px-4 py-2 text-sm font-medium transition-colors',
                active === t.key ? 'bg-ink text-canvas' : 'text-ink-soft hover:text-ink',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ProductRail products={items} className="mt-9" />

      <div className="mt-8 flex justify-center">
        <Link href={tab.href} className="btn-outline">
          View all {tab.label.toLowerCase()}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
