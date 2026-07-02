import { Sparkles } from 'lucide-react';

const items = [
  'Free worldwide shipping over $75',
  'Carbon-neutral delivery',
  '30-day easy returns',
  'Crafted to last',
  'Traceable materials',
  '2-year quality guarantee',
  'Secure checkout',
  'Loved by 12,000+ customers',
];

export function Marquee() {
  const row = [...items, ...items];
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
