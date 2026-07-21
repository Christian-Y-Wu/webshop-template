import { Quote } from 'lucide-react';
import { testimonials } from '@/lib/data/testimonials';
import { StarRating } from '@/components/ui/star-rating';
import { SectionHeader } from '@/components/ui/section-header';
import { Reveal } from '@/components/ui/reveal';
import { siteConfig } from '@/config/site';
import { hasSocialProof } from '@/lib/social-proof';
import { compactNumber } from '@/lib/utils';

export function Testimonials() {
  // Nothing to show yet — render nothing rather than an empty band.
  if (testimonials.length === 0) return null;

  return (
    <section className="mt-20 border-y border-line bg-surface py-20 lg:mt-28 lg:py-28">
      <div className="container-page">
        <SectionHeader
          align="center"
          eyebrow="Loved by thousands"
          title="Don’t just take our word for it"
          // Drop the "rated X/5 across N reviews" line until the store has them.
          description={
            hasSocialProof
              ? `Rated ${siteConfig.trust.ratingValue}/5 across ${compactNumber(siteConfig.trust.ratingCount)}+ verified reviews.`
              : undefined
          }
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal key={t.id} delay={i * 80}>
              <figure className="flex h-full flex-col rounded-card border border-line bg-canvas p-7">
                <Quote size={28} className="text-accent/30" />
                <StarRating rating={t.rating} size={15} className="mt-4" />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-soft">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft font-serif text-accent">
                    {t.author.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.author}</p>
                    <p className="text-xs text-ink-muted">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Review platform placeholders */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-ink-muted">
          {['Trustpilot', 'Google Reviews', 'Judge.me', 'Feefo'].map((p) => (
            <div key={p} className="flex items-center gap-2 text-sm">
              <StarRating rating={4.8} size={13} />
              <span className="font-medium">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
