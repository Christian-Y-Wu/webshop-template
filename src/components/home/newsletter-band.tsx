'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { MediaImage } from '@/components/ui/media-image';
import { Reveal } from '@/components/ui/reveal';

export function NewsletterBand() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <section className="container-page mt-20 lg:mt-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[26px] px-6 py-16 text-center text-white sm:px-12 lg:py-24">
          <MediaImage seed="newsletter-band" alt="" monogram={false} sizes="100vw" />
          <div className="absolute inset-0 bg-ink/70" />
          <div className="relative mx-auto max-w-xl">
            <p className="text-xs font-medium uppercase tracking-eyebrow text-white/70">Stay in the loop</p>
            <h2 className="mt-4 font-serif text-[clamp(1.9rem,3.5vw,3rem)] leading-tight text-white text-balance">
              Get 10% off your first order
            </h2>
            <p className="mt-3 text-white/75">
              Join our community for early access to new arrivals, private sales and stories from the studio.
            </p>

            {done ? (
              <p className="mx-auto mt-8 inline-flex items-center gap-2 rounded-pill bg-white/15 px-5 py-3 text-sm backdrop-blur">
                <Check size={16} /> You’re in! Your code <strong>WELCOME10</strong> is on its way.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setDone(true);
                }}
                className="mx-auto mt-8 flex max-w-md items-center rounded-pill bg-white/95 p-1.5"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent px-5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                  aria-label="Email address"
                />
                <button type="submit" className="btn bg-ink px-6 py-3 text-canvas hover:bg-accent hover:text-accent-ink">
                  Subscribe
                  <ArrowRight size={15} />
                </button>
              </form>
            )}
            <p className="mt-4 text-xs text-white/50">No spam, unsubscribe anytime. We respect your privacy.</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
