'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, Plus, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { MediaImage } from '@/components/ui/media-image';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import { StarRating } from '@/components/ui/star-rating';
import { useStore } from '@/components/providers/store-provider';
import { useUI } from '@/components/providers/ui-provider';
import { siteConfig } from '@/config/site';
import { cn, compactNumber } from '@/lib/utils';
import type { Product } from '@/lib/types';

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const { isWishlisted, toggleWishlist, addLine } = useStore();
  const { toast, openOverlay, openQuickView } = useUI();
  const [activeColor, setActiveColor] = useState(product.colors?.[0]?.name);

  const wishlisted = isWishlisted(product.id);
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= (product.lowStockThreshold ?? 6);
  const primary = product.images[0];
  const secondary = product.images[1] ?? product.images[0];
  const needsOptions = Boolean(product.sizes?.length);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (soldOut) return;
    if (needsOptions) {
      openQuickView(product);
      return;
    }
    addLine({ product, color: activeColor, quantity: 1 });
    toast({
      title: 'Added to cart',
      description: product.title,
      image: primary.seed,
      variant: 'success',
    });
    openOverlay('cart');
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggleWishlist(product.id);
    if (!wishlisted) {
      toast({ title: 'Saved to wishlist', description: product.title, variant: 'wishlist' });
    }
  }

  return (
    <div className={cn('group/card relative flex flex-col', className)}>
      {/* Media */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-card bg-surface-muted"
        aria-label={product.title}
      >
        <MediaImage
          seed={primary.seed}
          src={primary.src}
          alt={primary.alt}
          priority={priority}
          className="transition-opacity duration-500 ease-premium group-hover/card:opacity-0"
        />
        <MediaImage
          seed={secondary.seed}
          src={secondary.src}
          alt={secondary.alt}
          monogram={false}
          className="scale-105 opacity-0 transition-all duration-700 ease-premium group-hover/card:scale-100 group-hover/card:opacity-100"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {soldOut && <Badge tone="ink">Sold out</Badge>}
          {!soldOut &&
            product.badges
              ?.slice(0, 2)
              .map((b) => (
                <Badge key={b.label} tone={b.tone}>
                  {b.label}
                </Badge>
              ))}
          {lowStock && !soldOut && (
            <Badge tone="highlight" className="normal-case tracking-normal">
              Only {product.stock} left
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        {siteConfig.features.wishlist && (
          <button
            onClick={handleWishlist}
            aria-pressed={wishlisted}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-surface/80 text-ink shadow-soft backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-surface"
          >
            <Heart size={16} className={cn('transition-colors', wishlisted && 'fill-accent text-accent')} />
          </button>
        )}

        {/* Desktop hover actions */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-3 gap-2 opacity-0 transition-all duration-300 ease-premium group-hover/card:pointer-events-auto group-hover/card:translate-y-0 group-hover/card:opacity-100 sm:flex">
          {siteConfig.features.quickAdd && (
            <button
              onClick={handleQuickAdd}
              disabled={soldOut}
              className="btn flex-1 bg-ink/95 py-3 text-canvas backdrop-blur hover:bg-accent hover:text-accent-ink disabled:opacity-60"
            >
              {soldOut ? 'Sold out' : needsOptions ? 'Choose options' : 'Quick add'}
              {!soldOut && !needsOptions && <Plus size={15} />}
            </button>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              openQuickView(product);
            }}
            aria-label="Quick view"
            className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-pill bg-surface/90 text-ink shadow-soft backdrop-blur transition-colors hover:bg-surface"
          >
            <Eye size={17} />
          </button>
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col pt-3.5">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <StarRating rating={product.rating.rating} size={12} />
          <span>({compactNumber(product.rating.count)})</span>
        </div>

        <h3 className="mt-1.5 text-[15px] font-medium leading-snug text-ink">
          <Link href={`/products/${product.slug}`} className="link-underline">
            {product.title}
          </Link>
        </h3>
        {product.tagline && <p className="mt-0.5 text-xs text-ink-muted">{product.tagline}</p>}

        <div className="mt-2">
          <Price amount={product.price} compareAt={product.compareAtPrice} />
        </div>

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5">
            {product.colors.slice(0, 5).map((c) => (
              <button
                key={c.name}
                onMouseEnter={() => setActiveColor(c.name)}
                onFocus={() => setActiveColor(c.name)}
                aria-label={c.name}
                title={c.name}
                className={cn(
                  'h-4 w-4 rounded-full ring-1 ring-inset ring-black/10 transition-transform hover:scale-110',
                  activeColor === c.name && 'ring-2 ring-ink ring-offset-1 ring-offset-canvas',
                )}
                style={{ background: c.hex }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[11px] text-ink-muted">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        {/* Mobile quick add */}
        {siteConfig.features.quickAdd && (
          <button
            onClick={handleQuickAdd}
            disabled={soldOut}
            className="btn-outline mt-3 py-2.5 text-[13px] sm:hidden"
          >
            {soldOut ? 'Sold out' : needsOptions ? 'Choose options' : 'Quick add'}
          </button>
        )}
      </div>
    </div>
  );
}

/** Skeleton placeholder shown while a product grid loads. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="skeleton aspect-[4/5] w-full rounded-card" />
      <div className="mt-3.5 space-y-2">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-16 rounded" />
      </div>
    </div>
  );
}
