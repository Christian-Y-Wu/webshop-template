'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Check,
  Heart,
  Lock,
  Minus,
  Plus,
  RefreshCw,
  Ruler,
  Scale,
  Share2,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useStore } from '@/components/providers/store-provider';
import { useUI } from '@/components/providers/ui-provider';
import { Price } from '@/components/ui/price';
import { StarRating } from '@/components/ui/star-rating';
import { PaymentIcons } from '@/components/ui/payment-icons';
import { siteConfig } from '@/config/site';
import { cn, compactNumber, discountPercent } from '@/lib/utils';
import type { Product } from '@/lib/types';

export function ProductBuyBox({ product }: { product: Product }) {
  const { addLine, toggleWishlist, isWishlisted, toggleCompare, isCompared, addRecentlyViewed } = useStore();
  const { openOverlay, toast } = useUI();

  const [color, setColor] = useState(product.colors?.[0]?.name);
  const [size, setSize] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    addRecentlyViewed(product.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= (product.lowStockThreshold ?? 6);
  const needsSize = Boolean(product.sizes?.length);
  const wishlisted = isWishlisted(product.id);
  const compared = isCompared(product.id);
  const off = discountPercent(product.price, product.compareAtPrice);

  const delivery = useMemo(() => {
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const from = new Date();
    from.setDate(from.getDate() + 3);
    const to = new Date();
    to.setDate(to.getDate() + 6);
    return `${fmt(from)} – ${fmt(to)}`;
  }, []);

  function validate() {
    if (needsSize && !size) {
      setSizeError(true);
      return false;
    }
    return true;
  }

  function handleAdd(openCart = true) {
    if (soldOut || !validate()) return;
    addLine({ product, color, size, quantity: qty });
    toast({ title: 'Added to cart', description: product.title, image: product.images[0].seed, variant: 'success' });
    if (openCart) openOverlay('cart');
  }

  return (
    <div className="lg:pl-4">
      {/* Brand + title */}
      {product.brand && <p className="eyebrow">{product.brand}</p>}
      <h1 className="mt-2 font-serif text-[clamp(1.9rem,3vw,2.75rem)] leading-tight">{product.title}</h1>
      {product.subtitle && <p className="mt-1.5 text-ink-soft">{product.subtitle}</p>}

      {/* Rating */}
      <div className="mt-3 flex items-center gap-3">
        <StarRating rating={product.rating.rating} size={16} />
        <a href="#reviews" className="text-sm text-ink-soft hover:text-ink">
          {product.rating.rating} · {compactNumber(product.rating.count)} reviews
        </a>
      </div>

      {/* Price */}
      <div className="mt-5 flex items-center gap-3">
        <Price amount={product.price} compareAt={product.compareAtPrice} size="lg" />
        {off > 0 && <span className="badge bg-sale text-white">Save {off}%</span>}
      </div>
      <p className="mt-1 text-xs text-ink-muted">Tax included. Shipping calculated at checkout.</p>

      {/* Colors */}
      {product.colors && (
        <div className="mt-7">
          <p className="mb-2.5 text-sm font-medium text-ink">
            Colour: <span className="text-ink-soft">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                aria-label={c.name}
                aria-pressed={color === c.name}
                title={c.name}
                className={cn(
                  'h-9 w-9 rounded-full ring-1 ring-inset ring-black/10 transition-transform hover:scale-110',
                  color === c.name && 'ring-2 ring-ink ring-offset-2 ring-offset-canvas',
                )}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes && (
        <div className="mt-7">
          <div className="mb-2.5 flex items-center justify-between">
            <p className={cn('text-sm font-medium', sizeError ? 'text-sale' : 'text-ink')}>
              {sizeError ? 'Please select a size' : 'Size'}
            </p>
            <button className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink">
              <Ruler size={14} /> Size guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSize(s);
                  setSizeError(false);
                }}
                className={cn(
                  'min-w-[52px] rounded-xl border px-4 py-3 text-sm transition-all',
                  size === s
                    ? 'border-ink bg-ink text-canvas'
                    : 'border-line text-ink-soft hover:border-ink',
                  sizeError && 'border-sale/40',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock indicator */}
      <div className="mt-6">
        {soldOut ? (
          <p className="inline-flex items-center gap-2 text-sm text-ink-muted">
            <span className="h-2 w-2 rounded-full bg-ink-muted" /> Currently out of stock
          </p>
        ) : lowStock ? (
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-medium text-sale">
              <span className="h-2 w-2 animate-pulse rounded-full bg-sale" /> Low stock — only {product.stock} left
            </p>
            <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-surface-muted">
              <div className="h-full rounded-full bg-sale" style={{ width: `${Math.min(100, (product.stock / 15) * 100)}%` }} />
            </div>
          </div>
        ) : (
          <p className="inline-flex items-center gap-2 text-sm text-success">
            <Check size={15} /> In stock — ready to ship
          </p>
        )}
      </div>

      {/* Quantity + actions */}
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex items-center rounded-pill border border-line">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-[52px] w-12 place-items-center text-ink-soft hover:text-ink" aria-label="Decrease quantity">
              <Minus size={16} />
            </button>
            <span className="w-8 text-center tabular-nums">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="grid h-[52px] w-12 place-items-center text-ink-soft hover:text-ink" aria-label="Increase quantity">
              <Plus size={16} />
            </button>
          </div>
          <button onClick={() => handleAdd()} disabled={soldOut} className="btn-primary flex-1">
            {soldOut ? 'Sold out' : 'Add to cart'}
            {!soldOut && <span className="opacity-60">·</span>}
            {!soldOut && <Price amount={product.price * qty} className="text-canvas" />}
          </button>
        </div>

        <button onClick={() => handleAdd(false)} disabled={soldOut} className="btn-accent w-full">
          <Lock size={15} /> Buy it now
        </button>

        <div className="flex gap-3">
          {siteConfig.features.wishlist && (
            <button
              onClick={() => {
                toggleWishlist(product.id);
                if (!wishlisted) toast({ title: 'Saved to wishlist', description: product.title, variant: 'wishlist' });
              }}
              className={cn('btn-outline flex-1 py-3', wishlisted && 'border-accent text-accent')}
            >
              <Heart size={16} className={cn(wishlisted && 'fill-accent')} />
              {wishlisted ? 'Saved' : 'Wishlist'}
            </button>
          )}
          {siteConfig.features.compare && (
            <button
              onClick={() => toggleCompare(product.id)}
              className={cn('btn-outline flex-1 py-3', compared && 'border-accent text-accent')}
            >
              <Scale size={16} />
              {compared ? 'Comparing' : 'Compare'}
            </button>
          )}
          <button className="btn-outline shrink-0 px-4 py-3" aria-label="Share">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Express checkout */}
      <div className="mt-4">
        <p className="mb-2 text-center text-[11px] uppercase tracking-widest text-ink-muted">— Express checkout —</p>
        <div className="grid grid-cols-3 gap-2">
          {['Shop Pay', ' Pay', 'G Pay'].map((m) => (
            <button key={m} className="flex h-11 items-center justify-center rounded-xl border border-line bg-surface text-sm font-semibold text-ink-soft transition-colors hover:border-ink">
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery + guarantees */}
      <div className="mt-7 space-y-3 rounded-card border border-line bg-surface p-5">
        <div className="flex items-start gap-3">
          <Truck size={18} className="mt-0.5 shrink-0 text-accent" />
          <div className="text-sm">
            <p className="font-medium text-ink">Estimated delivery {delivery}</p>
            <p className="text-ink-muted">Free shipping over ${siteConfig.freeShippingThreshold} · Carbon-neutral</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RefreshCw size={18} className="mt-0.5 shrink-0 text-accent" />
          <div className="text-sm">
            <p className="font-medium text-ink">Free {siteConfig.trust.guaranteeDays}-day returns</p>
            <p className="text-ink-muted">Not quite right? Send it back, on us.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-accent" />
          <div className="text-sm">
            <p className="font-medium text-ink">2-year quality guarantee</p>
            <p className="text-ink-muted">We stand behind every piece we make.</p>
          </div>
        </div>
      </div>

      {/* Trust row */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
          <BadgeCheck size={14} className="text-success" /> Secure SSL checkout
        </span>
        <PaymentIcons methods={siteConfig.payments} />
      </div>
    </div>
  );
}
