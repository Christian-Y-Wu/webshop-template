import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/data/blog';
import { buildMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { MediaImage } from '@/components/ui/media-image';
import { Reveal } from '@/components/ui/reveal';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'The Journal',
  description: 'Stories, style guides and inspiration from the AURA studio.',
  path: '/blog',
});

export default function BlogIndexPage() {
  const [featured, ...rest] = blogPosts;
  const categories = Array.from(new Set(blogPosts.map((p) => p.category)));

  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Journal', href: '/blog' }]} className="mb-6" />
      <header className="max-w-2xl">
        <p className="eyebrow mb-3">The Journal</p>
        <h1 className="text-display">Stories & inspiration</h1>
        <p className="mt-4 text-ink-soft">
          Guides, behind-the-scenes and considered living — from our studio to your inbox.
        </p>
      </header>

      {/* Category chips */}
      <div className="mt-8 flex flex-wrap gap-2">
        <span className="rounded-pill bg-ink px-4 py-2 text-sm font-medium text-canvas">All</span>
        {categories.map((c) => (
          <span key={c} className="rounded-pill border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink">
            {c}
          </span>
        ))}
      </div>

      {/* Featured */}
      <Reveal className="mt-10">
        <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-card border border-line bg-surface lg:grid-cols-2">
          <div className="relative min-h-[280px] lg:min-h-[420px]">
            <MediaImage seed={featured.seed} alt={featured.title} monogram={false} priority sizes="(max-width: 1024px) 100vw, 50vw" />
            <span className="absolute left-4 top-4 badge bg-canvas/90 text-ink">Featured</span>
          </div>
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <p className="text-xs text-ink-muted">
              {featured.category} · {formatDate(featured.date)} · {featured.readingTime}
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-ink transition-colors group-hover:text-accent lg:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-4 text-ink-soft">{featured.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
              Read article <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </Reveal>

      {/* Grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {rest.map((post, i) => (
          <Reveal key={post.slug} delay={i * 60}>
            <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
              <div className="relative aspect-[3/2] overflow-hidden rounded-card">
                <MediaImage seed={post.seed} alt={post.title} monogram={false} sizes="(max-width: 768px) 100vw, 33vw" />
                <span className="absolute left-3 top-3 badge bg-canvas/90 text-ink">{post.category}</span>
              </div>
              <div className="flex flex-1 flex-col pt-4">
                <p className="text-xs text-ink-muted">{formatDate(post.date)} · {post.readingTime}</p>
                <h3 className="mt-2 font-serif text-xl leading-snug text-ink transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-ink-soft line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
