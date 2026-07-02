'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Play, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { MediaImage } from '@/components/ui/media-image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const images = product.images;
  const total = images.length;
  const go = (dir: number) => setActive((a) => (a + dir + total) % total);

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
              onClick={() => setActive(i)}
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
            <div
              className="absolute inset-0 transition-transform duration-200"
              style={zoom ? { transform: 'scale(1.6)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            >
              <MediaImage
                seed={images[active].seed}
                src={images[active].src}
                alt={images[active].alt}
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>

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
                onClick={() => setActive(i)}
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
            className="fixed inset-0 z-[80] grid place-items-center bg-ink/90 p-4"
            onClick={() => setLightbox(false)}
          >
            <button className="absolute right-5 top-5 text-white/80 hover:text-white" aria-label="Close">
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              className="relative aspect-[4/5] w-full max-w-lg overflow-hidden rounded-card"
              onClick={(e) => e.stopPropagation()}
            >
              <MediaImage seed={images[active].seed} src={images[active].src} alt={images[active].alt} />
              {total > 1 && (
                <>
                  <button onClick={() => go(-1)} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink" aria-label="Previous">
                    <ChevronLeft size={22} />
                  </button>
                  <button onClick={() => go(1)} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink" aria-label="Next">
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
