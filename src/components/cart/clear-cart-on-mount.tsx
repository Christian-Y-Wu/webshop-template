'use client';

import { useEffect } from 'react';
import { useStore } from '@/components/providers/store-provider';

/** Empties the cart once, on mount — used on the post-payment success page. */
export function ClearCartOnMount() {
  const { clearCart } = useStore();

  useEffect(() => {
    clearCart();
    // Intentionally runs once: clearCart's identity is stable, and we only
    // ever want this to fire on the initial mount of the success page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
