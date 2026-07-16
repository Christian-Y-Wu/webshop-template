import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { MediaImage } from '@/components/ui/media-image';
import { Reveal } from '@/components/ui/reveal';

/* ==========================================================================
   STORY — the optional founder-story + history section.

   Toggled with homeSections.story; every word comes from siteConfig.story
   (Admin Studio → Homepage → Founder story). It renders a founder portrait
   with a pull quote, the origin story, and a milestone timeline — the
   "about page energy" many small brands want on the homepage itself.
   ========================================================================== */

export function Story() {
  const story = siteConfig.story;
  const paragraphs = story.text.split(/\n\s*\n/).filter(Boolean);

  return (
    <section id="story" className="container-page mt-20 scroll-mt-24 lg:mt-28">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Founder portrait + quote */}
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[26px]">
            <MediaImage seed="story-founder" alt={`${story.founderName}, ${story.founderRole}`} monogram={false} sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
            <blockquote className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
              <p className="font-serif text-xl leading-snug sm:text-2xl">“{story.quote}”</p>
              <footer className="mt-4 text-sm text-white/80">
                <strong className="font-medium text-white">{story.founderName}</strong> · {story.founderRole}
              </footer>
            </blockquote>
          </div>
        </Reveal>

        {/* The story */}
        <Reveal>
          <p className="eyebrow mb-4">{story.eyebrow}</p>
          <h2 className="text-headline text-balance">{story.title}</h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="mt-5 text-ink-soft text-pretty">
              {p}
            </p>
          ))}
          <Link href="/pages/about" className="link-underline mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
            Read the full story
            <ArrowRight size={15} />
          </Link>
        </Reveal>
      </div>

      {/* Milestone timeline */}
      {story.milestones.length > 0 && (
        <Reveal className="mt-14 border-t border-line pt-10 lg:mt-16">
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {story.milestones.map((m) => (
              <li key={`${m.year}-${m.title}`} className="relative pl-5">
                <span aria-hidden className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-accent" />
                <p className="font-serif text-2xl text-ink">{m.year}</p>
                <p className="mt-1 text-sm font-medium text-ink">{m.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{m.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      )}
    </section>
  );
}
