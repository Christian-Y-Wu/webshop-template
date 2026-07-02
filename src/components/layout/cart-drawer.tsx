'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Gift, Lock, Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { useStore } from '@/components/providers/store-provider';
import { useUI } from '@/components/providers/ui-provider';
import { siteConfig } from '@/config/site';
import { products } from '@/lib/data/products';
import { MediaImage } from '@/components/ui/media-image';
import { Price } from '@/components/ui/price';
import { FreeShippingBar } from '@/components/ui/free-shipping-bar';
import { PaymentIcons } from '@/components/ui/payment-icons';
import { formatMoney } from '@/lib/utils';

export function CartDrawer() {
  const { overlay, closeOverlay } = useUI();
  const open = overlay === 'cart';
  const { lines, subtotal, updateQuantity, removeLine, toggleGiftWrap, saveForLater, currency } = useStore();
  const [discount, setDiscount] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const recommendations = products
    .filter((p) => p.bestSeller && !lines.some((l) => l.productId === p.id))
    .slice(0, 4);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOverlay}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-canvas"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="flex items-center gap-2 font-serif text-xl">
                Your cart
                <span className="text-sm text-ink-muted">
                  ({lines.reduce((s, l) => s + l.quantity, 0)})
                </span>
              </h2>
              <button onClick={closeOverlay} className="btn-ghost -mr-2" aria-label="Close cart">
                <X size={22} />
              </button>
            </div>

            {lines.length === 0 ? (
              <EmptyCart onClose={closeOverlay} />
            ) : (
              <>
                {/* Free shipping */}
                {siteConfig.features.freeShippingBar && (
                  <div className="border-b border-line px-5 py-4">
                    <FreeShippingBar subtotal={subtotal} />
                  </div>
                )}

                {/* Lines */}
                <div className="flex-1 overflow-y-auto px-5">
                  <ul className="divide-y divide-line">
                    {lines.map((line) => (
                      <li key={line.id} className="flex gap-4 py-4">
                        <Link
                          href={`/products/${line.slug}`}
                          onClick={closeOverlay}
                          className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted"
                        >
                          <MediaImage seed={line.image.seed} alt={line.image.alt} monogram={false} />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <Link
                              href={`/products/${line.slug}`}
                              onClick={closeOverlay}
                              className="text-sm font-medium text-ink hover:text-accent"
                            >
                              {line.title}
                            </Link>
                            <button
                              onClick={() => removeLine(line.id)}
                              className="text-ink-muted transition-colors hover:text-sale"
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className="mt-0.5 text-xs text-ink-muted">
                            {[line.color, line.size].filter(Boolean).join(' · ')}
                          </p>

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-pill border border-line">
                              <button
                                onClick={() => updateQuantity(line.id, line.quantity - 1)}
                                className="grid h-8 w-8 place-items-center text-ink-soft hover:text-ink"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-7 text-center text-sm tabular-nums">{line.quantity}</span>
                              <button
                                onClick={() => updateQuantity(line.id, line.quantity + 1)}
                                className="grid h-8 w-8 place-items-center text-ink-soft hover:text-ink"
                                aria-label="Increase quantity"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <Price amount={line.price * line.quantity} size="sm" />
                          </div>

                          <button
                            onClick={() => saveForLater(line.id)}
                            className="mt-2 self-start text-[11px] text-ink-muted underline-offset-2 hover:text-ink hover:underline"
                          >
                            Save for later
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Gift wrap */}
                  {siteConfig.features.giftWrap && (
                    <label className="my-3 flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface p-3">
                      <input
                        type="checkbox"
                        checked={lines.some((l) => l.giftWrap)}
                        onChange={(e) => lines.forEach((l) => toggleGiftWrap(l.id, e.target.checked))}
                        className="h-4 w-4 accent-[rgb(var(--color-accent))]"
                      />
                      <Gift size={17} className="text-accent" />
                      <span className="flex-1 text-sm text-ink-soft">Add gift wrapping</span>
                      <span className="text-sm font-medium">{formatMoney(siteConfig.giftWrapPrice, currency)}</span>
                    </label>
                  )}

                  {/* Discount */}
                  <div className="my-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <input
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          placeholder="Discount code"
                          className="input pl-9"
                        />
                      </div>
                      <button
                        onClick={() => setDiscountApplied(Boolean(discount.trim()))}
                        className="btn-outline px-5"
                      >
                        Apply
                      </button>
                    </div>
                    {discountApplied && (
                      <p className="mt-2 text-xs text-success">✓ Code “{discount}” will be validated at checkout.</p>
                    )}
                  </div>

                  {/* Recommendations */}
                  {recommendations.length > 0 && (
                    <div className="border-t border-line py-4">
                      <p className="eyebrow mb-3">You may also like</p>
                      <div className="flex gap-3 overflow-x-auto no-scrollbar">
                        {recommendations.map((p) => (
                          <Link
                            key={p.id}
                            href={`/products/${p.slug}`}
                            onClick={closeOverlay}
                            className="w-28 shrink-0"
                          >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                              <MediaImage seed={p.images[0].seed} alt={p.images[0].alt} monogram={false} />
                            </div>
                            <p className="mt-1.5 truncate text-xs font-medium">{p.title}</p>
                            <Price amount={p.price} size="sm" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-line bg-surface px-5 py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-ink-soft">Subtotal</span>
                    <span className="font-serif text-xl">{formatMoney(subtotal, currency)}</span>
                  </div>
                  <p className="mb-3 text-xs text-ink-muted">
                    Shipping, taxes and discounts calculated at checkout.
                  </p>
                  <Link href="/cart" onClick={closeOverlay} className="btn-outline mb-2 w-full">
                    View cart
                  </Link>
                  <Link href="/checkout" onClick={closeOverlay} className="btn-accent w-full">
                    <Lock size={15} /> Secure checkout
                  </Link>

                  {/* Express checkout */}
                  <div className="mt-3">
                    <p className="mb-2 text-center text-[11px] uppercase tracking-widest text-ink-muted">
                      Express checkout
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {['shoppay', 'applepay', 'googlepay'].map((m) => (
                        <button
                          key={m}
                          className="flex h-10 items-center justify-center rounded-lg border border-line bg-canvas text-xs font-semibold uppercase text-ink-soft transition-colors hover:border-ink"
                        >
                          {m === 'shoppay' ? 'Shop Pay' : m === 'applepay' ? ' Pay' : 'G Pay'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-muted">
                    <Lock size={12} /> Secure SSL encrypted checkout
                  </div>
                  <PaymentIcons methods={siteConfig.payments} className="mt-2 justify-center" />
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-surface-muted">
        <ShoppingBag size={30} className="text-ink-muted" />
      </div>
      <h3 className="mt-5 font-serif text-2xl">Your cart is empty</h3>
      <p className="mt-2 text-sm text-ink-muted">
        Discover something you’ll love — your next favourite is a click away.
      </p>
      <Link href="/collections/best-sellers" onClick={onClose} className="btn-primary mt-6">
        Shop best sellers
      </Link>
      <Link href="/collections/new-arrivals" onClick={onClose} className="mt-3 text-sm text-ink-soft link-underline">
        Browse new arrivals
      </Link>
    </div>
  );
}
