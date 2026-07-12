'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Play, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { MediaImage } from '@/components/ui/media-image';
import { Badge } from '@/components/ui/badge';
import { useFocusTrap } from '@/lib/use-focus-trap';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const images = product.images;
  const total = images.length;

  // Main stage carousel — also drives the thumbnail rail and dot-thumbnails.
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  // Separate instance for the lightbox (only mounted while open).
  const [lightboxRef, lightboxApi] = useEmblaCarousel({ loop: false });
  const closeLightbox = useCallback(() => setLightbox(false), []);
  const lightboxTrapRef = useFocusTrap<HTMLDivElement>(lightbox, closeLightbox);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActive(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Keep the lightbox showing whichever image was active when it opened,
  // and fold its own swiping back into the shared `active` index on close.
  useEffect(() => {
    if (!lightboxApi) return;
    if (lightbox) lightboxApi.scrollTo(active, true);
    const onSelect = () => setActive(lightboxApi.selectedScrollSnap());
    lightboxApi.on('select', onSelect);
    return () => {
      lightboxApi.off('select', onSelect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxApi, lightbox]);

  const go = (dir: number) => (dir < 0 ? emblaApi?.scrollPrev() : emblaApi?.scrollNext());
  const goTo = (i: number) => emblaApi?.scrollTo(i);
  const lightboxGo = (dir: number) => (dir < 0 ? lightboxApi?.scrollPrev() : lightboxApi?.scrollNext());

  function onMove(e: React.MouseEvent) {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setZoom({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  }

  return (
    <div className="lg:sticky lg:top-24">
      <div className="flex gap-3">
        {/* Thumbnails (desktop, vertical) */}
        <div className="hidden w-20 shrink-0 flex-col gap-3 lg:flex">
          {images.map((img, i) => (
            <button
              key={img.seed}
              onClick={() => goTo(i)}
              className={cn(
                'relative aspect-[4/5] overflow-hidden rounded-xl ring-1 ring-inset transition-all',
                active === i ? 'ring-2 ring-ink' : 'ring-line hover:ring-ink/40',
              )}
              aria-label={`View image ${i + 1}`}
            >
              <MediaImage seed={img.seed} src={img.src} alt={img.alt} monogram={false} sizes="80px" />
              {product.hasVideo && i === total - 1 && (
                <span className="absolute inset-0 grid place-items-center bg-ink/20">
                  <Play size={16} className="fill-white text-white" />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Stage */}
        <div className="relative flex-1">
          <div
            ref={stageRef}
            className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-card bg-surface-muted"
            onMouseMove={onMove}
            onMouseLeave={() => setZoom(null)}
            onClick={() => setLightbox(true)}
          >
            {/* Swipeable track — works with touch/pinch on mobile */}
            <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
              <div className="flex h-full">
                {images.map((img) => (
                  <div key={img.seed} className="relative h-full min-w-0 flex-[0_0_100%]">
                    <MediaImage
                      seed={img.seed}
                      src={img.src}
                      alt={img.alt}
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop hover-zoom overlay of the active image only */}
            {zoom && (
              <div
                className="pointer-events-none absolute inset-0 transition-transform duration-200"
                style={{ transform: 'scale(1.6)', transformOrigin: `${zoom.x}% ${zoom.y}%` }}
              >
                <MediaImage seed={images[active].seed} src={images[active].src} alt="" priority sizes="45vw" />
              </div>
            )}

            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.badges?.map((b) => (
                <Badge key={b.label} tone={b.tone}>
                  {b.label}
                </Badge>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(true);
              }}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-surface/80 text-ink opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
              aria-label="Expand image"
            >
              <Expand size={16} />
            </button>

            {/* Arrows */}
            {total > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-surface/80 text-ink opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 lg:flex"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-surface/80 text-ink opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 lg:flex"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Dots + thumbs (mobile) */}
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar lg:hidden">
            {images.map((img, i) => (
              <button
                key={img.seed}
                onClick={() => goTo(i)}
                className={cn(
                  'relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-inset',
                  active === i ? 'ring-2 ring-ink' : 'ring-line',
                )}
                aria-label={`View image ${i + 1}`}
              >
                <MediaImage seed={img.seed} src={img.src} alt={img.alt} monogram={false} sizes="64px" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[var(--z-lightbox)] grid place-items-center bg-ink/90 p-4"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.title} — image gallery`}
            ref={lightboxTrapRef}
            tabIndex={-1}
          >
            <button onClick={closeLightbox} className="absolute right-5 top-5 text-white/80 hover:text-white" aria-label="Close">
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              className="relative aspect-[4/5] w-full max-w-lg overflow-hidden rounded-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div ref={lightboxRef} className="absolute inset-0 overflow-hidden">
                <div className="flex h-full">
                  {images.map((img) => (
                    <div key={img.seed} className="relative h-full min-w-0 flex-[0_0_100%]">
                      <MediaImage seed={img.seed} src={img.src} alt={img.alt} />
                    </div>
                  ))}
                </div>
              </div>
              {total > 1 && (
                <>
                  <button onClick={() => lightboxGo(-1)} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink" aria-label="Previous">
                    <ChevronLeft size={22} />
                  </button>
                  <button onClick={() => lightboxGo(1)} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink" aria-label="Next">
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
