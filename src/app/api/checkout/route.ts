import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { siteConfig } from '@/config/site';
import { toStripeAmount } from '@/lib/stripe-currency';

/* ==========================================================================
   POST /api/checkout — creates a real Stripe Checkout Session.

   This is a frontend template (see README "Connecting a real backend"): cart
   line prices are trusted from the client because there's no order backend
   yet. The one thing we do NOT trust from the client is the discount code —
   that's re-validated here against siteConfig.discountCodes before a Stripe
   coupon is applied, so a tampered request can't grant a discount that
   doesn't exist.

   Always charges in siteConfig.defaultCurrency, never the shopper's display
   currency — the multi-currency `rate` field is explicitly illustrative
   (see src/config/site.ts), so it must never be used to move real money.

   Returns `{ error: 'not_configured' }` (not an HTTP error) when
   STRIPE_SECRET_KEY is unset, so the checkout UI can show a clear demo-mode
   message instead of a broken "Pay" button.
   ========================================================================== */

interface CheckoutLine {
  title: string;
  price: number;
  quantity: number;
}

/* Sanity caps on client-supplied values. Prices are trusted from the client
   for now (frontend template — see the note above), but they should at least
   be shaped like a real order so a malformed request can't create absurd
   Stripe sessions. */
const MAX_LINES = 100;
const MAX_QUANTITY = 99;
const MAX_UNIT_PRICE = 100_000;
const MAX_EXTRA = 10_000; // shipping / tax caps

function sanitizeLines(input: unknown): CheckoutLine[] {
  if (!Array.isArray(input)) return [];
  return input
    .slice(0, MAX_LINES)
    .map((raw): CheckoutLine | null => {
      const line = raw as Record<string, unknown>;
      const title = typeof line?.title === 'string' ? line.title.slice(0, 200) : '';
      const price = typeof line?.price === 'number' && Number.isFinite(line.price) ? line.price : 0;
      const quantity =
        typeof line?.quantity === 'number' && Number.isInteger(line.quantity) ? line.quantity : 0;
      if (!title || price <= 0 || price > MAX_UNIT_PRICE || quantity <= 0 || quantity > MAX_QUANTITY) {
        return null;
      }
      return { title, price, quantity };
    })
    .filter((l): l is CheckoutLine => l !== null);
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: 'not_configured' });
  }

  const body = await req.json().catch(() => null);
  const lines = sanitizeLines(body?.lines);
  if (lines.length === 0) {
    return NextResponse.json({ error: 'empty_cart' }, { status: 400 });
  }

  const currencyCode = siteConfig.defaultCurrency.toLowerCase();
  const toUnitAmount = (amount: number) => toStripeAmount(amount, currencyCode);

  const stripe = new Stripe(secretKey);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lines.map((line) => ({
    quantity: line.quantity,
    price_data: {
      currency: currencyCode,
      unit_amount: toUnitAmount(line.price),
      product_data: { name: line.title },
    },
  }));

  const extra = (value: unknown) =>
    typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= MAX_EXTRA
      ? value
      : 0;

  const shipping = extra(body.shipping);
  if (shipping > 0) {
    lineItems.push({
      quantity: 1,
      price_data: { currency: currencyCode, unit_amount: toUnitAmount(shipping), product_data: { name: 'Shipping' } },
    });
  }
  const tax = extra(body.tax);
  if (tax > 0) {
    lineItems.push({
      quantity: 1,
      price_data: { currency: currencyCode, unit_amount: toUnitAmount(tax), product_data: { name: 'Estimated tax' } },
    });
  }

  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
  if (typeof body.discountCode === 'string' && body.discountCode) {
    const discount = siteConfig.discountCodes.find(
      (d) => d.code.toLowerCase() === body.discountCode.toLowerCase(),
    );
    if (discount?.kind === 'percent' && discount.value) {
      const coupon = await stripe.coupons.create({
        percent_off: discount.value,
        duration: 'once',
        name: discount.code,
      });
      discounts = [{ coupon: coupon.id }];
    }
  }

  const origin = req.nextUrl.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      discounts,
      customer_email:
        typeof body.customerEmail === 'string' && body.customerEmail.includes('@') && body.customerEmail.length <= 254
          ? body.customerEmail
          : undefined,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: 'stripe_error' }, { status: 502 });
  }
}
