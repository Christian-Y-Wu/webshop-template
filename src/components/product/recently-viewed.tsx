'use client';

import { useStore } from '@/components/providers/store-provider';
import { getProductById } from '@/lib/data/products';
import { ProductRail } from '@/components/product/product-rail';
import { SectionHeader } from '@/components/ui/section-header';
import type { Product } from '@/lib/types';

/** Shows the shopper's recently viewed products. Renders nothing until there
 *  are at least two, so it never looks empty. */
export function RecentlyViewed({ excludeId, title = 'Recently viewed' }: { excludeId?: string; title?: string }) {
  const { recentlyViewed, hydrated } = useStore();

  if (!hydrated) return null;
  const items = recentlyViewed
    .filter((id) => id !== excludeId)
    .map((id) => getProductById(id))
    .filter((p): p is Product => Boolean(p));

  if (items.length < 2) return null;

  return (
    <section className="container-page mt-20 lg:mt-28">
      <SectionHeader eyebrow="Pick up where you left off" title={title} />
      <ProductRail products={items} className="mt-9" />
    </section>
  );
}
