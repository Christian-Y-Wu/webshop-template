import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { MediaImage } from '@/components/ui/media-image';
import { siteConfig } from '@/config/site';
import { compactNumber } from '@/lib/utils';

const quickLinks = [
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'The Summer Edit', href: '/collections/summer' },
  { label: 'Sale', href: '/collections/sale' },
];

export function Hero() {
  // All copy lives in siteConfig.hero — editable in the Admin Studio's
  // Homepage section (placeholder defaults ship in src/config/site.ts).
  const hero = siteConfig.hero;

  return (
    <section className="container-page pt-6 lg:pt-8">
      <div className="relative grid gap-4 lg:grid-cols-12 lg:gap-5">
        {/* Main visual */}
        <div className="relative col-span-12 flex min-h-[68vh] flex-col justify-end overflow-hidden rounded-[26px] p-7 sm:p-10 lg:col-span-8 lg:min-h-[74vh] lg:p-14">
          <MediaImage seed="hero-main" alt={`${siteConfig.name} seasonal campaign`} priority monogram={false} sizes="(max-width: 1024px) 100vw, 66vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/5" />

          <div className="relative max-w-xl text-white">
            <p className="animate-fade-up text-xs font-medium uppercase tracking-eyebrow text-white/85">
              {hero.eyebrow}
            </p>
            <h1 className="mt-4 animate-fade-up font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[0.98] tracking-tight text-balance [animation-delay:80ms]">
              {hero.heading}
            </h1>
            <p className="mt-5 max-w-md animate-fade-up text-[15px] leading-relaxed text-white/85 [animation-delay:160ms]">
              {hero.subheading}
            </p>
            <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:240ms]">
              <Link href={hero.primaryCtaHref} className="btn bg-white px-8 py-4 text-ink hover:bg-accent hover:text-accent-ink">
                {hero.primaryCtaLabel}
                <ArrowRight size={17} />
              </Link>
              {hero.secondaryCtaLabel && (
                <Link href={hero.secondaryCtaHref} className="btn border border-white/40 px-8 py-4 text-white backdrop-blur-sm hover:bg-white hover:text-ink">
                  {hero.secondaryCtaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Side rail */}
        <div className="col-span-12 grid gap-4 lg:col-span-4 lg:gap-5">
          {/* Promo card */}
          <Link
            href="/collections/sale"
            className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[26px] p-7 text-white"
          >
            <MediaImage seed="hero-promo" alt="Summer sale" monogram={false} sizes="(max-width: 1024px) 100vw, 33vw" />
            <div className="absolute inset-0 bg-gradient-to-br from-accent/85 to-ink/70" />
            <div className="relative">
              <span className="badge bg-white/90 text-ink">Limited time</span>
            </div>
            <div className="relative">
              <p className="font-serif text-3xl leading-tight">Summer Sale</p>
              <p className="mt-1 text-sm text-white/85">Up to 40% off selected pieces</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                Shop the sale
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Rating + quick links */}
          <div className="flex flex-1 flex-col justify-between rounded-[26px] border border-line bg-surface p-7">
            <div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-highlight text-highlight" />
                ))}
              </div>
              <p className="mt-3 text-sm text-ink-soft">
                Rated <strong className="text-ink">{siteConfig.trust.ratingValue}/5</strong> by{' '}
                {compactNumber(siteConfig.trust.ratingCount)}+ happy customers worldwide.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {quickLinks.map((q) => (
                <Link
                  key={q.label}
                  href={q.href}
                  className="rounded-pill border border-line px-3.5 py-2 text-xs font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  {q.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
