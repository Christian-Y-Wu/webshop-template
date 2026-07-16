# AURA — Premium Webshop Template

A complete, production-ready storefront template built with **Next.js 14 (App Router)**, **TypeScript** and **Tailwind CSS**. It looks and feels like a premium commercial Shopify theme (think *Prestige / Impulse / Shrine*) and is engineered to be **re-skinned for a new store in minutes** — change a few config and data files, and you have a brand-new shop.

Niche-agnostic by design: fashion, beauty, electronics, home, fitness, supplements, pets, food, or digital goods.

```
Editorial serif + clean sans · warm ivory canvas · configurable accent
Light & dark mode · admin studio · fully responsive · accessible
SEO-optimized · animated · i18n-complete in 5 languages
```

**New:** a password-protected **Admin Studio** at `/admin` — one big form
where the store owner fills out *everything* (brand, products, design,
features, SEO) with zero code. See [Admin Studio](#-admin-studio-admin).

---

## 🎚 Two store modes — one product, or a full catalogue

This template is built to grow with you. A **single line of config** switches the
entire storefront between two experiences:

| Mode | Best for | What you get |
| --- | --- | --- |
| **`single`** *(default)* | Launching with **one product** (or just a few) | The homepage becomes a focused, conversion-first **product landing page**. Navigation collapses to the essentials — no mega-menu, no category browsing. |
| **`catalog`** | A **full multi-product shop** | The complete storefront: mega-menu, collections, category grids, featured rails, search. |

Set it in [`src/config/site.ts`](src/config/site.ts):

```ts
storeMode: 'single',                       // 'single' | 'catalog'
featuredProductSlug: 'aria-merino-sweater' // the one product 'single' mode revolves around
```

**Start in `single`** and sell your one product beautifully. When your range
grows and customers need to browse and filter, flip `storeMode` to `catalog` —
the header, footer, homepage and navigation all adapt automatically. You never
outgrow the template; you just add products and change one line.

> The logic lives in [`src/lib/store-mode.ts`](src/lib/store-mode.ts) and the two
> navigation sets in [`src/config/navigation.ts`](src/config/navigation.ts). The
> single-product homepage is [`single-product-home.tsx`](src/components/home/single-product-home.tsx).

---

## ✨ Highlights

- **Admin Studio** — a secure `/admin` cockpit: one big settings form, a product manager and a self-updating launch checklist. Configure the whole store without touching code.
- **Design system with real range** — 8 theme presets × 4 typography pairings × any accent colour, all switchable in the studio. Hundreds of distinct looks from the same components.
- **Homepage composer** — every homepage section (story, testimonials, Instagram, journal, newsletter…) toggles on/off in the admin, and the hero, founder-story and newsletter copy are all editable there too. No layout surgery.
- **Optional founder story & history** — a beautiful, ready-made section with founder portrait, pull quote and company timeline. Fill in your own story or ship the elegant placeholder until you have one.
- **Light & dark mode** — flash-free, system-aware, persisted per visitor; the store picks the default and can hide the toggle.
- **Fully designed pages** — homepage, product, collection, cart, checkout, search, account, blog, policies, contact, 404.
- **Working account flow** — register/sign-in/sign-out demo with a personalised dashboard (clearly labeled, per-browser, no passwords stored) and a one-file seam to plug in Auth.js/Clerk/Shopify accounts.
- **Security-hardened** — rate-limited constant-time admin login, signed HttpOnly sessions, CSRF checks, strict security headers, validated checkout input. See [SECURITY.md](SECURITY.md).
- **Config-driven** — brand, currencies, languages, announcements, feature flags all live in [`src/config`](src/config); your overrides live in one portable JSON file.
- **Zero image assets required** — a deterministic "studio gradient" placeholder system ([`MediaImage`](src/components/ui/media-image.tsx)) makes a fresh install look complete. Drop in real photos any time.
- **Commerce state** — cart, wishlist, compare, recently-viewed, save-for-later, currency & locale — all persisted to `localStorage`.
- **Real checkout** — Stripe Checkout, working discount codes, a demo-mode fallback when no key is configured (see [Taking payments](#-taking-payments)).
- **Conversion features** — slide-out cart, free-shipping progress bar, quick add, quick view, sticky add-to-cart, countdown timers, gift wrapping, newsletter popup and social-proof toasts that never stack or overlap, live-chat widget.
- **Typo-tolerant search** — ranked, fuzzy product search (Fuse.js), not just plain substring matching.
- **Internationalization** — currency + language switcher, complete UI dictionaries for English, Danish, German, French and Spanish, graceful fallback, localized pricing, `<html lang>`/RTL aware.
- **SEO** — per-page metadata, Open Graph + Twitter cards, dynamic OG image, JSON-LD (Organization, WebSite, Product, Breadcrumb, FAQ), `sitemap.xml`, `robots.txt`, canonical URLs, breadcrumbs.
- **Accessible** — keyboard nav, focus-visible rings, skip link, ARIA labels, `prefers-reduced-motion` support, and every drawer/modal/lightbox traps focus and restores it on close.
- **Touch-friendly gallery** — swipeable product images and lightbox on mobile (Embla Carousel), hover-zoom on desktop.
- **Fast** — static generation for all catalogue pages, `next/image`, lazy reveal-on-scroll, skeleton loaders.

---

## 🚀 Getting started

```bash
npm install
npm run setup    # guided: brand, accent colour, store mode, first product, admin password
npm run dev      # http://localhost:3000  ·  admin at /admin
npm run build    # production build
npm run start    # serve the production build
```

Requires Node 18.18+ (tested on Node 24).

`npm run setup` is the fastest path from "cloned the repo" to a branded,
running store — it asks a few questions, writes the answers into the config
files, and can generate your Admin Studio password. From there, do the rest
visually at **`/admin`**.

Copy [`.env.example`](.env.example) to `.env.local` if you want real Stripe
Checkout — see [Taking payments](#-taking-payments) below. Nothing in
`.env.local` is required to run the template.

**📖 Full walk-through:** [docs/SETUP-GUIDE.md](docs/SETUP-GUIDE.md) ·
**✅ Printable checklist:** [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md)

---

## 🎛 Admin Studio (`/admin`)

The template's answer to "make launching as SaaS-easy as possible": a
password-protected studio where the owner fills out **one big form** and the
store is configured — no code, no hunting through files.

| Page | Covers |
| --- | --- |
| **Store settings** | Brand & identity, contact, store mode + featured product, design (8 themes × 4 font pairings × accent, dark-mode), announcements & countdown, homepage composer (14 section toggles + hero copy), founder story & timeline editor, newsletter copy, all 11 feature flags, discount codes, currencies & languages, social links, trust numbers, payment badges, SEO/domain, demo-catalogue visibility — one Save button. |
| **Products** | Add, edit, duplicate and delete products (title, price, images, colours, sizes, collections, stock, flags). Demo products can be duplicated as starting points. |
| **Launch checklist** | Live launch progress — most items tick themselves as the config changes. |

How it works (and why it's safe):

- Enabled only when `ADMIN_PASSWORD` is set (`npm run setup` generates one).
  Login is rate-limited with constant-time comparison; sessions are signed
  HttpOnly cookies verified by middleware on every request.
- Saving writes two plain JSON files — [`src/config/store-settings.json`](src/config/store-settings.json)
  and [`src/lib/data/custom-products.json`](src/lib/data/custom-products.json) —
  which hot-reload the dev server instantly (keep the storefront open in a
  second tab as a live preview) and get committed with your repo.
- **Writes only work in local dev.** A deployed store is immutable: even a
  stolen admin session can't deface it. Edit locally → commit → deploy.
- Those two JSON files *are* the store's identity — copy them into a fresh
  clone of the template and you've re-created the store. That's the whole
  re-use story for spinning up store #2, #3, … (details in the
  [setup guide](docs/SETUP-GUIDE.md#-reusing-the-template-for-your-next-store)).

---

## 🚀 Deploy

The template is a standard Next.js app — deploy it anywhere Next runs
(Vercel, Netlify, Cloudflare, a Node server, Docker). One click on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Christian-Y-Wu/Webshop-Template)

**SEO just works on the first deploy.** Canonical URLs, Open Graph images,
JSON-LD, `sitemap.xml` and `robots.txt` all use the store's public URL, which
resolves automatically from the environment ([`src/lib/site-url.ts`](src/lib/site-url.ts)) —
you don't have to edit any code:

| Priority | Source | When it's used |
| --- | --- | --- |
| 1 | `NEXT_PUBLIC_SITE_URL` | Set this once you point a **custom domain** at the store |
| 2 | `VERCEL_PROJECT_PRODUCTION_URL` | Vercel's stable production domain (auto-injected) |
| 3 | `VERCEL_URL` | The per-deployment URL for preview builds (auto-injected) |
| 4 | `siteConfig.url` | The fallback in [`src/config/site.ts`](src/config/site.ts) |

So a fresh Vercel deploy is correctly indexable immediately; add your custom
domain and set `NEXT_PUBLIC_SITE_URL` when you have one. For real payments, add
`STRIPE_SECRET_KEY` in your host's environment variables (see below).

---

## 🎨 Rebranding checklist

**The easy way: open `/admin` and fill out the form.** Everything the studio
writes can also be edited by hand — it's all data, no component surgery:

| To change… | Edit |
| --- | --- |
| **Anything the studio covers** (brand, mode, design, features, discounts, i18n, socials, trust, SEO) | [`src/config/store-settings.json`](src/config/store-settings.json) — or the defaults in [`src/config/site.ts`](src/config/site.ts) |
| **Your products** | [`src/lib/data/custom-products.json`](src/lib/data/custom-products.json) — or `/admin/products` |
| Header mega-menu & footer links | [`src/config/navigation.ts`](src/config/navigation.ts) |
| Colours, fonts, radius, shadows | [`src/app/globals.css`](src/app/globals.css) (CSS variables) + [`tailwind.config.ts`](tailwind.config.ts) |
| Demo catalogue (or delete it) | [`src/lib/data/products.ts`](src/lib/data/products.ts) |
| Collections | [`src/lib/data/collections.ts`](src/lib/data/collections.ts) |
| Reviews / testimonials / blog / FAQ / policy pages | [`src/lib/data/`](src/lib/data) |
| UI translations (5 languages ship complete) | [`src/lib/i18n/dictionaries.ts`](src/lib/i18n/dictionaries.ts) |

### Change the design

The whole theme is driven by CSS custom properties in [`globals.css`](src/app/globals.css). To restyle, edit the accent trio:

```css
:root {
  --color-accent: 178 88 63;      /* space-separated RGB channels */
  --color-accent-soft: 240 226 219;
  --color-accent-ink: 255 255 255;
}
```

**Eight ready-made theme presets** ship in the same file — pick one from the
visual swatch picker in the studio's Design section (or set `theme` in `site.ts`):

```ts
theme: 'midnight'
// '' (ivory) | 'midnight' | 'botanic' | 'cobalt' | 'noir' | 'blush' | 'sand' | 'orchid'
```

**Four typography pairings** switch the whole store's type in one click
(`fontPreset` in `site.ts`, or the Design section):

```ts
fontPreset: 'editorial'
// 'editorial' (Fraunces serif) | 'modern' (Space Grotesk) | 'classic' (Playfair) | 'minimal' (all Inter)
```

Any theme × any font pairing × any accent colour — hundreds of distinct
storefronts from the same components, no CSS required.

Visitors also get a **light/dark toggle** in the header (flash-free,
system-aware, persisted). The store chooses the default mode — and whether
the toggle shows at all — in the studio's Design section.

### Compose the homepage

Every homepage section is optional. In the studio's **Homepage** section,
toggle any of the 14 sections (featured collections, value props, founder
story, testimonials, journal, Instagram, FAQ, newsletter…) and the page
recomposes without gaps — in both store modes. The same panel edits the hero
headline & CTAs, the **founder story** (portrait quote, origin story, milestone
timeline) and the newsletter band's copy. Defaults live in
[`src/config/site.ts`](src/config/site.ts) as polished placeholder content, so
the store looks finished before you've written a word.

### Use real product photos

Add a `src` to any image and the placeholder is replaced by an optimized `next/image`:

```ts
images: [{ seed: 'aria-1', alt: 'Aria sweater', src: 'https://…/aria.jpg' }]
```

Add the image host to `remotePatterns` in [`next.config.mjs`](next.config.mjs).

### Keep content cross-references honest

Products reference collection handles and each other (`pairsWith`), and
`site.ts` points at a `featuredProductSlug` — plain strings that TypeScript
can't check for you. `npm run validate` (runs automatically before `dev` and
`build`) catches a typo'd reference before it silently produces an empty
collection page, with a "did you mean…" suggestion:

```bash
npm run validate
```

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

## 💳 Taking payments

Checkout uses **real Stripe Checkout** — [`src/app/api/checkout/route.ts`](src/app/api/checkout/route.ts)
creates a live Checkout Session and the Pay button redirects to it.

1. Copy [`.env.example`](.env.example) to `.env.local`.
2. Add a test key from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys) as `STRIPE_SECRET_KEY`.
3. Restart `npm run dev` — checkout now charges (in test mode) and lands on `/checkout/success`.

No key set? Checkout stays in demo mode: the Pay button shows a clear message
instead of silently failing. Charges always use `siteConfig.defaultCurrency`
— the multi-currency switcher elsewhere in the store is illustrative, so it's
never used to move real money.

---

## 🧩 Connecting a real backend

Product data is still static (this is a **frontend template**) — to go live with a real catalogue:

- Replace the functions in [`src/lib/data/products.ts`](src/lib/data/products.ts) / `collections.ts` with fetches to **Shopify Storefront API**, Medusa, Swell, BigCommerce, etc.
- Extend [`src/app/api/checkout/route.ts`](src/app/api/checkout/route.ts) to price line items from that backend instead of trusting the client cart.
- Swap the demo customer auth in [`src/components/providers/auth-provider.tsx`](src/components/providers/auth-provider.tsx) for Auth.js, Clerk, Supabase Auth or your platform's customer accounts — the account UI already consumes its `user / login / register / logout` interface.
- Hook the newsletter/contact forms to your ESP (Klaviyo, Mailchimp…).

The `CartLine` / `Product` types in [`src/lib/types.ts`](src/lib/types.ts) are the contract to map against.

---

## ✅ Testing & validation

```bash
npm run validate  # content cross-reference checks (also runs before dev/build)
npm test          # Vitest + React Testing Library smoke tests
```

---

## 🛠 Tech

Next.js 14 · React 18 · TypeScript · Tailwind CSS 3 · Framer Motion · lucide-react ·
Embla Carousel · Fuse.js (search) · Stripe · Inter + Fraunces + Space Grotesk + Playfair (`next/font`) ·
Vitest + React Testing Library · `tsx` + `prompts` (setup/validation scripts).

---

## 📚 Docs

- [docs/SETUP-GUIDE.md](docs/SETUP-GUIDE.md) — clone → configure → deploy, step by step, plus how to reuse the template for your next store.
- [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md) — printable go-live checklist (the live version is `/admin/launch`).
- [SECURITY.md](SECURITY.md) — the security model, what's hardened, and the two documented limitations to fix before scaling.

---

*AURA ships with placeholder content and is provided as a starter template. Replace branding, imagery and copy before launching a real store.*
