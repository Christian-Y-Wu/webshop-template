import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { AccountShell } from '@/components/account/account-shell';
import { WishlistContent } from '@/components/account/wishlist-content';

export const metadata: Metadata = buildMetadata({ title: 'Wishlist', path: '/account/wishlist', noIndex: true });

export default function WishlistPage() {
  return (
    <AccountShell title="Your wishlist" description="Pieces you’ve saved to revisit.">
      <WishlistContent />
    </AccountShell>
  );
}
