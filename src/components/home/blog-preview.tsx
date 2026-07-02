import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/data/blog';
import { MediaImage } from '@/components/ui/media-image';
import { SectionHeader } from '@/components/ui/section-header';
import { Reveal } from '@/components/ui/reveal';
import { formatDate } from '@/lib/utils';

export function BlogPreview() {
  const posts = blogPosts.slice(0, 3);
  return (
    <section className="container-page mt-20 lg:mt-28">
      <SectionHeader
        eyebrow="The Journal"
        title="Stories, guides & inspiration"
        cta={{ label: 'Read the journal', href: '/blog' }}
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 80}>
            <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
              <div className="relative aspect-[3/2] overflow-hidden rounded-card">
                <MediaImage seed={post.seed} alt={post.title} monogram={false} sizes="(max-width: 768px) 100vw, 33vw" />
                <span className="absolute left-3 top-3 badge bg-canvas/90 text-ink">{post.category}</span>
              </div>
              <div className="flex flex-1 flex-col pt-4">
                <p className="text-xs text-ink-muted">
                  {formatDate(post.date)} · {post.readingTime}
                </p>
                <h3 className="mt-2 font-serif text-xl leading-snug text-ink transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft line-clamp-2">{post.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                  Read more
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
