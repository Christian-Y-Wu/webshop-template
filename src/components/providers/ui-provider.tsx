'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Product } from '@/lib/types';

/* ==========================================================================
   UI provider — global overlays (cart drawer, mobile menu, search, quick view)
   and a lightweight toast queue.
   ========================================================================== */

export type Overlay = 'cart' | 'menu' | 'search' | null;

export interface Toast {
  id: number;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'wishlist';
  image?: string;
  href?: string;
  hrefLabel?: string;
}

interface UIContextValue {
  overlay: Overlay;
  openOverlay: (o: Exclude<Overlay, null>) => void;
  closeOverlay: () => void;
  quickView: Product | null;
  openQuickView: (p: Product) => void;
  closeQuickView: () => void;
  toasts: Toast[];
  toast: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: number) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const closeOverlay = useCallback(() => setOverlay(null), []);
  const openOverlay = useCallback((o: Exclude<Overlay, null>) => setOverlay(o), []);

  // Lock body scroll while any full overlay/modal is open
  useEffect(() => {
    const locked = overlay !== null || quickView !== null;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [overlay, quickView]);

  // Close overlays on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOverlay(null);
        setQuickView(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast],
  );

  return (
    <UIContext.Provider
      value={{
        overlay,
        openOverlay,
        closeOverlay,
        quickView,
        openQuickView: setQuickView,
        closeQuickView: () => setQuickView(null),
        toasts,
        toast,
        dismissToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within <UIProvider>');
  return ctx;
}
