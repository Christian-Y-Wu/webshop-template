/* ==========================================================================
   SITE CONFIG — the primary rebranding surface.
   Change the brand identity, contact details, feature flags, supported
   currencies/languages and announcement bar here. Nothing else needs editing
   to stand up a new store's shell.
   ========================================================================== */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
  /** Multiplier applied to base (USD) prices. Purely illustrative. */
  rate: number;
  locale: string;
  flag: string;
}

export interface LanguageConfig {
  code: string;
  label: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export interface AnnouncementItem {
  text: string;
  href?: string;
}

export interface DiscountCode {
  code: string;
  description: string;
  kind: 'percent' | 'freeShipping';
  /** Percent off (0-100) when kind is 'percent'; ignored for 'freeShipping'. */
  value?: number;
}

export const siteConfig = {
  name: 'AURA',
  legalName: 'Aura Studio Ltd.',
  tagline: 'Considered essentials for a beautiful everyday.',
  description:
    'AURA is a premium lifestyle store offering thoughtfully designed essentials — crafted with care, built to last, and shipped worldwide.',
  url: 'https://aura-template.example.com',
  locale: 'en',
  /** A store-wide theme preset. See globals.css: '', 'midnight', 'botanic', 'cobalt'. */
  theme: '' as '' | 'midnight' | 'botanic' | 'cobalt',

  /* ======================================================================
     STORE MODE — the single most important decision for this template.

       'single'  → You sell ONE hero product (or just a few). The homepage
                   becomes a focused, conversion-first product landing page,
                   the navigation collapses to the essentials, and all of the
                   multi-category "big shop" chrome (mega-menu, collection
                   grids, category browsing) is hidden. Ideal for launching
                   with a single item.

       'catalog' → The full multi-product storefront: mega-menu, collections,
                   category grids, featured rails, the works. Switch to this
                   once your range grows into a proper catalogue.

     Start in 'single'. When you add enough products that customers need to
     browse and filter, flip this one line to 'catalog' — every page adapts
     automatically. Nothing else needs to change to grow from one product to
     a full shop. See src/lib/store-mode.ts for the helpers that read this.
     ====================================================================== */
  storeMode: 'single' as 'single' | 'catalog',

  /**
   * In 'single' mode, the slug of the one product the entire site revolves
   * around (must match a `slug` in src/lib/data/products.ts). The homepage,
   * announcement links and hero all point at this product.
   */
  featuredProductSlug: 'aria-merino-sweater',

  email: 'hello@aura-store.com',
  phone: '+1 (415) 555-0132',
  address: '414 Market Street, Suite 200, San Francisco, CA',

  social: {
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    pinterest: 'https://pinterest.com',
    youtube: 'https://youtube.com',
    facebook: 'https://facebook.com',
  },

  // ---- Announcement bar -------------------------------------------------
  // Kept product-neutral so the copy works in either store mode. In 'catalog'
  // mode you may want to point these at collections (e.g. /collections/sale).
  announcements: [
    { text: 'Complimentary shipping on orders over $75 — worldwide', href: '/pages/shipping' },
    { text: 'Loved by 12,000+ customers · Rated 4.8 out of 5', href: '/#reviews' },
    { text: '30-day easy returns · Free & carbon-neutral', href: '/pages/returns' },
  ] as AnnouncementItem[],
  /** ISO date the promotional countdown counts down to. */
  countdownTo: '2026-08-31T23:59:59',
  countdownLabel: 'Launch offer ends in',

  // ---- Commerce feature flags ------------------------------------------
  features: {
    wishlist: true,
    compare: true,
    quickAdd: true,
    reviews: true,
    giftWrap: true,
    freeShippingBar: true,
    newsletterPopup: true,
    exitIntentPopup: true,
    recentlyPurchasedPopup: true,
    liveChat: true,
    infiniteScroll: true,
  },

  freeShippingThreshold: 75, // base currency
  giftWrapPrice: 6,

  // ---- Discount codes ----------------------------------------------------
  // Redeemable in the cart drawer and at checkout. `WELCOME10` is the code
  // the newsletter popup promises new subscribers (see marketing/popups.tsx).
  discountCodes: [
    { code: 'WELCOME10', description: '10% off your first order', kind: 'percent', value: 10 },
    { code: 'FREESHIP', description: 'Free shipping on this order', kind: 'freeShipping' },
  ] as DiscountCode[],

  // ---- Internationalisation --------------------------------------------
  defaultCurrency: 'USD',
  currencies: [
    { code: 'USD', symbol: '$', label: 'US Dollar', rate: 1, locale: 'en-US', flag: '🇺🇸' },
    { code: 'EUR', symbol: '€', label: 'Euro', rate: 0.92, locale: 'de-DE', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', label: 'British Pound', rate: 0.79, locale: 'en-GB', flag: '🇬🇧' },
    { code: 'DKK', symbol: 'kr', label: 'Danish Krone', rate: 6.9, locale: 'da-DK', flag: '🇩🇰' },
    { code: 'CAD', symbol: '$', label: 'Canadian Dollar', rate: 1.36, locale: 'en-CA', flag: '🇨🇦' },
    { code: 'AUD', symbol: '$', label: 'Australian Dollar', rate: 1.51, locale: 'en-AU', flag: '🇦🇺' },
    { code: 'JPY', symbol: '¥', label: 'Japanese Yen', rate: 156, locale: 'ja-JP', flag: '🇯🇵' },
  ] as CurrencyConfig[],

  defaultLanguage: 'en',
  languages: [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'da', label: 'Dansk', flag: '🇩🇰' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ] as LanguageConfig[],

  // ---- Trust ------------------------------------------------------------
  trust: {
    ratingValue: 4.8,
    ratingCount: 12480,
    guaranteeDays: 30,
  },

  payments: ['visa', 'mastercard', 'amex', 'paypal', 'applepay', 'googlepay', 'shoppay', 'klarna'],
} as const;

export type SiteConfig = typeof siteConfig;
