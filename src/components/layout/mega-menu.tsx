'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { NavItem } from '@/config/navigation';
import { MediaImage } from '@/components/ui/media-image';

export function MegaMenu({
  mega,
  onClose,
}: {
  mega: NonNullable<NavItem['mega']>;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 top-full hidden border-b border-line bg-canvas/98 shadow-lift backdrop-blur-md lg:block"
    >
      <div className="container-page grid grid-cols-12 gap-8 py-9">
        <div className="col-span-8 grid grid-cols-4 gap-8">
          {mega.columns.map((col) => (
            <div key={col.heading}>
              <p className="eyebrow mb-4">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="group inline-flex items-center gap-2 text-[15px] text-ink-soft transition-colors hover:text-ink"
                    >
                      <span className="link-underline">{link.label}</span>
                      {link.badge && (
                        <span className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {mega.feature && (
          <Link
            href={mega.feature.href}
            onClick={onClose}
            className="group relative col-span-4 flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-card p-6 text-white"
          >
            <MediaImage seed={mega.feature.seed} alt={mega.feature.title} monogram={false} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/65" />
            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-eyebrow text-white/80">
                {mega.feature.eyebrow}
              </p>
              <h3 className="mt-1.5 max-w-[16ch] font-serif text-2xl leading-tight text-white">
                {mega.feature.title}
              </h3>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                {mega.feature.cta}
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
