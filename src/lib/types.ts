/* ==========================================================================
   Domain model
   Everything the storefront renders is typed here. Swap the data files under
   `src/lib/data` for a different catalogue without touching components.
   ========================================================================== */

export type BadgeTone = 'accent' | 'sale' | 'success' | 'ink' | 'highlight';

export interface ProductBadge {
  label: string;
  tone: BadgeTone;
}

export interface ColorOption {
  name: string;
  /** CSS color or gradient used for the swatch. */
  hex: string;
  /** Optional image override shown when this color is selected. */
  image?: string;
}

export interface ProductImage {
  /** Gradient/label placeholder token — see MediaImage component. */
  seed: string;
  alt: string;
  /** Optional real remote URL (falls back to generated placeholder). */
  src?: string;
}

export interface ProductReviewSummary {
  rating: number; // 0–5
  count: number;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  /** Short marketing line for cards. */
  tagline?: string;
  description: string;
  /** Base-currency price (see formatMoney for conversion). */
  price: number;
  compareAtPrice?: number | null;
  currencyBase?: string;
  images: ProductImage[];
  colors?: ColorOption[];
  sizes?: string[];
  badges?: ProductBadge[];
  collections: string[]; // collection handles
  brand?: string;
  tags?: string[];
  rating: ProductReviewSummary;
  /** Units in stock; 0 == sold out, <= lowStockThreshold triggers a warning. */
  stock: number;
  lowStockThreshold?: number;
  bestSeller?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  specs?: SpecRow[];
  materials?: string;
  care?: string;
  ingredients?: string;
  shippingNote?: string;
  /** Handles of products frequently bought together. */
  pairsWith?: string[];
  hasVideo?: boolean;
  createdAt: string;
}

export interface Collection {
  handle: string;
  title: string;
  description: string;
  seed: string;
  eyebrow?: string;
  featured?: boolean;
  /** Optional explicit ordering of product ids; otherwise derived from tags. */
  productIds?: string[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  location?: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
  hasImage?: boolean;
  hasVideo?: boolean;
  fit?: 'Runs small' | 'True to size' | 'Runs large';
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  rating: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readingTime: string;
  date: string;
  seed: string;
  body: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface CartLine {
  id: string; // productId::color::size
  productId: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image: ProductImage;
  color?: string;
  size?: string;
  quantity: number;
  giftWrap?: boolean;
}
