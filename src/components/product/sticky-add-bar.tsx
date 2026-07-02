'use client';

import { useEffect, useState } from 'react';
import { MediaImage } from '@/components/ui/media-image';
import { Price } from '@/components/ui/price';
import { useStore } from '@/components/providers/store-provider';
import { useUI } from '@/components/providers/ui-provider';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

/** Sticky bottom add-to-cart bar that appears after scrolling past the hero
 *  buy box. Thumb-friendly on mobile, compact on desktop. */
export function StickyAddBar({ product }: { product: Product }) {
  const { addLine } = useStore();
  const { openOverlay, toast, openQuickView } = useUI();
  const [visible, setVisible] = useState(false);
  const soldOut = product.stock <= 0;
  const needsOptions = Boolean(product.sizes?.length);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handle() {
    if (soldOut) return;
    if (needsOptions) {
      openQuickView(product);
      return;
    }
    addLine({ product, color: product.colors?.[0]?.name, quantity: 1 });
    toast({ title: 'Added to cart', description: product.title, image: product.images[0].seed, variant: 'success' });
    openOverlay('cart');
  }

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 backdrop-blur-md transition-transform duration-300 ease-premium',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative hidden h-12 w-11 shrink-0 overflow-hidden rounded-lg sm:block">
            <MediaImage seed={product.images[0].seed} alt="" monogram={false} sizes="44px" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{product.title}</p>
            <Price amount={product.price} compareAt={product.compareAtPrice} size="sm" />
          </div>
        </div>
        <button onClick={handle} disabled={soldOut} className="btn-primary shrink-0 px-6 py-3 sm:px-10">
          {soldOut ? 'Sold out' : needsOptions ? 'Choose options' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
