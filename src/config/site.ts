/* ==========================================================================
   SITE CONFIG — the primary rebranding surface.

   This file holds the DEFAULTS (the demo store). Your own store's values live
   in `store-settings.json` next to this file — edit them visually in the
   Admin Studio (`/admin` while `npm run dev` is running) or by hand. Anything
   set there overrides the default below; anything omitted falls through.

   You can still edit this file directly — both layers are merged into the
   single `siteConfig` object the whole storefront reads.
   ========================================================================== */

import storeSettings from './store-settings.json';
import {
  CURRENCY_CATALOG,
  LANGUAGE_CATALOG,
  type ColorModeConfig,
  type FeatureFlags,
  type SiteTheme,
  type SocialLinks,
  type StoreMode,
  type StoreSettings,
  type TrustConfig,
} from './settings-schema';

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

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  theme: SiteTheme;
  colorMode: ColorModeConfig;
  /** Custom accent hex (e.g. "#b2583f") — null keeps the CSS default. */
  accentColor: string | null;
  storeMode: StoreMode;
  featuredProductSlug: string;
  email: string;
  phone: string;
  address: string;
  social: SocialLinks;
  announcements: AnnouncementItem[];
  countdownTo: string;
  countdownLabel: string;
  features: FeatureFlags;
  freeShippingThreshold: number;
  giftWrapPrice: number;
  discountCodes: DiscountCode[];
  defaultCurrency: string;
  currencies: CurrencyConfig[];
  defaultLanguage: string;
  languages: LanguageConfig[];
  trust: TrustConfig;
  payments: string[];
  hideDemoCatalog: boolean;
}

/* ==========================================================================
   DEFAULTS — the demo store. `npm run setup` patches the literals below;
   the Admin Studio writes to store-settings.json instead.
   ========================================================================== */

const defaults: SiteConfig = {
  name: 'AURA',
  legalName: 'Aura Studio Ltd.',
  tagline: 'Considered essentials for a beautiful everyday.',
  description:
    'AURA is a premium lifestyle store offering thoughtfully designed essentials — crafted with care, built to last, and shipped worldwide.',
  url: 'https://aura-template.example.com',
  locale: 'en',
  /** A store-wide theme preset. See globals.css: '', 'midnight', 'botanic', 'cobalt'. */
  theme: '' as SiteTheme,

  /** Light/dark mode: the default before a visitor chooses, and whether the
   *  header shows a toggle. 'system' follows the visitor's OS preference. */
  colorMode: { default: 'light', showToggle: true },
  accentColor: null,

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
     automatically. See src/lib/store-mode.ts for the helpers that read this.
     ====================================================================== */
  storeMode: 'single' as StoreMode,

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
  ],
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
  ],

  // ---- Internationalisation --------------------------------------------
  defaultCurrency: 'USD',
  currencies: CURRENCY_CATALOG.filter((c) =>
    ['USD', 'EUR', 'GBP', 'DKK', 'CAD', 'AUD', 'JPY'].includes(c.code),
  ),

  defaultLanguage: 'en',
  languages: LANGUAGE_CATALOG.filter((l) => ['en', 'da', 'de', 'fr', 'es'].includes(l.code)),

  // ---- Trust ------------------------------------------------------------
  trust: {
    ratingValue: 4.8,
    ratingCount: 12480,
    guaranteeDays: 30,
  },

  payments: ['visa', 'mastercard', 'amex', 'paypal', 'applepay', 'googlepay', 'shoppay', 'klarna'],

  /** Hide the demo catalogue once your own products are in
   *  src/lib/data/custom-products.json (managed from /admin/products). */
  hideDemoCatalog: false,
};

/* ==========================================================================
   MERGE — overlay store-settings.json on the defaults.
   ========================================================================== */

export function applyStoreSettings(base: SiteConfig, settings: StoreSettings): SiteConfig {
  const pickCurrencies = settings.currencyCodes
    ? CURRENCY_CATALOG.filter((c) => settings.currencyCodes!.includes(c.code))
    : base.currencies;
  const pickLanguages = settings.languageCodes
    ? LANGUAGE_CATALOG.filter((l) => settings.languageCodes!.includes(l.code))
    : base.languages;

  const merged: SiteConfig = {
    ...base,
    ...Object.fromEntries(
      Object.entries({
        name: settings.name,
        legalName: settings.legalName,
        tagline: settings.tagline,
        description: settings.description,
        url: settings.url,
        locale: settings.locale,
        theme: settings.theme,
        accentColor: settings.accentColor,
        storeMode: settings.storeMode,
        featuredProductSlug: settings.featuredProductSlug,
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
        announcements: settings.announcements,
        countdownTo: settings.countdownTo,
        countdownLabel: settings.countdownLabel,
        freeShippingThreshold: settings.freeShippingThreshold,
        giftWrapPrice: settings.giftWrapPrice,
        discountCodes: settings.discountCodes,
        defaultCurrency: settings.defaultCurrency,
        defaultLanguage: settings.defaultLanguage,
        payments: settings.payments,
        hideDemoCatalog: settings.hideDemoCatalog,
      }).filter(([, v]) => v !== undefined),
    ),
    colorMode: { ...base.colorMode, ...settings.colorMode },
    social: { ...base.social, ...settings.social },
    features: { ...base.features, ...settings.features },
    trust: { ...base.trust, ...settings.trust },
    currencies: pickCurrencies.length ? pickCurrencies : base.currencies,
    languages: pickLanguages.length ? pickLanguages : base.languages,
  };

  // Never let a bad override strand the store without a valid default
  // currency/language.
  if (!merged.currencies.some((c) => c.code === merged.defaultCurrency)) {
    merged.defaultCurrency = merged.currencies[0].code;
  }
  if (!merged.languages.some((l) => l.code === merged.defaultLanguage)) {
    merged.defaultLanguage = merged.languages[0].code;
  }
  return merged;
}

export const siteDefaults = defaults;
export const siteConfig: SiteConfig = applyStoreSettings(defaults, storeSettings as StoreSettings);
