import { Leaf, PackageCheck, Recycle, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

const props = [
  { icon: Truck, title: 'Complimentary shipping', body: 'Free, carbon-neutral delivery on every order over $75, worldwide.' },
  { icon: PackageCheck, title: '30-day easy returns', body: 'Changed your mind? Return anything within 30 days, on us.' },
  { icon: ShieldCheck, title: 'Secure & protected', body: 'SSL-encrypted checkout and a 2-year quality guarantee.' },
  { icon: Leaf, title: 'Responsibly made', body: 'Traceable materials and partners who share our values.' },
];

export function ValueProps() {
  return (
    <section className="container-page mt-20 lg:mt-28">
      <Reveal>
        <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {props.map((p) => (
            <div key={p.title} className="flex flex-col gap-3 bg-surface p-7">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
                <p.icon size={22} strokeWidth={1.6} />
              </span>
              <h3 className="text-base font-medium text-ink">{p.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{p.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
