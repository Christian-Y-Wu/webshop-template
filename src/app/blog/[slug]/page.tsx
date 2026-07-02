import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Facebook, Link2, Twitter } from 'lucide-react';
import { blogPosts, getBlogPost } from '@/lib/data/blog';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { MediaImage } from '@/components/ui/media-image';
import { NewsletterBand } from '@/components/home/newsletter-band';
import { formatDate } from '@/lib/utils';

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return buildMetadata({ title: 'Article not found' });
  return buildMetadata({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}` });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Journal', href: '/blog' },
    { name: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <article className="container-page pt-6">
        <Breadcrumbs items={crumbs} className="mb-6" />

        <header className="mx-auto max-w-prose text-center">
          <p className="eyebrow">{post.category}</p>
          <h1 className="mt-4 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-tight text-balance">{post.title}</h1>
          <p className="mt-4 text-sm text-ink-muted">
            By {post.author} · {formatDate(post.date)} · {post.readingTime}
          </p>
        </header>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-card">
          <MediaImage seed={post.seed} alt={post.title} monogram={false} priority sizes="100vw" />
        </div>

        <div className="mx-auto mt-12 max-w-prose">
          <p className="font-serif text-xl leading-relaxed text-ink">{post.excerpt}</p>
          <div className="mt-6 space-y-6 text-[17px] leading-relaxed text-ink-soft">
            {post.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Share */}
          <div className="mt-12 flex items-center gap-3 border-y border-line py-5">
            <span className="text-sm font-medium text-ink">Share this article</span>
            <div className="flex gap-2">
              {[Twitter, Facebook, Link2].map((Icon, i) => (
                <button key={i} className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink" aria-label="Share">
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          <Link href="/blog" className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink link-underline">
            <ArrowLeft size={15} /> Back to the Journal
          </Link>
        </div>
      </article>

      {/* Related */}
      <section className="container-page mt-16">
        <h2 className="font-serif text-2xl">Keep reading</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {related.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex h-full flex-col">
              <div className="relative aspect-[3/2] overflow-hidden rounded-card">
                <MediaImage seed={p.seed} alt={p.title} monogram={false} sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="pt-4">
                <p className="text-xs text-ink-muted">{p.category} · {p.readingTime}</p>
                <h3 className="mt-2 font-serif text-lg leading-snug text-ink transition-colors group-hover:text-accent">
                  {p.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <NewsletterBand />
    </>
  );
}
