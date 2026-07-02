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
  announcements: [
    { text: 'Complimentary shipping on orders over $75 — worldwide', href: '/pages/shipping' },
    { text: 'Summer Edit is here — up to 40% off selected pieces', href: '/collections/sale' },
    { text: '30-day easy returns · Free & carbon-neutral', href: '/pages/returns' },
  ] as AnnouncementItem[],
  /** ISO date the promotional countdown counts down to. */
  countdownTo: '2026-08-31T23:59:59',
  countdownLabel: 'Summer Edit ends in',

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
