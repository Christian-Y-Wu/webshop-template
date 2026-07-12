'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Heart, User, X } from 'lucide-react';
import { mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { Logo } from '@/components/ui/logo';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { useUI } from '@/components/providers/ui-provider';
import { useFocusTrap } from '@/lib/use-focus-trap';
import { cn } from '@/lib/utils';

export function MobileMenu() {
  const { overlay, closeOverlay } = useUI();
  const open = overlay === 'menu';
  const [expanded, setExpanded] = useState<string | null>(null);
  const trapRef = useFocusTrap<HTMLElement>(open, closeOverlay);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOverlay}
            className="fixed inset-0 z-[var(--z-overlay)] bg-ink/40 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 left-0 z-[var(--z-overlay)] flex w-[88%] max-w-sm flex-col bg-canvas lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            ref={trapRef}
            tabIndex={-1}
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <Logo />
              <button onClick={closeOverlay} className="btn-ghost -mr-2" aria-label="Close menu">
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="divide-y divide-line">
                {mainNav.map((item) => (
                  <li key={item.label} className="py-1">
                    {item.mega ? (
                      <>
                        <button
                          onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}
                          className="flex w-full items-center justify-between py-3 text-lg font-medium text-ink"
                          aria-expanded={expanded === item.label}
                        >
                          {item.label}
                          <ChevronDown
                            size={20}
                            className={cn('text-ink-muted transition-transform', expanded === item.label && 'rotate-180')}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {expanded === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 pb-4 pt-1">
                                {item.mega.columns.flatMap((c) => c.links).map((link) => (
                                  <Link
                                    key={link.label + link.href}
                                    href={link.href}
                                    onClick={closeOverlay}
                                    className="py-1.5 text-sm text-ink-soft"
                                  >
                                    {link.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeOverlay}
                        className="block py-3 text-lg font-medium text-ink"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-1 border-t border-line pt-6">
                <Link href="/account" onClick={closeOverlay} className="flex items-center gap-3 py-2.5 text-ink-soft">
                  <User size={18} /> Account
                </Link>
                {siteConfig.features.wishlist && (
                  <Link href="/account/wishlist" onClick={closeOverlay} className="flex items-center gap-3 py-2.5 text-ink-soft">
                    <Heart size={18} /> Wishlist
                  </Link>
                )}
              </div>
            </nav>

            <div className="flex items-center justify-between border-t border-line px-5 py-4">
              <LocaleSwitcher align="left" />
              <a href={`mailto:${siteConfig.email}`} className="text-sm text-ink-muted">
                {siteConfig.email}
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
