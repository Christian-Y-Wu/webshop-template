# ✅ Launch Checklist

The printable version of **/admin/launch** (which computes most of these
automatically — prefer working there). Details for every item are in the
[Setup Guide](SETUP-GUIDE.md).

## Brand & content

- [ ] Store name and tagline set (not the AURA demo branding)
- [ ] Real support email, phone and address
- [ ] Announcement bar messages match your actual offers
- [ ] Policy pages rewritten (shipping, returns, privacy, terms — `src/lib/data/pages.ts`)
- [ ] Trust numbers (rating / review count) are honest — real or zeroed
- [ ] Demo blog posts, reviews and testimonials replaced or removed

## Products

- [ ] At least one product of your own (Admin Studio → Products)
- [ ] Demo catalogue hidden (Store settings → Catalogue)
- [ ] Featured product is yours (single mode homepage hero)
- [ ] Real product photos on every product
- [ ] Prices, stock levels and sizes/colours correct

## Payments

- [ ] `STRIPE_SECRET_KEY` set (test key first)
- [ ] Test order placed end-to-end with `4242 4242 4242 4242`
- [ ] Discount codes reviewed (WELCOME10 / FREESHIP ship enabled)
- [ ] Live key set in the host's env vars on launch day

## SEO & social

- [ ] Custom domain attached; `NEXT_PUBLIC_SITE_URL` set
- [ ] Social profile links point at your real accounts
- [ ] Share preview checked (OG card renders your brand)
- [ ] Domain verified in Google Search Console, `/sitemap.xml` submitted

## Security & go-live

- [ ] `ADMIN_PASSWORD` is 12+ characters (or unset in production)
- [ ] `.env.local` never committed; secrets only in host env vars
- [ ] Site served over HTTPS (padlock on your domain)
- [ ] `store-settings.json` + `custom-products.json` committed
- [ ] Lighthouse run on the deployed homepage (aim ≥ 90 across the board)
- [ ] Read [SECURITY.md](../SECURITY.md) — know the two documented limitations
