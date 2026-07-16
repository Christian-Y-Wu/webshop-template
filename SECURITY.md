# Security

How AURA is secured, what the template does and doesn't protect, and the
hardening checklist before you take real customers' money.

## The security model in one paragraph

The deployed storefront is **immutable and (almost) stateless**: products and
configuration are compiled in at build time, there is no database, no runtime
admin surface that can change the live site, and the only server code paths
are the Stripe checkout session (`/api/checkout`) and the Admin Studio API
(which refuses writes outside local development). What doesn't exist can't be
hacked — that is the template's main defence.

## Admin Studio (`/admin`)

| Property | How |
| --- | --- |
| **Off by default** | The studio only exists when `ADMIN_PASSWORD` is set. A fresh deploy exposes nothing. |
| **Login protection** | Rate-limited (5 attempts / 15 min / IP), constant-time password comparison — no brute-forcing, no timing side channel. |
| **Sessions** | Signed HMAC-SHA256 tokens in an `HttpOnly`, `SameSite=Lax` cookie (`Secure` in production), 8-hour expiry. No session store to leak. Changing the password invalidates all sessions. |
| **Route protection** | `src/middleware.ts` verifies the signature on every `/admin` request; API routes re-verify server-side. |
| **CSRF** | Mutating admin APIs additionally require a same-origin `Origin` header. |
| **Writes are dev-only** | Saving settings/products writes source files, which only works (and only makes sense) under `npm run dev` on your machine. A production deployment is **read-only by design** — even a stolen admin session cannot change the live store. |
| **Not indexed** | `robots.txt`, `X-Robots-Tag` and page metadata all exclude `/admin`. |

**Intended workflow:** edit locally in the studio → the studio writes
`store-settings.json` / `custom-products.json` → commit → deploy. The live
site never mutates.

## Customer accounts

The account area is a **clearly-labeled demo**: accounts live in the
visitor's own `localStorage`, and passwords are never stored or transmitted
(the password field is cosmetic). This is intentional — shipping a
half-secure homegrown auth backend in a template would be worse than
shipping none. Before launch, swap `src/components/providers/auth-provider.tsx`
for a real provider (Auth.js/NextAuth, Clerk, Supabase Auth, or your commerce
platform's customer accounts). The rest of the account UI only consumes
`user / login / register / logout`, so the swap is contained to that file.

## Checkout

- Charges only happen via **Stripe Checkout** on Stripe's servers; card data
  never touches this codebase.
- Discount codes are re-validated server-side against the store config — a
  tampered request can't invent a discount.
- All client-supplied values are type-checked, clamped and capped
  (line count, quantity, unit price, shipping/tax) before a session is created.
- **Known limitation (by design, documented in the README):** line-item
  *prices* are trusted from the client because the template has no order
  backend. Before selling at scale, price the cart server-side from your
  product source of truth in `src/app/api/checkout/route.ts`. Until then, the
  worst a tampered request can do is *overpay* or underpay for an order you
  haven't fulfilled yet — always confirm amounts in the Stripe dashboard
  before shipping goods.

## Platform headers

`next.config.mjs` sends on every response:
`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
`Referrer-Policy: strict-origin-when-cross-origin`, a restrictive
`Permissions-Policy`, and `Strict-Transport-Security` (2 years).

## Pre-launch hardening checklist

1. **Strong `ADMIN_PASSWORD`** (12+ chars; `npm run setup` can generate one).
   In production, either don't set it at all (studio fully disabled) or treat
   it as a read-only status page.
2. **HTTPS only** — automatic on Vercel/Netlify/Cloudflare; confirm the padlock.
3. **Secrets live in env vars** — never commit `.env.local`. Set
   `STRIPE_SECRET_KEY` in your host's dashboard, not in code.
4. **Use Stripe test keys** until the day you launch; verify webhooks/orders
   in the Stripe dashboard before fulfilling anything.
5. **Real auth before real accounts** — see "Customer accounts" above.
6. **Server-side pricing before scale** — see "Checkout" above.
7. Keep dependencies fresh: `npm audit` / `npm outdated` occasionally.

## Reporting

This is a template; if you find a security issue in it, please open a GitHub
issue (or contact the maintainer privately for anything sensitive).
