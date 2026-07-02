import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { CartPageContent } from '@/components/cart/cart-page';

export const metadata: Metadata = buildMetadata({
  title: 'Shopping Cart',
  description: 'Review the items in your cart and proceed to secure checkout.',
  path: '/cart',
  noIndex: true,
});

export default function CartPage() {
  return <CartPageContent />;
}
