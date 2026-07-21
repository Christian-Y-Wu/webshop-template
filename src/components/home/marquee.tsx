import { Sparkles } from 'lucide-react';
import { hasSocialProof } from '@/lib/social-proof';
import { siteConfig } from '@/config/site';
import { compactNumber } from '@/lib/utils';

/* Claims that are true of any store running this template. */
const items = [
  'Free worldwide shipping over $75',
  'Carbon-neutral delivery',
  '30-day easy returns',
  'Crafted to last',
  'Traceable materials',
  '2-year quality guarantee',
  'Secure checkout',
];

export function Marquee() {
  // The customer-count claim only joins the ticker once it's earned.
  const all = hasSocialProof
    ? [...items, `Loved by ${compactNumber(siteConfig.trust.ratingCount)}+ customers`]
    : items;
  const row = [...all, ...all];
  return (
    <section aria-hidden className="mt-6 overflow-hidden border-y border-line bg-surface py-3.5">
      <div className="flex w-max animate-marquee items-center">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-3 whitespace-nowrap px-6 text-sm text-ink-soft">
            <Sparkles size={14} className="text-accent" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
