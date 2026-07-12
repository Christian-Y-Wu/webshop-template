import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import Stripe from 'stripe';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { formatMoney } from '@/lib/utils';
import { fromStripeAmount } from '@/lib/stripe-currency';
import { ClearCartOnMount } from '@/components/cart/clear-cart-on-mount';

export const metadata: Metadata = buildMetadata({
  title: 'Order confirmed',
  description: 'Your order was placed successfully.',
  path: '/checkout/success',
  noIndex: true,
});

async function getSession(sessionId?: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || !sessionId) return null;
  try {
    const stripe = new Stripe(secretKey);
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const session = await getSession(searchParams.session_id);
  const currency = siteConfig.currencies.find((c) => c.code === siteConfig.defaultCurrency) ?? siteConfig.currencies[0];
  const total =
    session?.amount_total != null
      ? fromStripeAmount(session.amount_total, siteConfig.defaultCurrency)
      : null;

  return (
    <div className="container-page py-24 text-center">
      <ClearCartOnMount />
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
        <CheckCircle2 size={32} />
      </div>
      <h1 className="mt-6 font-serif text-3xl">Thank you — your order is confirmed</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">
        {session?.customer_details?.email
          ? `A receipt is on its way to ${session.customer_details.email}.`
          : `A confirmation has been sent to your email. Questions? Reach us at ${siteConfig.email}.`}
      </p>
      {total != null && <p className="mt-6 font-serif text-2xl">{formatMoney(total, currency)}</p>}
      <Link href="/" className="btn-primary mt-8">
        Continue shopping
      </Link>
    </div>
  );
}
