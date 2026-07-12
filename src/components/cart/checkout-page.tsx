'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Gift, Lock, ShieldCheck, Tag, Truck } from 'lucide-react';
import { useStore } from '@/components/providers/store-provider';
import { MediaImage } from '@/components/ui/media-image';
import { PaymentIcons } from '@/components/ui/payment-icons';
import { siteConfig } from '@/config/site';
import { formatMoney } from '@/lib/utils';
import { findDiscount, applyDiscount } from '@/lib/discounts';

export function CheckoutPageContent() {
  const { lines, subtotal, hydrated } = useStore();
  // Checkout always charges (and displays) in the store's base currency,
  // never the shopper's illustrative display currency — see the note on
  // siteConfig.currencies and src/app/api/checkout/route.ts.
  const currency = siteConfig.currencies.find((c) => c.code === siteConfig.defaultCurrency) ?? siteConfig.currencies[0];

  const [email, setEmail] = useState('');
  const [discount, setDiscount] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<ReturnType<typeof findDiscount>>(undefined);
  const [discountError, setDiscountError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const shippingBase = subtotal >= siteConfig.freeShippingThreshold || subtotal === 0 ? 0 : 6.95;
  const { shipping, discountAmount } = applyDiscount(subtotal, shippingBase, appliedDiscount);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.08;
  const total = taxableAmount + shipping + tax;

  function applyDiscountCode() {
    const found = findDiscount(discount);
    setAppliedDiscount(found);
    setDiscountError(!found);
  }

  async function handlePay() {
    setLoading(true);
    setPayError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: lines.map((l) => ({ title: l.title, price: l.price, quantity: l.quantity })),
          shipping,
          tax,
          discountCode: appliedDiscount?.code,
          customerEmail: email || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setPayError(
        data.error === 'not_configured'
          ? 'Add STRIPE_SECRET_KEY to .env.local to accept real payments — this is demo mode.'
          : 'Something went wrong placing your order. Please try again.',
      );
    } catch {
      setPayError('Something went wrong placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (hydrated && lines.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-serif text-3xl">Your cart is empty</h1>
        <p className="mt-3 text-ink-soft">Add something before heading to checkout.</p>
        <Link href="/collections/all" className="btn-primary mt-8">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
        {/* Form side */}
        <div className="px-5 py-8 sm:px-10 lg:py-12">
          <div className="mx-auto max-w-lg">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl">Checkout</h1>
              <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
                <ChevronLeft size={15} /> Back to cart
              </Link>
            </div>

            {/* Express */}
            <div className="mt-8">
              <div className="grid grid-cols-3 gap-2">
                {['Shop Pay', 'Apple Pay', 'G Pay'].map((m) => (
                  <button key={m} className="flex h-12 items-center justify-center rounded-xl border border-line bg-canvas text-sm font-semibold text-ink-soft transition-colors hover:border-ink">
                    {m}
                  </button>
                ))}
              </div>
              <div className="my-6 flex items-center gap-4 text-xs text-ink-muted">
                <span className="h-px flex-1 bg-line" /> or pay another way <span className="h-px flex-1 bg-line" />
              </div>
            </div>

            {/* Contact */}
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <fieldset>
                <legend className="mb-3 font-serif text-lg">Contact</legend>
                <input
                  type="email"
                  placeholder="Email address"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
                  <input type="checkbox" className="h-4 w-4 accent-[rgb(var(--color-accent))]" defaultChecked /> Email me with news and offers
                </label>
              </fieldset>

              <fieldset>
                <legend className="mb-3 font-serif text-lg">Delivery</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input placeholder="First name" className="input" />
                  <input placeholder="Last name" className="input" />
                  <input placeholder="Address" className="input sm:col-span-2" />
                  <input placeholder="Apartment, suite, etc. (optional)" className="input sm:col-span-2" />
                  <input placeholder="City" className="input" />
                  <input placeholder="Postal code" className="input" />
                  <input placeholder="Country" className="input sm:col-span-2" defaultValue="United States" />
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 font-serif text-lg">Payment</legend>
                <div className="rounded-xl border border-line bg-canvas p-4 text-sm text-ink-muted">
                  <p className="flex items-center gap-2">
                    <Lock size={14} /> Payment is processed securely via Stripe — you’ll be redirected to complete your purchase.
                  </p>
                </div>
              </fieldset>

              <button type="button" onClick={handlePay} disabled={loading} className="btn-accent w-full py-4 text-base disabled:opacity-70">
                <Lock size={16} /> {loading ? 'Redirecting…' : `Pay ${formatMoney(total, currency)}`}
              </button>
              {payError && (
                <p className="rounded-xl bg-surface-muted p-3 text-center text-xs text-ink-soft">{payError}</p>
              )}
              <p className="flex items-center justify-center gap-1.5 text-xs text-ink-muted">
                <ShieldCheck size={13} /> All transactions are secure and encrypted.
              </p>
            </form>
          </div>
        </div>

        {/* Summary side */}
        <aside className="border-t border-line bg-canvas px-5 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:py-12">
          <div className="mx-auto max-w-md lg:sticky lg:top-12">
            <ul className="space-y-4">
              {lines.map((line) => (
                <li key={line.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg">
                    <MediaImage seed={line.image.seed} alt={line.image.alt} monogram={false} sizes="56px" />
                    <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-medium text-canvas">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{line.title}</p>
                    <p className="text-xs text-ink-muted">{[line.color, line.size].filter(Boolean).join(' · ')}</p>
                  </div>
                  <span className="text-sm font-medium">{formatMoney(line.price * line.quantity, currency)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex gap-2">
              <div className="relative flex-1">
                <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  value={discount}
                  onChange={(e) => {
                    setDiscount(e.target.value);
                    setDiscountError(false);
                  }}
                  placeholder="Gift card or discount code"
                  className="input pl-9"
                />
              </div>
              <button onClick={applyDiscountCode} className="btn-outline px-5">
                Apply
              </button>
            </div>
            {appliedDiscount && <p className="mt-2 text-xs text-success">✓ {appliedDiscount.description}</p>}
            {discountError && <p className="mt-2 text-xs text-sale">“{discount}” isn’t a valid code.</p>}

            <dl className="mt-6 space-y-2.5 border-t border-line pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-medium">{formatMoney(subtotal, currency)}</dd>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-success">
                  <dt>{appliedDiscount?.description}</dt>
                  <dd className="font-medium">-{formatMoney(discountAmount, currency)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="flex items-center gap-1.5 text-ink-soft">
                  <Truck size={14} /> Shipping
                </dt>
                <dd className="font-medium">{shipping === 0 ? 'Free' : formatMoney(shipping, currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Estimated tax</dt>
                <dd className="font-medium">{formatMoney(tax, currency)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span className="font-medium">Total</span>
              <span className="font-serif text-2xl">{formatMoney(total, currency)}</span>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-surface-muted p-3 text-xs text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <Gift size={14} className="text-accent" /> Free gift wrapping available
              </span>
              <PaymentIcons methods={siteConfig.payments.slice(0, 4)} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
