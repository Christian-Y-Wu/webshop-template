/* ==========================================================================
   STORE SETTINGS SCHEMA

   The template has two configuration layers:

     1. `site.ts`            — the DEFAULTS (the demo store). Hand-editable.
     2. `store-settings.json` — YOUR store's overrides. Written by the Admin
                                Studio (/admin) or by hand. This one file is
                                the portable identity of a store: copy it (plus
                                custom-products.json) into a fresh clone of the
                                template and the new store looks identical.

   Everything in this file is shared by the storefront, the Admin Studio and
   the setup scripts, so the three can never disagree about what a "store
   settings" object looks like.
   ========================================================================== */

import type {
  AnnouncementItem,
  CurrencyConfig,
  DiscountCode,
  LanguageConfig,
} from './site';

export type SiteTheme =
  | ''
  | 'midnight'
  | 'botanic'
  | 'cobalt'
  | 'noir'
  | 'blush'
  | 'sand'
  | 'orchid';
export type FontPreset = 'editorial' | 'modern' | 'classic' | 'minimal';
export type StoreMode = 'single' | 'catalog';
export type ColorModeDefault = 'light' | 'dark' | 'system';

export interface ColorModeConfig {
  /** Mode applied before the visitor makes a choice. */
  default: ColorModeDefault;
  /** Show the sun/moon toggle in the header. */
  showToggle: boolean;
}

export interface SocialLinks {
  instagram: string;
  tiktok: string;
  pinterest: string;
  youtube: string;
  facebook: string;
}

export interface FeatureFlags {
  wishlist: boolean;
  compare: boolean;
  quickAdd: boolean;
  reviews: boolean;
  giftWrap: boolean;
  freeShippingBar: boolean;
  newsletterPopup: boolean;
  exitIntentPopup: boolean;
  recentlyPurchasedPopup: boolean;
  liveChat: boolean;
  infiniteScroll: boolean;
}

export interface TrustConfig {
  ratingValue: number;
  ratingCount: number;
  guaranteeDays: number;
}

/* ---- Editable homepage content --------------------------------------------
   Every headline the visitor reads on the homepage is data, not JSX — the
   defaults in site.ts are polished placeholder copy, and the Admin Studio's
   "Homepage" sections overwrite them without touching a component. */

export interface HeroContent {
  /** Small uppercase line above the headline. */
  eyebrow: string;
  heading: string;
  subheading: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

export interface StoryMilestone {
  year: string;
  title: string;
  text: string;
}

/** The optional founder-story + history section (toggled in homeSections). */
export interface StoryContent {
  eyebrow: string;
  title: string;
  /** Story copy. Blank lines split it into paragraphs. */
  text: string;
  founderName: string;
  founderRole: string;
  quote: string;
  milestones: StoryMilestone[];
}

export interface NewsletterContent {
  eyebrow: string;
  heading: string;
  text: string;
  buttonLabel: string;
  successText: string;
}

/**
 * The homepage is composed of independent sections that can each be switched
 * off in the Admin Studio. Keys map 1:1 to components in src/components/home.
 */
export type HomeSectionKey =
  | 'marquee'
  | 'featuredCollections'
  | 'featuredProducts'
  | 'valueProps'
  | 'promoBanner'
  | 'categoryGrid'
  | 'editorial'
  | 'story'
  | 'testimonials'
  | 'blogPreview'
  | 'instagram'
  | 'faq'
  | 'recentlyViewed'
  | 'newsletter';

export type HomeSections = Record<HomeSectionKey, boolean>;

/**
 * The overrides file (`store-settings.json`). Every field is optional —
 * anything omitted falls back to the defaults in `site.ts`. Currencies and
 * languages are selected by code from the catalogs below so the JSON stays
 * small and typo-proof.
 */
export interface StoreSettings {
  name?: string;
  legalName?: string;
  tagline?: string;
  description?: string;
  url?: string;
  locale?: string;
  theme?: SiteTheme;
  fontPreset?: FontPreset;
  colorMode?: Partial<ColorModeConfig>;
  /** Accent brand colour as hex (e.g. "#b2583f"). Soft/ink shades are derived. */
  accentColor?: string | null;
  storeMode?: StoreMode;
  featuredProductSlug?: string;
  email?: string;
  phone?: string;
  address?: string;
  social?: Partial<SocialLinks>;
  announcements?: AnnouncementItem[];
  countdownTo?: string;
  countdownLabel?: string;
  hero?: Partial<HeroContent>;
  story?: Partial<StoryContent>;
  newsletter?: Partial<NewsletterContent>;
  homeSections?: Partial<HomeSections>;
  features?: Partial<FeatureFlags>;
  freeShippingThreshold?: number;
  giftWrapPrice?: number;
  discountCodes?: DiscountCode[];
  defaultCurrency?: string;
  /** Currency codes picked from CURRENCY_CATALOG. */
  currencyCodes?: string[];
  defaultLanguage?: string;
  /** Language codes picked from LANGUAGE_CATALOG. */
  languageCodes?: string[];
  trust?: Partial<TrustConfig>;
  payments?: string[];
  /** Hide the demo catalogue once you've added your own products. */
  hideDemoCatalog?: boolean;
}

/* ---- Catalogs ------------------------------------------------------------ */

/** Theme presets (CSS lives in globals.css). Swatches power the admin picker. */
export const THEME_CATALOG: {
  value: SiteTheme;
  label: string;
  description: string;
  /** [canvas, accent, ink] as CSS colors — for the admin swatch preview. */
  swatch: [string, string, string];
}[] = [
  { value: '', label: 'Ivory', description: 'Warm gallery white, clay accent', swatch: ['#faf8f5', '#b2583f', '#1a1816'] },
  { value: 'midnight', label: 'Midnight', description: 'Deep charcoal, brushed gold', swatch: ['#111216', '#c6a86c', '#f0f0f5'] },
  { value: 'botanic', label: 'Botanic', description: 'Fresh sage, forest green', swatch: ['#f7f8f4', '#47684a', '#1b211b'] },
  { value: 'cobalt', label: 'Cobalt', description: 'Cool white, electric blue', swatch: ['#f9fafc', '#284ebd', '#141821'] },
  { value: 'noir', label: 'Noir', description: 'Stark monochrome, pure black', swatch: ['#fafafa', '#111111', '#111111'] },
  { value: 'blush', label: 'Blush', description: 'Soft rose, warm rosewood', swatch: ['#fcf8f7', '#bc5b60', '#2c1e1e'] },
  { value: 'sand', label: 'Sand', description: 'Desert neutrals, aged bronze', swatch: ['#f9f6f0', '#9e7a4a', '#2b251c'] },
  { value: 'orchid', label: 'Orchid', description: 'Cool lilac, deep violet', swatch: ['#faf8fc', '#7a3fac', '#201a29'] },
];

/** Typography pairings (fonts are loaded in layout.tsx, mapped in globals.css). */
export const FONT_PRESET_CATALOG: { value: FontPreset; label: string; description: string }[] = [
  { value: 'editorial', label: 'Editorial', description: 'Fraunces serif headlines + Inter — refined, magazine-like (default)' },
  { value: 'modern', label: 'Modern', description: 'Space Grotesk headlines + Inter — geometric, tech-forward' },
  { value: 'classic', label: 'Classic', description: 'Playfair Display headlines + Inter — timeless, high-fashion' },
  { value: 'minimal', label: 'Minimal', description: 'Inter everywhere — quiet, Scandinavian, type-neutral' },
];

/**
 * Homepage sections the store can switch on/off. `modes` says where the
 * section appears; the composer in the Admin Studio groups by this.
 */
export const HOME_SECTION_CATALOG: {
  key: HomeSectionKey;
  label: string;
  description: string;
  modes: StoreMode[];
}[] = [
  { key: 'marquee', label: 'Scrolling marquee', description: 'USP ticker under the hero', modes: ['single', 'catalog'] },
  { key: 'featuredCollections', label: 'Featured collections', description: 'Large collection cards', modes: ['catalog'] },
  { key: 'featuredProducts', label: 'Featured products', description: 'Best-seller product rail', modes: ['catalog'] },
  { key: 'valueProps', label: 'Value props', description: 'Shipping / returns / guarantee icons', modes: ['single', 'catalog'] },
  { key: 'promoBanner', label: 'Promo banner', description: 'Full-width offer with countdown', modes: ['catalog'] },
  { key: 'categoryGrid', label: 'Category grid', description: 'Shop-by-category tiles', modes: ['catalog'] },
  { key: 'editorial', label: 'Philosophy', description: 'Brand philosophy split section', modes: ['single', 'catalog'] },
  { key: 'story', label: 'Founder story & history', description: 'Founder portrait, quote and company timeline', modes: ['single', 'catalog'] },
  { key: 'testimonials', label: 'Testimonials', description: 'Customer quote cards', modes: ['single', 'catalog'] },
  { key: 'blogPreview', label: 'Journal preview', description: 'Latest blog posts', modes: ['catalog'] },
  { key: 'instagram', label: 'Instagram gallery', description: 'Social feed grid', modes: ['catalog'] },
  { key: 'faq', label: 'FAQ', description: 'Common questions accordion', modes: ['single', 'catalog'] },
  { key: 'recentlyViewed', label: 'Recently viewed', description: 'The visitor’s browsing trail', modes: ['catalog'] },
  { key: 'newsletter', label: 'Newsletter band', description: 'Email sign-up with welcome offer', modes: ['single', 'catalog'] },
];

export const CURRENCY_CATALOG: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar', rate: 1, locale: 'en-US', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', label: 'Euro', rate: 0.92, locale: 'de-DE', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', label: 'British Pound', rate: 0.79, locale: 'en-GB', flag: '🇬🇧' },
  { code: 'DKK', symbol: 'kr', label: 'Danish Krone', rate: 6.9, locale: 'da-DK', flag: '🇩🇰' },
  { code: 'SEK', symbol: 'kr', label: 'Swedish Krona', rate: 10.5, locale: 'sv-SE', flag: '🇸🇪' },
  { code: 'NOK', symbol: 'kr', label: 'Norwegian Krone', rate: 10.6, locale: 'nb-NO', flag: '🇳🇴' },
  { code: 'CHF', symbol: 'CHF', label: 'Swiss Franc', rate: 0.88, locale: 'de-CH', flag: '🇨🇭' },
  { code: 'CAD', symbol: '$', label: 'Canadian Dollar', rate: 1.36, locale: 'en-CA', flag: '🇨🇦' },
  { code: 'AUD', symbol: '$', label: 'Australian Dollar', rate: 1.51, locale: 'en-AU', flag: '🇦🇺' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen', rate: 156, locale: 'ja-JP', flag: '🇯🇵' },
];

export const LANGUAGE_CATALOG: LanguageConfig[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'da', label: 'Dansk', flag: '🇩🇰' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export const PAYMENT_METHODS = [
  'visa',
  'mastercard',
  'amex',
  'paypal',
  'applepay',
  'googlepay',
  'shoppay',
  'klarna',
] as const;

/* ---- Validation (used by the admin save API) ------------------------------ */

const THEMES: SiteTheme[] = THEME_CATALOG.map((t) => t.value);
const FONT_PRESETS: FontPreset[] = FONT_PRESET_CATALOG.map((f) => f.value);
const MODES: StoreMode[] = ['single', 'catalog'];
const COLOR_MODES: ColorModeDefault[] = ['light', 'dark', 'system'];
const HOME_SECTION_KEYS = new Set<string>(HOME_SECTION_CATALOG.map((s) => s.key));
const HERO_KEYS = new Set([
  'eyebrow', 'heading', 'subheading',
  'primaryCtaLabel', 'primaryCtaHref', 'secondaryCtaLabel', 'secondaryCtaHref',
]);
const STORY_KEYS = new Set(['eyebrow', 'title', 'text', 'founderName', 'founderRole', 'quote', 'milestones']);
const NEWSLETTER_KEYS = new Set(['eyebrow', 'heading', 'text', 'buttonLabel', 'successText']);

function isString(v: unknown): v is string {
  return typeof v === 'string';
}
function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

/**
 * Check an untrusted object against the StoreSettings shape. Returns a list
 * of human-readable problems (empty = valid). Unknown keys are rejected so a
 * typo'd field can't silently do nothing.
 */
export function validateSettings(input: unknown): string[] {
  const errors: string[] = [];
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return ['Settings must be a JSON object.'];
  }
  const s = input as Record<string, unknown>;

  const stringFields = [
    'name', 'legalName', 'tagline', 'description', 'url', 'locale',
    'featuredProductSlug', 'email', 'phone', 'address',
    'countdownTo', 'countdownLabel', 'defaultCurrency', 'defaultLanguage',
  ];
  const numberFields = ['freeShippingThreshold', 'giftWrapPrice'];
  const knownKeys = new Set([
    ...stringFields, ...numberFields,
    'theme', 'fontPreset', 'colorMode', 'accentColor', 'storeMode', 'social', 'announcements',
    'hero', 'story', 'newsletter', 'homeSections',
    'features', 'discountCodes', 'currencyCodes', 'languageCodes', 'trust',
    'payments', 'hideDemoCatalog',
  ]);

  for (const key of Object.keys(s)) {
    if (!knownKeys.has(key)) errors.push(`Unknown setting "${key}".`);
  }
  for (const key of stringFields) {
    if (s[key] !== undefined && !isString(s[key])) errors.push(`"${key}" must be a string.`);
    if (isString(s[key]) && (s[key] as string).length > 2000) errors.push(`"${key}" is too long.`);
  }
  for (const key of numberFields) {
    if (s[key] !== undefined && !isFiniteNumber(s[key])) errors.push(`"${key}" must be a number.`);
  }

  if (s.theme !== undefined && !THEMES.includes(s.theme as SiteTheme)) {
    errors.push(`"theme" must be one of: ${THEMES.map((t) => t || '(default)').join(', ')}.`);
  }
  if (s.fontPreset !== undefined && !FONT_PRESETS.includes(s.fontPreset as FontPreset)) {
    errors.push(`"fontPreset" must be one of: ${FONT_PRESETS.join(', ')}.`);
  }
  if (s.storeMode !== undefined && !MODES.includes(s.storeMode as StoreMode)) {
    errors.push('"storeMode" must be "single" or "catalog".');
  }
  if (s.accentColor !== undefined && s.accentColor !== null) {
    if (!isString(s.accentColor) || !/^#[0-9a-fA-F]{6}$/.test(s.accentColor)) {
      errors.push('"accentColor" must be a 6-digit hex colour like "#b2583f".');
    }
  }
  if (s.colorMode !== undefined) {
    const cm = s.colorMode as Record<string, unknown>;
    if (typeof cm !== 'object' || cm === null) errors.push('"colorMode" must be an object.');
    else {
      if (cm.default !== undefined && !COLOR_MODES.includes(cm.default as ColorModeDefault)) {
        errors.push('"colorMode.default" must be "light", "dark" or "system".');
      }
      if (cm.showToggle !== undefined && typeof cm.showToggle !== 'boolean') {
        errors.push('"colorMode.showToggle" must be a boolean.');
      }
    }
  }
  if (s.hideDemoCatalog !== undefined && typeof s.hideDemoCatalog !== 'boolean') {
    errors.push('"hideDemoCatalog" must be a boolean.');
  }
  for (const listKey of ['currencyCodes', 'languageCodes', 'payments'] as const) {
    const v = s[listKey];
    if (v !== undefined && (!Array.isArray(v) || v.some((x) => !isString(x)))) {
      errors.push(`"${listKey}" must be an array of strings.`);
    }
  }
  if (s.currencyCodes !== undefined && Array.isArray(s.currencyCodes)) {
    const known = new Set(CURRENCY_CATALOG.map((c) => c.code));
    for (const code of s.currencyCodes as string[]) {
      if (!known.has(code)) errors.push(`Unknown currency code "${code}".`);
    }
    if ((s.currencyCodes as string[]).length === 0) errors.push('Enable at least one currency.');
  }
  if (s.languageCodes !== undefined && Array.isArray(s.languageCodes)) {
    const known = new Set(LANGUAGE_CATALOG.map((l) => l.code));
    for (const code of s.languageCodes as string[]) {
      if (!known.has(code)) errors.push(`Unknown language code "${code}".`);
    }
    if ((s.languageCodes as string[]).length === 0) errors.push('Enable at least one language.');
  }
  if (s.announcements !== undefined) {
    if (!Array.isArray(s.announcements)) errors.push('"announcements" must be an array.');
    else {
      for (const a of s.announcements as unknown[]) {
        const item = a as Record<string, unknown>;
        if (!item || !isString(item.text)) errors.push('Each announcement needs a "text" string.');
        if (item?.href !== undefined && !isString(item.href)) errors.push('Announcement "href" must be a string.');
      }
    }
  }
  if (s.discountCodes !== undefined) {
    if (!Array.isArray(s.discountCodes)) errors.push('"discountCodes" must be an array.');
    else {
      for (const d of s.discountCodes as unknown[]) {
        const code = d as Record<string, unknown>;
        if (!code || !isString(code.code) || !code.code) errors.push('Each discount needs a "code".');
        if (code?.kind !== 'percent' && code?.kind !== 'freeShipping') {
          errors.push('Discount "kind" must be "percent" or "freeShipping".');
        }
        if (code?.kind === 'percent' && (!isFiniteNumber(code.value) || code.value <= 0 || code.value > 100)) {
          errors.push(`Discount "${code?.code}": percent value must be between 1 and 100.`);
        }
      }
    }
  }
  if (s.social !== undefined) {
    const social = s.social as Record<string, unknown>;
    if (typeof social !== 'object' || social === null) errors.push('"social" must be an object.');
    else {
      for (const [k, v] of Object.entries(social)) {
        if (v !== undefined && !isString(v)) errors.push(`social.${k} must be a string URL.`);
      }
    }
  }
  for (const [groupKey, allowed] of [
    ['hero', HERO_KEYS],
    ['newsletter', NEWSLETTER_KEYS],
  ] as const) {
    const group = s[groupKey];
    if (group === undefined) continue;
    if (typeof group !== 'object' || group === null || Array.isArray(group)) {
      errors.push(`"${groupKey}" must be an object.`);
      continue;
    }
    for (const [k, v] of Object.entries(group)) {
      if (!allowed.has(k)) errors.push(`Unknown ${groupKey} field "${k}".`);
      else if (!isString(v)) errors.push(`${groupKey}.${k} must be a string.`);
      else if (v.length > 2000) errors.push(`${groupKey}.${k} is too long.`);
    }
  }
  if (s.story !== undefined) {
    const story = s.story as Record<string, unknown>;
    if (typeof story !== 'object' || story === null || Array.isArray(story)) {
      errors.push('"story" must be an object.');
    } else {
      for (const [k, v] of Object.entries(story)) {
        if (!STORY_KEYS.has(k)) errors.push(`Unknown story field "${k}".`);
        else if (k !== 'milestones' && !isString(v)) errors.push(`story.${k} must be a string.`);
        else if (isString(v) && v.length > 5000) errors.push(`story.${k} is too long.`);
      }
      if (story.milestones !== undefined) {
        if (!Array.isArray(story.milestones)) errors.push('"story.milestones" must be an array.');
        else {
          for (const m of story.milestones as unknown[]) {
            const item = m as Record<string, unknown>;
            if (!item || !isString(item.year) || !isString(item.title) || !isString(item.text)) {
              errors.push('Each story milestone needs "year", "title" and "text" strings.');
              break;
            }
          }
        }
      }
    }
  }
  if (s.homeSections !== undefined) {
    const sections = s.homeSections as Record<string, unknown>;
    if (typeof sections !== 'object' || sections === null || Array.isArray(sections)) {
      errors.push('"homeSections" must be an object.');
    } else {
      for (const [k, v] of Object.entries(sections)) {
        if (!HOME_SECTION_KEYS.has(k)) errors.push(`Unknown homepage section "${k}".`);
        else if (typeof v !== 'boolean') errors.push(`homeSections.${k} must be true or false.`);
      }
    }
  }
  if (s.features !== undefined) {
    const features = s.features as Record<string, unknown>;
    if (typeof features !== 'object' || features === null) errors.push('"features" must be an object.');
    else {
      for (const [k, v] of Object.entries(features)) {
        if (typeof v !== 'boolean') errors.push(`features.${k} must be true or false.`);
      }
    }
  }
  if (s.trust !== undefined) {
    const trust = s.trust as Record<string, unknown>;
    if (typeof trust !== 'object' || trust === null) errors.push('"trust" must be an object.');
    else {
      for (const [k, v] of Object.entries(trust)) {
        if (!isFiniteNumber(v)) errors.push(`trust.${k} must be a number.`);
      }
    }
  }

  return errors;
}
