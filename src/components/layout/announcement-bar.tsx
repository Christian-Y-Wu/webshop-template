'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Countdown } from '@/components/ui/countdown';

export function AnnouncementBar() {
  const items = siteConfig.announcements;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(id);
  }, [items.length]);

  const current = items[index];

  return (
    <div className="relative z-40 bg-ink text-canvas">
      <div className="container-page flex h-10 items-center justify-between gap-4 text-xs">
        {/* Left: countdown (desktop) */}
        <div className="hidden w-52 items-center gap-2 text-canvas/70 md:flex">
          <span className="tracking-wide">{siteConfig.countdownLabel}</span>
          <Countdown to={siteConfig.countdownTo} className="text-canvas" />
        </div>

        {/* Center: rotating message */}
        <div className="flex flex-1 items-center justify-center gap-2 overflow-hidden">
          {items.length > 1 && (
            <button
              onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
              aria-label="Previous announcement"
              className="hidden text-canvas/60 transition-colors hover:text-canvas sm:block"
            >
              <ChevronLeft size={15} />
            </button>
          )}
          <div className="relative h-4 min-w-0 flex-1 text-center sm:flex-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {current.href ? (
                  <Link href={current.href} className="truncate font-medium tracking-wide hover:underline">
                    {current.text}
                  </Link>
                ) : (
                  <span className="truncate font-medium tracking-wide">{current.text}</span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {items.length > 1 && (
            <button
              onClick={() => setIndex((i) => (i + 1) % items.length)}
              aria-label="Next announcement"
              className="hidden text-canvas/60 transition-colors hover:text-canvas sm:block"
            >
              <ChevronRight size={15} />
            </button>
          )}
        </div>

        {/* Right: quick links (desktop) */}
        <div className="hidden w-52 items-center justify-end gap-4 text-canvas/70 md:flex">
          <Link href="/pages/shipping" className="transition-colors hover:text-canvas">
            Shipping
          </Link>
          <Link href="/account" className="transition-colors hover:text-canvas">
            Track order
          </Link>
        </div>
      </div>
    </div>
  );
}
