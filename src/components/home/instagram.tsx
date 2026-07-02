import { Instagram as InstagramIcon } from 'lucide-react';
import { MediaImage } from '@/components/ui/media-image';
import { SectionHeader } from '@/components/ui/section-header';
import { siteConfig } from '@/config/site';

export function InstagramGallery() {
  const posts = Array.from({ length: 6 }, (_, i) => ({ seed: `ig-${i}`, likes: 120 + i * 37 }));

  return (
    <section className="container-page mt-20 lg:mt-28">
      <SectionHeader
        eyebrow="@aura.studio"
        title="Join the community"
        description="Tag #MyAURA to be featured. Real pieces, styled by real people."
        cta={{ label: 'Follow us', href: siteConfig.social.instagram }}
      />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {posts.map((p) => (
          <a
            key={p.seed}
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden rounded-2xl"
          >
            <MediaImage seed={p.seed} alt="Instagram post" monogram={false} sizes="(max-width: 640px) 50vw, 16vw" />
            <div className="absolute inset-0 grid place-items-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/40 group-hover:opacity-100">
              <InstagramIcon size={24} className="text-white" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
