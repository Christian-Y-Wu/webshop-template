import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { CheckoutPageContent } from '@/components/cart/checkout-page';

export const metadata: Metadata = buildMetadata({
  title: 'Checkout',
  description: 'Secure checkout.',
  path: '/checkout',
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
