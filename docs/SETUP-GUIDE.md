# 🚀 Setup Guide — from clone to live store

The complete, do-this-then-that path. Total time for a first launch:
**about an hour**, most of it writing your own product copy.

> **TL;DR** — `npm install` → `npm run setup` → `npm run dev` → open
> **http://localhost:3000/admin** and fill out the big form → push → live.

---

## Step 0 — What you need

- **Node 18.18+** (`node -v` to check)
- A **GitHub** account (to host the code)
- A **Vercel** account (free) or any Next.js host, when you're ready to deploy
- A **Stripe** account, when you're ready to take payments

## Step 1 — Install & bootstrap (5 min)

```bash
npm install
npm run setup     # answers a few questions, brands the store,
                  # generates your Admin Studio password
npm run dev       # → http://localhost:3000
```

`npm run setup` asks for the store name, accent colour, store mode and your
first product, and can enable the **Admin Studio** with a generated password
(saved to `.env.local` — keep it somewhere safe).

If you skipped setup, enable the studio by hand: create `.env.local` with

```
ADMIN_PASSWORD=pick-a-long-passphrase
```

## Step 2 — The Admin Studio: one form to rule them all (20–30 min)

Open **http://localhost:3000/admin** and sign in. This is the SaaS-style
cockpit of the template — everything an owner needs, no code:

| Page | What you do there |
| --- | --- |
| **Store settings** | The big form: brand, contact, store mode, design (theme, accent colour, light/dark), announcements, feature toggles, discount codes, currencies & languages, social links, trust numbers, SEO/domain. One Save button. |
| **Products** | Add/edit/delete your products; duplicate demo entries as starting points; hide the demo catalogue when yours are ready. |
| **Launch checklist** | Live progress toward launch — items tick themselves as you configure. |

Keep the storefront open in a second tab — every save hot-reloads it
instantly, so it doubles as a live preview.

What the studio actually does: it writes two small JSON files —
`src/config/store-settings.json` and `src/lib/data/custom-products.json`.
They're plain, hand-editable, and **they are your store**: commit them like
any other code. That's also why the deployed site can't be defaced through
the admin — the live site is immutable; edits only happen on your machine.

**Work through the Launch checklist top to bottom.** It's the same list as
[LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md), but self-updating.

## Step 3 — Content that isn't in the studio (10–20 min)

A few content files are worth a quick pass in your editor:

| Content | File |
| --- | --- |
| Policy pages (shipping, returns, privacy, terms) | `src/lib/data/pages.ts` |
| FAQ | `src/lib/data/faq.ts` |
| Blog posts (or delete the demo ones) | `src/lib/data/blog.ts` |
| Reviews & testimonials (replace or empty the demo ones) | `src/lib/data/reviews.ts`, `testimonials.ts` |
| Collections (if you use catalog mode) | `src/lib/data/collections.ts` |
| Header/footer navigation | `src/config/navigation.ts` |
| UI translations | `src/lib/i18n/dictionaries.ts` |

`npm run validate` (runs automatically before dev/build) catches any broken
cross-references with a "did you mean…" suggestion.

## Step 4 — Payments (10 min)

1. In the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys), copy a **test** secret key.
2. Add it to `.env.local`: `STRIPE_SECRET_KEY=sk_test_…`
3. Restart `npm run dev`, add something to the cart, and pay with the test
   card `4242 4242 4242 4242` (any future date, any CVC).
4. Confirm you land on `/checkout/success` and the payment shows in Stripe.

Swap to the live key **in your host's environment variables** on launch day.

## Step 5 — Deploy (10 min)

The template deploys anywhere Next.js runs. On Vercel:

1. Push the repo to GitHub (with your committed settings/products JSON).
2. **Import** the repo in Vercel — no build settings needed.
3. Add env vars in Vercel → Settings → Environment Variables:
   - `STRIPE_SECRET_KEY` (when ready for real payments)
   - `NEXT_PUBLIC_SITE_URL` (once you attach a custom domain)
   - `ADMIN_PASSWORD` — **optional**; if set, `/admin` works as a read-only
     status/checklist page. Leave unset to disable admin entirely in prod.

SEO works from the first deploy: canonicals, `sitemap.xml`, `robots.txt`,
Open Graph images and JSON-LD all resolve the public URL from the
environment automatically.

## Step 6 — After launch

- Submit your domain in **Google Search Console** and submit `/sitemap.xml`.
- Check a share preview (e.g. paste your URL into opengraph.xyz or a Slack DM).
- Point the studio's social links at your real profiles.
- Read [SECURITY.md](../SECURITY.md) — especially the two documented
  limitations (demo customer auth, client-priced cart) and when to fix them.

---

## ♻️ Reusing the template for your next store

The whole store identity lives in **three files**:

```
src/config/store-settings.json      ← everything from the big form
src/lib/data/custom-products.json   ← your products
.env.local                          ← secrets (never committed)
```

To spin up store #2: clone the template fresh, copy nothing (or copy those
two JSON files as a starting point), run `npm run setup`, and fill out the
studio again. Because your customisations are data — not edits scattered
through components — template updates stay easy to pull in: your stores and
the template's code evolve independently.

Tip: keep the template repo as an upstream remote…

```bash
git remote add template https://github.com/Christian-Y-Wu/Webshop-Template
git fetch template
git merge template/main     # pull template improvements into a store
```

…and your per-store changes will rarely conflict, because they live in the
JSON layer.

## Customer accounts (when you need real ones)

Shoppers can browse, buy and check out **without** accounts — don't block
launch on this. The built-in account area is a working demo (per-browser,
no passwords stored). When you want real accounts, replace the internals of
`src/components/providers/auth-provider.tsx` with
[Auth.js](https://authjs.dev), [Clerk](https://clerk.com), Supabase Auth, or
your commerce platform's customer API — the UI already consumes the
provider's `user / login / register / logout` interface.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `/admin` says the studio isn't enabled | Add `ADMIN_PASSWORD=…` to `.env.local`, restart `npm run dev`. |
| Studio says "Read-only deploy" | You're on a deployed build. Edits happen locally via `npm run dev`, then commit + push. |
| Save rejected with a validation list | Fix the listed fields — the API refuses to write config that would break the site (e.g. featured product that doesn't exist). |
| Checkout button says demo mode | `STRIPE_SECRET_KEY` missing — Step 4. |
| Real product photo doesn't load | Add the image host to `remotePatterns` in `next.config.mjs`. |
| Build fails on content validation | Read the message — it names the file, the bad reference and a suggestion. |
