import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { contentPages, contentPageMap } from '@/lib/data/pages';
import { buildMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { MediaImage } from '@/components/ui/media-image';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  return contentPages.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = contentPageMap.get(params.slug);
  if (!page) return buildMetadata({ title: 'Page not found' });
  return buildMetadata({ title: page.title, description: page.intro, path: `/pages/${page.slug}` });
}

export default function ContentPageView({ params }: { params: { slug: string } }) {
  const page = contentPageMap.get(params.slug);
  if (!page) notFound();

  const isEditorial = page.layout === 'editorial';

  return (
    <div className="container-page pt-6">
      <Breadcrumbs
        items={[{ name: 'Home', href: '/' }, { name: page.title, href: `/pages/${page.slug}` }]}
        className="mb-6"
      />

      {/* Header */}
      <header className={cn('mx-auto', isEditorial ? 'max-w-3xl text-center' : 'max-w-prose')}>
        {page.eyebrow && <p className="eyebrow mb-3">{page.eyebrow}</p>}
        <h1 className="text-display">{page.title}</h1>
        <p className={cn('mt-5 text-lg text-ink-soft text-pretty', isEditorial && 'mx-auto max-w-2xl')}>
          {page.intro}
        </p>
        {page.updated && <p className="mt-3 text-xs text-ink-muted">Last updated {page.updated}</p>}
      </header>

      {isEditorial && page.seed && (
        <div className="relative mx-auto mt-10 aspect-[16/8] max-w-5xl overflow-hidden rounded-card">
          <MediaImage seed={page.seed} alt={page.title} monogram={false} priority sizes="100vw" />
        </div>
      )}

      {/* Body */}
      <div className="mx-auto mt-12 max-w-prose space-y-10 pb-8">
        {page.sections.map((section, i) => (
          <section key={i}>
            {section.heading && <h2 className="font-serif text-2xl">{section.heading}</h2>}
            <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-ink-soft">
              {section.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
            {section.bullets && (
              <ul className="mt-4 space-y-2.5">
                {section.bullets.map((b, k) => (
                  <li key={k} className="flex gap-3 text-[16px] text-ink-soft">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
