import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MediaImage } from '@/components/ui/media-image';
import { Reveal } from '@/components/ui/reveal';

const stats = [
  { value: '12k+', label: 'Five-star reviews' },
  { value: '60+', label: 'Countries shipped' },
  { value: '100%', label: 'Traceable materials' },
];

export function Editorial() {
  return (
    <section className="container-page mt-20 lg:mt-28">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <p className="eyebrow mb-4">Our philosophy</p>
          <h2 className="text-headline text-balance">
            Fewer, better things — made to be lived in
          </h2>
          <p className="mt-5 text-ink-soft text-pretty">
            We believe good design should be felt, not just seen. Every AURA piece begins with a
            question: will this still be loved in ten years? We work with small, specialist makers,
            choose materials that age beautifully, and obsess over the details you can’t see.
          </p>
          <p className="mt-4 text-ink-soft text-pretty">
            The result is a collection built to last — quietly luxurious, endlessly wearable, and
            kinder to the planet.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-6 border-y border-line py-6">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl text-ink">{s.value}</p>
                <p className="mt-1 text-xs text-ink-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <Link href="/pages/about" className="btn-primary mt-8">
            Read our story
            <ArrowRight size={16} />
          </Link>
        </Reveal>

        <Reveal className="order-1 grid grid-cols-2 gap-4 lg:order-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-card">
            <MediaImage seed="editorial-1" alt="Inside the studio" monogram={false} sizes="(max-width: 1024px) 50vw, 25vw" />
          </div>
          <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-card">
            <MediaImage seed="editorial-2" alt="Considered craftsmanship" monogram={false} sizes="(max-width: 1024px) 50vw, 25vw" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
