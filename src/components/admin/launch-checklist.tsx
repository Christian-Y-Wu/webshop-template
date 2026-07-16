'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminConfig } from '@/components/admin/use-admin-config';

/* ==========================================================================
   LAUNCH CHECKLIST — the guided path from "cloned the template" to "live
   store". Auto items are computed from the real configuration, so they tick
   themselves as you work; manual items persist per-browser.
   ========================================================================== */

interface Item {
  id: string;
  label: string;
  detail: string;
  /** undefined = manual checkbox; boolean = computed automatically */
  done?: boolean;
  href?: string;
  external?: boolean;
}

interface Group {
  title: string;
  items: Item[];
}

function buildGroups(c: AdminConfig): Group[] {
  const e = c.effective;
  const social = Object.values(e.social).filter(Boolean);
  const defaultSocial = ['https://instagram.com', 'https://tiktok.com', 'https://pinterest.com', 'https://youtube.com', 'https://facebook.com'];
  const hasOwnProducts = c.customProducts.length > 0;

  return [
    {
      title: 'Brand & content',
      items: [
        {
          id: 'name',
          label: 'Store name and tagline set',
          detail: 'Replace the AURA demo branding with your own.',
          done: e.name !== 'AURA' && e.tagline !== 'Considered essentials for a beautiful everyday.',
          href: '/admin#brand',
        },
        {
          id: 'email',
          label: 'Real support email',
          detail: 'Shown in the footer and used by customers to reach you.',
          done: !e.email.includes('aura-store.com') && !e.email.includes('example.com'),
          href: '/admin#contact',
        },
        {
          id: 'announcements',
          label: 'Announcement bar reviewed',
          detail: 'The rotating messages above the header should match your actual offers.',
          href: '/admin#announcements',
        },
        {
          id: 'legal',
          label: 'Policy pages reviewed',
          detail: 'Shipping, returns, privacy and terms ship with placeholder copy — replace before charging real customers (src/lib/data/pages.ts).',
          href: '/pages/shipping',
          external: true,
        },
        {
          id: 'trust-honest',
          label: 'Trust numbers are honest',
          detail: 'The rating and review counts are demo placeholders — set them to your real numbers or zero. Fabricated social proof is illegal in many markets.',
          href: '/admin#trust',
        },
      ],
    },
    {
      title: 'Products',
      items: [
        {
          id: 'own-product',
          label: 'At least one product of your own',
          detail: 'Add it in the product manager or duplicate a demo entry.',
          done: hasOwnProducts,
          href: '/admin/products',
        },
        {
          id: 'demo-hidden',
          label: 'Demo catalogue hidden',
          detail: 'Once your products are in, hide the placeholder catalogue.',
          done: e.hideDemoCatalog,
          href: '/admin#catalogue',
        },
        {
          id: 'featured',
          label: 'Featured product is yours',
          detail: 'The homepage hero should sell your product, not a demo sweater.',
          done: c.customProducts.some((p) => p.slug === e.featuredProductSlug),
          href: '/admin#mode',
        },
        {
          id: 'photos',
          label: 'Real product photos',
          detail: 'Generated placeholders look elegant but sell nothing — add photo URLs to your product images.',
          done: hasOwnProducts && c.customProducts.every((p) => p.images.some((i) => i.src)),
          href: '/admin/products',
        },
      ],
    },
    {
      title: 'Payments',
      items: [
        {
          id: 'stripe',
          label: 'Stripe key configured',
          detail: 'Set STRIPE_SECRET_KEY in .env.local (and in your host’s env for production). Without it checkout stays in demo mode.',
          done: c.meta.stripeConfigured,
        },
        {
          id: 'test-order',
          label: 'Test checkout end-to-end',
          detail: 'Place a test-mode order with card 4242 4242 4242 4242 and confirm you land on the success page.',
          href: '/checkout',
          external: true,
        },
        {
          id: 'discounts',
          label: 'Discount codes reviewed',
          detail: 'WELCOME10 and FREESHIP ship enabled by default — keep, change or remove them.',
          href: '/admin#discounts',
        },
      ],
    },
    {
      title: 'SEO & social',
      items: [
        {
          id: 'url',
          label: 'Public URL configured',
          detail: c.meta.siteUrlFromEnv
            ? `Resolving from the environment: ${c.meta.siteUrl}`
            : 'Set NEXT_PUBLIC_SITE_URL (or deploy to Vercel, where it resolves automatically). Canonicals, sitemap and OG images depend on it.',
          done: c.meta.siteUrlFromEnv || !e.url.includes('example.com'),
          href: '/admin#seo',
        },
        {
          id: 'social-links',
          label: 'Social profiles linked',
          detail: 'Point the footer icons at your actual profiles (or clear them).',
          done: social.length > 0 && !social.some((u) => defaultSocial.includes(u)),
          href: '/admin#social',
        },
        {
          id: 'og-preview',
          label: 'Share preview checked',
          detail: 'Paste your URL into a share-preview tool (e.g. opengraph.xyz) and confirm the card looks right — the OG image is generated from your brand automatically.',
        },
        {
          id: 'search-console',
          label: 'Submitted to Google Search Console',
          detail: 'Verify the domain and submit /sitemap.xml so indexing starts on day one.',
        },
      ],
    },
    {
      title: 'Security & go-live',
      items: [
        {
          id: 'admin-pw',
          label: 'Strong admin password (12+ chars)',
          detail: 'ADMIN_PASSWORD protects this studio. Longer is better; a passphrase is ideal.',
          done: c.meta.adminPasswordLength >= 12,
        },
        {
          id: 'https',
          label: 'Deployed behind HTTPS',
          detail: 'Vercel/Netlify/Cloudflare give you this automatically; confirm the padlock on your domain.',
        },
        {
          id: 'commit',
          label: 'Configuration committed',
          detail: 'store-settings.json and custom-products.json are part of the repo — commit them so the deploy matches what you built here.',
        },
        {
          id: 'lighthouse',
          label: 'Lighthouse pass',
          detail: 'Run Lighthouse (Chrome DevTools) on the deployed homepage — expect strong scores out of the box; investigate anything below 90.',
        },
      ],
    },
  ];
}

const STORAGE_KEY = 'aura:launch-checklist';

export function LaunchChecklist({ config }: { config: AdminConfig }) {
  const groups = useMemo(() => buildGroups(config), [config]);
  const [manual, setManual] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setManual(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const toggle = (id: string) => {
    setManual((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const isDone = (item: Item) => (item.done !== undefined ? item.done : hydrated && !!manual[item.id]);
  const all = groups.flatMap((g) => g.items);
  const doneCount = all.filter(isDone).length;
  const pct = Math.round((doneCount / all.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="rounded-card border border-line bg-surface p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-serif text-3xl">{pct}%</p>
            <p className="text-sm text-ink-muted">
              {doneCount} of {all.length} launch steps complete
            </p>
          </div>
          {pct === 100 && <p className="text-sm font-medium text-success">Ready for lift-off 🚀</p>}
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-pill bg-surface-muted">
          <div
            className="h-full rounded-pill bg-accent transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {groups.map((group) => (
        <section key={group.title} className="rounded-card border border-line bg-surface p-6">
          <h2 className="font-serif text-xl">{group.title}</h2>
          <ul className="mt-4 divide-y divide-line">
            {group.items.map((item) => {
              const done = isDone(item);
              const auto = item.done !== undefined;
              return (
                <li key={item.id} className="flex items-start gap-3 py-3.5">
                  {auto ? (
                    <span className={cn('mt-0.5 shrink-0', done ? 'text-success' : 'text-ink-muted')}>
                      {done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </span>
                  ) : (
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={done}
                      onClick={() => toggle(item.id)}
                      className={cn('mt-0.5 shrink-0 transition-colors', done ? 'text-success' : 'text-ink-muted hover:text-ink')}
                      aria-label={item.label}
                    >
                      {done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={cn('text-sm font-medium', done ? 'text-ink-muted line-through' : 'text-ink')}>
                      {item.label}
                      {auto && (
                        <span className="ml-2 rounded bg-surface-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-ink-muted">
                          auto
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{item.detail}</p>
                  </div>
                  {item.href && (
                    <Link
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      className="btn-ghost shrink-0 px-2.5 text-xs"
                    >
                      {item.external ? <ExternalLink size={14} /> : 'Fix'}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
