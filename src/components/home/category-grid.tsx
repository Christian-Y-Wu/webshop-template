import Link from 'next/link';
import { categoryGrid } from '@/lib/data/collections';
import { MediaImage } from '@/components/ui/media-image';
import { SectionHeader } from '@/components/ui/section-header';
import { Reveal } from '@/components/ui/reveal';

export function CategoryGrid() {
  return (
    <section className="container-page mt-20 lg:mt-28">
      <SectionHeader
        eyebrow="Shop by category"
        title="Find your thing"
        cta={{ label: 'Browse all', href: '/collections' }}
      />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
        {categoryGrid.map((c, i) => (
          <Reveal key={c.handle} delay={i * 40}>
            <Link href={`/collections/${c.handle}`} className="group block text-center">
              <div className="relative mx-auto aspect-square overflow-hidden rounded-full">
                <MediaImage seed={c.seed} alt={c.title} monogram={false} sizes="(max-width: 640px) 40vw, 15vw" />
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/5 transition-all duration-500 group-hover:ring-2 group-hover:ring-ink/20" />
              </div>
              <p className="mt-3 text-sm font-medium text-ink transition-colors group-hover:text-accent">
                {c.title}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
