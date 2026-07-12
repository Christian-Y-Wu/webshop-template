/* ==========================================================================
   CANONICAL SITE URL

   Every piece of SEO — canonical tags, Open Graph images, JSON-LD, the
   sitemap and robots.txt — needs the store's absolute, public base URL.
   Hard-coding it in site.ts means a fresh deploy ships with `example.com`
   metadata until someone remembers to edit code.

   Instead we resolve it once, from the environment, in priority order, so a
   store has correct metadata the instant it goes live — zero code edits:

     1. NEXT_PUBLIC_SITE_URL          — set this to your custom domain
     2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable production domain
     3. VERCEL_URL                    — the per-deployment URL (preview builds)
     4. siteConfig.url                — the template's fallback default

   The Vercel variables are injected automatically on Vercel, so a one-click
   deploy just works; set NEXT_PUBLIC_SITE_URL only once you point a custom
   domain at the store.
   ========================================================================== */

import { siteConfig } from '@/config/site';

/**
 * Turn a raw value (possibly missing a scheme or carrying a trailing slash)
 * into a clean absolute origin like `https://shop.example.com`.
 */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withScheme.replace(/\/+$/, '');
}

/**
 * Resolve the canonical base URL from an environment map. Pure and injectable
 * so the precedence rules can be unit-tested without touching `process.env`.
 */
export function resolveSiteUrl(env: NodeJS.ProcessEnv = process.env): string {
  const raw =
    env.NEXT_PUBLIC_SITE_URL ||
    env.VERCEL_PROJECT_PRODUCTION_URL ||
    env.VERCEL_URL ||
    siteConfig.url;
  return normalizeUrl(raw);
}

/** The store's absolute base URL, resolved once at module load. */
export const siteUrl = resolveSiteUrl();
