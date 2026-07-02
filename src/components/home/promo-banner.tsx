import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MediaImage } from '@/components/ui/media-image';
import { Countdown } from '@/components/ui/countdown';
import { Reveal } from '@/components/ui/reveal';
import { siteConfig } from '@/config/site';

export function PromoBanner() {
  return (
    <section className="container-page mt-20 lg:mt-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[26px] bg-ink text-canvas">
          <div className="grid lg:grid-cols-2">
            {/* Copy */}
            <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <p className="text-xs font-medium uppercase tracking-eyebrow text-accent">
                {siteConfig.countdownLabel}
              </p>
              <h2 className="mt-4 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] text-canvas">
                The Summer Edit is here
              </h2>
              <p className="mt-4 max-w-md text-canvas/70">
                Up to 40% off a curated selection of warm-weather essentials. Thoughtful pieces, considered prices — for a limited time only.
              </p>

              <div className="mt-8">
                <Countdown to={siteConfig.countdownTo} variant="boxed" />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/collections/summer" className="btn bg-canvas px-8 py-4 text-ink hover:bg-accent hover:text-accent-ink">
                  Shop the edit
                  <ArrowRight size={17} />
                </Link>
                <Link href="/collections/sale" className="btn border border-canvas/30 px-8 py-4 text-canvas hover:bg-canvas hover:text-ink">
                  View all sale
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="relative min-h-[280px] lg:min-h-full">
              <MediaImage seed="promo-summer" alt="The Summer Edit" monogram={false} sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent lg:from-ink" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
