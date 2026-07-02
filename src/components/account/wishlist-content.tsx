'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useStore } from '@/components/providers/store-provider';
import { getProductById } from '@/lib/data/products';
import { ProductGrid } from '@/components/product/product-grid';
import type { Product } from '@/lib/types';

export function WishlistContent() {
  const { wishlist, hydrated } = useStore();

  if (!hydrated) return <p className="text-ink-muted">Loading…</p>;

  const items = wishlist.map((id) => getProductById(id)).filter((p): p is Product => Boolean(p));

  if (items.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-surface-muted">
          <Heart size={26} className="text-ink-muted" />
        </div>
        <h2 className="mt-5 font-serif text-2xl">Your wishlist is empty</h2>
        <p className="mt-2 text-sm text-ink-muted">Tap the heart on any product to save it here for later.</p>
        <Link href="/collections/best-sellers" className="btn-primary mt-6">
          Explore best sellers
        </Link>
      </div>
    );
  }

  return <ProductGrid products={items} columns={3} />;
}
