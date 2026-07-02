'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

/** Horizontal, scroll-snapping product rail with arrow controls (desktop) and
 *  native swipe (touch). */
export function ProductRail({ products, className }: { products: Product[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function onScroll() {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }

  function scrollBy(dir: number) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  }

  return (
    <div className={cn('relative', className)}>
      <div
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-1 sm:mx-0 sm:px-0 md:gap-6"
      >
        {products.map((p, i) => (
          <div
            key={p.id}
            className="w-[70%] shrink-0 snap-start sm:w-[45%] md:w-[31%] lg:w-[23.5%]"
          >
            <ProductCard product={p} priority={i < 2} />
          </div>
        ))}
      </div>

      {/* Arrows (desktop) */}
      <button
        onClick={() => scrollBy(-1)}
        disabled={atStart}
        aria-label="Scroll left"
        className={cn(
          'absolute -left-4 top-[34%] z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-soft transition-all hover:bg-ink hover:text-canvas disabled:pointer-events-none disabled:opacity-0 lg:grid',
        )}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scrollBy(1)}
        disabled={atEnd}
        aria-label="Scroll right"
        className={cn(
          'absolute -right-4 top-[34%] z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-soft transition-all hover:bg-ink hover:text-canvas disabled:pointer-events-none disabled:opacity-0 lg:grid',
        )}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
