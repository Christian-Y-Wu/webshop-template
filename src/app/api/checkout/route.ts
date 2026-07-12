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

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: 'not_configured' });
  }

  const body = await req.json().catch(() => null);
  const lines: CheckoutLine[] = Array.isArray(body?.lines) ? body.lines : [];
  if (lines.length === 0) {
    return NextResponse.json({ error: 'empty_cart' }, { status: 400 });
  }

  const currencyCode = siteConfig.defaultCurrency.toLowerCase();
  const toUnitAmount = (amount: number) => toStripeAmount(amount, currencyCode);

  const stripe = new Stripe(secretKey);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lines
    .filter((line) => line.price > 0 && line.quantity > 0)
    .map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: currencyCode,
        unit_amount: toUnitAmount(line.price),
        product_data: { name: line.title },
      },
    }));

  if (typeof body.shipping === 'number' && body.shipping > 0) {
    lineItems.push({
      quantity: 1,
      price_data: { currency: currencyCode, unit_amount: toUnitAmount(body.shipping), product_data: { name: 'Shipping' } },
    });
  }
  if (typeof body.tax === 'number' && body.tax > 0) {
    lineItems.push({
      quantity: 1,
      price_data: { currency: currencyCode, unit_amount: toUnitAmount(body.tax), product_data: { name: 'Estimated tax' } },
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
        typeof body.customerEmail === 'string' && body.customerEmail ? body.customerEmail : undefined,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: 'stripe_error' }, { status: 502 });
  }
}
