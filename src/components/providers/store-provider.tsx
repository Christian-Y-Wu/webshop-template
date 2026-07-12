'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { siteConfig, type CurrencyConfig } from '@/config/site';
import { translate, type TranslationKey } from '@/lib/i18n/dictionaries';
import type { CartLine, Product } from '@/lib/types';

/* ==========================================================================
   Store provider — cart, wishlist, compare, recently-viewed, currency & locale.
   Persists to localStorage and rehydrates on mount.
   ========================================================================== */

type AddLineInput = {
  product: Product;
  color?: string;
  size?: string;
  quantity?: number;
  giftWrap?: boolean;
};

interface StoreContextValue {
  hydrated: boolean;
  // Cart
  lines: CartLine[];
  cartCount: number;
  subtotal: number;
  addLine: (input: AddLineInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeLine: (id: string) => void;
  toggleGiftWrap: (id: string, value: boolean) => void;
  clearCart: () => void;
  // Wishlist
  wishlist: string[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
  // Compare
  compare: string[];
  isCompared: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  // Recently viewed
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;
  // Saved for later
  savedForLater: CartLine[];
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  // Currency & locale
  currency: CurrencyConfig;
  setCurrencyCode: (code: string) => void;
  locale: string;
  setLocale: (code: string) => void;
  t: (key: TranslationKey) => string;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const KEYS = {
  cart: 'aura:cart',
  wishlist: 'aura:wishlist',
  compare: 'aura:compare',
  recent: 'aura:recent',
  saved: 'aura:saved',
  currency: 'aura:currency',
  locale: 'aura:locale',
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function lineId(productId: string, color?: string, size?: string) {
  return [productId, color ?? '', size ?? ''].join('::');
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartLine[]>([]);
  const [currencyCode, setCurrencyCode] = useState<string>(siteConfig.defaultCurrency);
  const [locale, setLocale] = useState<string>(siteConfig.defaultLanguage);

  // Rehydrate once on mount
  useEffect(() => {
    setLines(read(KEYS.cart, []));
    setWishlist(read(KEYS.wishlist, []));
    setCompare(read(KEYS.compare, []));
    setRecentlyViewed(read(KEYS.recent, []));
    setSavedForLater(read(KEYS.saved, []));
    setCurrencyCode(read(KEYS.currency, siteConfig.defaultCurrency));
    setLocale(read(KEYS.locale, siteConfig.defaultLanguage));
    setHydrated(true);
  }, []);

  // Persist. Gated on the `hydrated` *state* (not a ref) so these can't fire
  // with stale pre-hydration values in the same commit as the rehydrate
  // effect above — a ref flips synchronously and would still read this
  // render's stale `lines` etc., overwriting localStorage with empty data
  // before the real values ever get applied (most visible with React
  // StrictMode's dev-mode double-invoked effects).
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.cart, JSON.stringify(lines));
  }, [hydrated, lines]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.wishlist, JSON.stringify(wishlist));
  }, [hydrated, wishlist]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.compare, JSON.stringify(compare));
  }, [hydrated, compare]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.recent, JSON.stringify(recentlyViewed));
  }, [hydrated, recentlyViewed]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.saved, JSON.stringify(savedForLater));
  }, [hydrated, savedForLater]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.currency, JSON.stringify(currencyCode));
  }, [hydrated, currencyCode]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.locale, JSON.stringify(locale));
  }, [locale]);

  const addLine = (input: AddLineInput) => {
    const { product, color, size, quantity = 1, giftWrap = false } = input;
    const id = lineId(product.id, color, size);
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, quantity: l.quantity + quantity } : l));
      }
      const newLine: CartLine = {
        id,
        productId: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: product.images[0],
        color: color ?? product.colors?.[0]?.name,
        size,
        quantity,
        giftWrap,
      };
      return [newLine, ...prev];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeLine(id);
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, quantity } : l)));
  };

  const removeLine = (id: string) => setLines((prev) => prev.filter((l) => l.id !== id));

  const toggleGiftWrap = (id: string, value: boolean) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, giftWrap: value } : l)));

  const clearCart = () => setLines([]);

  const toggleFrom = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) =>
    setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));

  const addRecentlyViewed = (id: string) =>
    setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 12));

  const saveForLater = (id: string) => {
    setLines((prev) => {
      const line = prev.find((l) => l.id === id);
      if (line) setSavedForLater((s) => (s.some((x) => x.id === id) ? s : [line, ...s]));
      return prev.filter((l) => l.id !== id);
    });
  };

  const moveToCart = (id: string) => {
    setSavedForLater((prev) => {
      const line = prev.find((l) => l.id === id);
      if (line) setLines((c) => (c.some((x) => x.id === id) ? c : [line, ...c]));
      return prev.filter((l) => l.id !== id);
    });
  };

  const currency = useMemo(
    () => siteConfig.currencies.find((c) => c.code === currencyCode) ?? siteConfig.currencies[0],
    [currencyCode],
  );

  const cartCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
  const subtotal = useMemo(
    () =>
      lines.reduce(
        (sum, l) => sum + l.price * l.quantity + (l.giftWrap ? siteConfig.giftWrapPrice : 0),
        0,
      ),
    [lines],
  );

  const value: StoreContextValue = {
    hydrated,
    lines,
    cartCount,
    subtotal,
    addLine,
    updateQuantity,
    removeLine,
    toggleGiftWrap,
    clearCart,
    wishlist,
    isWishlisted: (id) => wishlist.includes(id),
    toggleWishlist: toggleFrom(setWishlist),
    compare,
    isCompared: (id) => compare.includes(id),
    toggleCompare: (id) =>
      setCompare((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev].slice(0, 4),
      ),
    recentlyViewed,
    addRecentlyViewed,
    savedForLater,
    saveForLater,
    moveToCart,
    currency,
    setCurrencyCode,
    locale,
    setLocale,
    t: (key) => translate(locale, key),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within <StoreProvider>');
  return ctx;
}
