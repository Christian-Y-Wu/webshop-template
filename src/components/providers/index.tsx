'use client';

import { AuthProvider } from '@/components/providers/auth-provider';
import { StoreProvider } from '@/components/providers/store-provider';
import { UIProvider } from '@/components/providers/ui-provider';
import { CartDrawer } from '@/components/layout/cart-drawer';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { SearchOverlay } from '@/components/layout/search-overlay';
import { useIsAdminRoute } from '@/components/layout/site-chrome';
import { QuickView } from '@/components/product/quick-view';
import { Toaster } from '@/components/ui/toaster';
import { NewsletterPopup, RecentlyPurchasedPopup, LiveChatButton } from '@/components/marketing/popups';

/**
 * Global client providers + all portal-style overlays. Wraps the whole app so
 * cart / wishlist / currency / UI state is available everywhere, and the
 * drawers, modals, toasts and marketing popups mount exactly once.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdminRoute();

  return (
    <StoreProvider>
      <AuthProvider>
        <UIProvider>
          {children}

          {/* Global feedback — used by storefront and Admin Studio alike */}
          <Toaster />

          {/* Storefront-only overlays and marketing widgets */}
          {!isAdmin && (
            <>
              <CartDrawer />
              <MobileMenu />
              <SearchOverlay />
              <QuickView />
              <NewsletterPopup />
              <RecentlyPurchasedPopup />
              <LiveChatButton />
            </>
          )}
        </UIProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
