'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Heart, X } from 'lucide-react';
import { useUI } from '@/components/providers/ui-provider';
import { MediaImage } from '@/components/ui/media-image';

export function Toaster() {
  const { toasts, dismissToast } = useUI();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[var(--z-toast)] flex w-[min(92vw,360px)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-lift"
          >
            {t.image ? (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <MediaImage seed={t.image} alt="" monogram={false} />
              </div>
            ) : (
              <span
                className={
                  'grid h-9 w-9 shrink-0 place-items-center rounded-full ' +
                  (t.variant === 'wishlist' ? 'bg-accent-soft text-accent' : 'bg-success/12 text-success')
                }
              >
                {t.variant === 'wishlist' ? <Heart size={16} className="fill-current" /> : <Check size={16} />}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{t.title}</p>
              {t.description && <p className="truncate text-xs text-ink-muted">{t.description}</p>}
              {t.href && (
                <Link
                  href={t.href}
                  onClick={() => dismissToast(t.id)}
                  className="mt-0.5 inline-block text-xs font-medium text-accent link-underline"
                >
                  {t.hrefLabel ?? 'View'}
                </Link>
              )}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="shrink-0 rounded-full p-1 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
