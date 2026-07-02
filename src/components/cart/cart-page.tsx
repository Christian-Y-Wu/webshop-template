'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Gift, Lock, Minus, Plus, ShoppingBag, Tag, Trash2, Undo2 } from 'lucide-react';
import { useStore } from '@/components/providers/store-provider';
import { MediaImage } from '@/components/ui/media-image';
import { Price } from '@/components/ui/price';
import { FreeShippingBar } from '@/components/ui/free-shipping-bar';
import { PaymentIcons } from '@/components/ui/payment-icons';
import { ProductRail } from '@/components/product/product-rail';
import { products } from '@/lib/data/products';
import { siteConfig } from '@/config/site';
import { formatMoney } from '@/lib/utils';

export function CartPageContent() {
  const {
    lines,
    subtotal,
    updateQuantity,
    removeLine,
    saveForLater,
    savedForLater,
    moveToCart,
    currency,
    hydrated,
  } = useStore();
  const [code, setCode] = useState('');

  const giftWrapTotal = lines.filter((l) => l.giftWrap).length * siteConfig.giftWrapPrice;
  const recommendations = products.filter((p) => p.bestSeller).slice(0, 8);

  if (!hydrated) {
    return <div className="container-page py-24 text-center text-ink-muted">Loading your cart…</div>;
  }

  if (lines.length === 0 && savedForLater.length === 0) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-surface-muted">
            <ShoppingBag size={38} className="text-ink-muted" />
          </div>
          <h1 className="mt-6 font-serif text-3xl">Your cart is empty</h1>
          <p className="mt-3 text-ink-soft">
            Looks like you haven’t added anything yet. Let’s find something you’ll love.
          </p>
          <Link href="/collections/best-sellers" className="btn-primary mt-8">
            Shop best sellers <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-20">
          <p className="eyebrow mb-6 text-center">You may also like</p>
          <ProductRail products={recommendations} />
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8 lg:py-12">
      <h1 className="font-serif text-3xl lg:text-4xl">Shopping cart</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {lines.reduce((s, l) => s + l.quantity, 0)} item(s) in your cart
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
        {/* Lines */}
        <div>
          {siteConfig.features.freeShippingBar && lines.length > 0 && (
            <div className="mb-6 rounded-card border border-line bg-surface p-5">
              <FreeShippingBar subtotal={subtotal} />
            </div>
          )}

          {lines.length > 0 ? (
            <ul className="divide-y divide-line border-y border-line">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 py-5 sm:gap-6">
                  <Link
                    href={`/products/${line.slug}`}
                    className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:h-36 sm:w-28"
                  >
                    <MediaImage seed={line.image.seed} alt={line.image.alt} monogram={false} sizes="112px" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link href={`/products/${line.slug}`} className="font-medium text-ink hover:text-accent">
                          {line.title}
                        </Link>
                        <p className="mt-0.5 text-sm text-ink-muted">
                          {[line.color, line.size].filter(Boolean).join(' · ')}
                        </p>
                        {line.giftWrap && (
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-accent">
                            <Gift size={12} /> Gift wrapped
                          </p>
                        )}
                      </div>
                      <Price amount={line.price * line.quantity} compareAt={line.compareAtPrice ? line.compareAtPrice * line.quantity : null} />
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-pill border border-line">
                        <button onClick={() => updateQuantity(line.id, line.quantity - 1)} className="grid h-9 w-9 place-items-center text-ink-soft hover:text-ink" aria-label="Decrease">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                        <button onClick={() => updateQuantity(line.id, line.quantity + 1)} className="grid h-9 w-9 place-items-center text-ink-soft hover:text-ink" aria-label="Increase">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <button onClick={() => saveForLater(line.id)} className="text-ink-muted hover:text-ink">
                          Save for later
                        </button>
                        <button onClick={() => removeLine(line.id)} className="inline-flex items-center gap-1 text-ink-muted hover:text-sale" aria-label="Remove">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-card border border-dashed border-line py-10 text-center text-ink-muted">
              Your cart is empty — but you have items saved for later.
            </p>
          )}

          <Link href="/collections/all" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink link-underline">
            <ArrowRight size={15} className="rotate-180" /> Continue shopping
          </Link>

          {/* Saved for later */}
          {savedForLater.length > 0 && (
            <div className="mt-12">
              <h2 className="font-serif text-xl">Saved for later ({savedForLater.length})</h2>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {savedForLater.map((line) => (
                  <li key={line.id} className="flex items-center gap-4 py-4">
                    <Link href={`/products/${line.slug}`} className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg">
                      <MediaImage seed={line.image.seed} alt={line.image.alt} monogram={false} sizes="64px" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/products/${line.slug}`} className="text-sm font-medium text-ink hover:text-accent">
                        {line.title}
                      </Link>
                      <p className="text-xs text-ink-muted">{[line.color, line.size].filter(Boolean).join(' · ')}</p>
                      <Price amount={line.price} size="sm" className="mt-0.5" />
                    </div>
                    <button onClick={() => moveToCart(line.id)} className="btn-outline gap-1.5 px-4 py-2 text-xs">
                      <Undo2 size={14} /> Move to cart
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-line bg-surface p-6">
            <h2 className="font-serif text-xl">Order summary</h2>

            {/* Discount */}
            <div className="mt-5 flex gap-2">
              <div className="relative flex-1">
                <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount or gift card" className="input pl-9" />
              </div>
              <button className="btn-outline px-5">Apply</button>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-medium">{formatMoney(subtotal - giftWrapTotal, currency)}</dd>
              </div>
              {giftWrapTotal > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Gift wrapping</dt>
                  <dd className="font-medium">{formatMoney(giftWrapTotal, currency)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-soft">Shipping</dt>
                <dd className="font-medium text-success">
                  {subtotal >= siteConfig.freeShippingThreshold ? 'Free' : 'Calculated at checkout'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Estimated tax</dt>
                <dd className="text-ink-muted">Calculated at checkout</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
              <span className="font-medium">Total</span>
              <span className="font-serif text-2xl">{formatMoney(subtotal, currency)}</span>
            </div>

            <Link href="/checkout" className="btn-accent mt-6 w-full">
              <Lock size={15} /> Secure checkout
            </Link>

            <div className="mt-4">
              <p className="mb-2 text-center text-[11px] uppercase tracking-widest text-ink-muted">Express checkout</p>
              <div className="grid grid-cols-3 gap-2">
                {['Shop Pay', ' Pay', 'G Pay'].map((m) => (
                  <button key={m} className="flex h-10 items-center justify-center rounded-lg border border-line bg-canvas text-xs font-semibold text-ink-soft hover:border-ink">
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-ink-muted">
              <Lock size={12} /> SSL secured · 256-bit encryption
            </div>
            <PaymentIcons methods={siteConfig.payments} className="mt-2 justify-center" />
          </div>
        </aside>
      </div>

      {/* Recommendations */}
      <div className="mt-20">
        <p className="eyebrow mb-6">Complete your order</p>
        <ProductRail products={recommendations} />
      </div>
    </div>
  );
}
