'use client';

import { StoreProvider } from '@/components/providers/store-provider';
import { UIProvider } from '@/components/providers/ui-provider';
import { CartDrawer } from '@/components/layout/cart-drawer';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { SearchOverlay } from '@/components/layout/search-overlay';
import { QuickView } from '@/components/product/quick-view';
import { Toaster } from '@/components/ui/toaster';
import { NewsletterPopup, RecentlyPurchasedPopup, LiveChatButton } from '@/components/marketing/popups';

/**
 * Global client providers + all portal-style overlays. Wraps the whole app so
 * cart / wishlist / currency / UI state is available everywhere, and the
 * drawers, modals, toasts and marketing popups mount exactly once.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <UIProvider>
        {children}

        {/* Overlays */}
        <CartDrawer />
        <MobileMenu />
        <SearchOverlay />
        <QuickView />

        {/* Global feedback + marketing */}
        <Toaster />
        <NewsletterPopup />
        <RecentlyPurchasedPopup />
        <LiveChatButton />
      </UIProvider>
    </StoreProvider>
  );
}
