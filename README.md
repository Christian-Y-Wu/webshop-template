# AURA — Premium Webshop Template

A complete, production-ready storefront template built with **Next.js 14 (App Router)**, **TypeScript** and **Tailwind CSS**. It looks and feels like a premium commercial Shopify theme (think *Prestige / Impulse / Shrine*) and is engineered to be **re-skinned for a new store in minutes** — change a few config and data files, and you have a brand-new shop.

Niche-agnostic by design: fashion, beauty, electronics, home, fitness, supplements, pets, food, or digital goods.

```
Editorial serif + clean sans · warm ivory canvas · configurable accent
Fully responsive · accessible · SEO-optimized · animated · i18n-ready
```

---

## ✨ Highlights

- **Fully designed pages** — homepage, product, collection, cart, checkout, search, account, blog, policies, contact, 404.
- **Config-driven** — brand, currencies, languages, announcements, feature flags all live in [`src/config`](src/config).
- **Zero image assets required** — a deterministic "studio gradient" placeholder system ([`MediaImage`](src/components/ui/media-image.tsx)) makes a fresh install look complete. Drop in real photos any time.
- **Commerce state** — cart, wishlist, compare, recently-viewed, save-for-later, currency & locale — all persisted to `localStorage`.
- **Conversion features** — slide-out cart, free-shipping progress bar, quick add, quick view, sticky add-to-cart, countdown timers, gift wrapping, discount fields, express-checkout placeholders, exit/newsletter popups, social-proof toasts, live-chat widget.
- **Internationalization** — currency + language switcher, translation dictionary with graceful fallback, localized pricing.
- **SEO** — per-page metadata, Open Graph + Twitter cards, dynamic OG image, JSON-LD (Organization, WebSite, Product, Breadcrumb, FAQ), `sitemap.xml`, `robots.txt`, canonical URLs, breadcrumbs.
- **Accessible** — keyboard nav, focus-visible rings, skip link, ARIA labels, `prefers-reduced-motion` support.
- **Fast** — static generation for all catalogue pages, `next/image`, lazy reveal-on-scroll, skeleton loaders.

---

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

Requires Node 18.18+ (tested on Node 24).

---

## 🎨 Rebranding checklist

Everything below is data — no component surgery required.

| To change… | Edit |
| --- | --- |
| Brand name, tagline, contact, socials, announcements, currencies, languages, feature flags, trust stats | [`src/config/site.ts`](src/config/site.ts) |
| Header mega-menu & footer links | [`src/config/navigation.ts`](src/config/navigation.ts) |
| Colours, fonts, radius, shadows | [`src/app/globals.css`](src/app/globals.css) (CSS variables) + [`tailwind.config.ts`](tailwind.config.ts) |
| Products | [`src/lib/data/products.ts`](src/lib/data/products.ts) |
| Collections | [`src/lib/data/collections.ts`](src/lib/data/collections.ts) |
| Reviews / testimonials / blog / FAQ / policy pages | [`src/lib/data/`](src/lib/data) |
| UI translations | [`src/lib/i18n/dictionaries.ts`](src/lib/i18n/dictionaries.ts) |

### Change the colour scheme

The whole theme is driven by CSS custom properties in [`globals.css`](src/app/globals.css). To restyle, edit the accent trio:

```css
:root {
  --color-accent: 178 88 63;      /* space-separated RGB channels */
  --color-accent-soft: 240 226 219;
  --color-accent-ink: 255 255 255;
}
```

Four ready-made presets ship in the same file — activate one by setting `theme` in `site.ts`:

```ts
theme: 'midnight' // '' | 'midnight' | 'botanic' | 'cobalt'
```

### Use real product photos

Add a `src` to any image and the placeholder is replaced by an optimized `next/image`:

```ts
images: [{ seed: 'aria-1', alt: 'Aria sweater', src: 'https://…/aria.jpg' }]
```

Add the image host to `remotePatterns` in [`next.config.mjs`](next.config.mjs).

---

## 🗂 Project structure

```
src/
├─ app/                     # App Router routes
│  ├─ layout.tsx            # Root: fonts, metadata, providers, chrome
│  ├─ page.tsx              # Homepage (composed sections)
│  ├─ products/[slug]/      # Product detail (SSG)
│  ├─ collections/          # Index + [handle] with filters
│  ├─ blog/                 # Index + [slug]
│  ├─ pages/                # About, contact, FAQ, policies…
│  ├─ account/              # Login, register, dashboard, orders…
│  ├─ cart / checkout / search
│  ├─ sitemap.ts robots.ts manifest.ts opengraph-image.tsx
│  └─ error.tsx not-found.tsx loading.tsx
├─ components/
│  ├─ layout/               # Header, mega-menu, footer, drawers…
│  ├─ home/                 # Homepage sections
│  ├─ product/              # Card, gallery, buy-box, reviews…
│  ├─ collection/           # Filterable grid, search results
│  ├─ account/ cart/ contact/ marketing/ seo/
│  ├─ providers/            # Store + UI context
│  └─ ui/                   # Primitives (Price, Badge, Reveal…)
├─ config/                  # site + navigation
└─ lib/
   ├─ data/                 # Catalogue & content (swap these)
   ├─ i18n/                 # Translation dictionaries
   ├─ seo.ts types.ts utils.ts
```

---

## 🧩 Connecting a real backend

This is a **frontend template** — product data is static and checkout is a UI mock. To go live, wire the data layer to a commerce backend:

- Replace the functions in [`src/lib/data/products.ts`](src/lib/data/products.ts) / `collections.ts` with fetches to **Shopify Storefront API**, Medusa, Swell, BigCommerce, etc.
- Point the cart's **Secure checkout** button (and express buttons) at your provider's hosted checkout, or Shopify's `checkoutUrl`.
- Hook the newsletter/contact forms to your ESP (Klaviyo, Mailchimp…).

The `CartLine` / `Product` types in [`src/lib/types.ts`](src/lib/types.ts) are the contract to map against.

---

## 🛠 Tech

Next.js 14 · React 18 · TypeScript · Tailwind CSS 3 · Framer Motion · lucide-react · Inter + Fraunces (`next/font`).

---

*AURA ships with placeholder content and is provided as a starter template. Replace branding, imagery and copy before launching a real store.*
