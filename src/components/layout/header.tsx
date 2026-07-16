'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { Logo } from '@/components/ui/logo';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { MegaMenu } from '@/components/layout/mega-menu';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useStore } from '@/components/providers/store-provider';
import { useUI } from '@/components/providers/ui-provider';
import { cn } from '@/lib/utils';

export function Header() {
  const { cartCount, wishlist, hydrated } = useStore();
  const { openOverlay } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [activeMega, setActiveMega] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeItem = activeMega !== null ? mainNav[activeMega] : null;

  return (
    <header
      className={cn(
        'sticky top-0 z-[var(--z-sticky)] border-b bg-canvas/90 backdrop-blur-md transition-shadow duration-300',
        scrolled ? 'border-line shadow-soft' : 'border-transparent',
      )}
      onMouseLeave={() => setActiveMega(null)}
    >
      <div className="container-page">
        <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 lg:h-[70px] lg:grid-cols-3">
          {/* Left — nav / mobile menu */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => openOverlay('menu')}
              className="btn-ghost -ml-2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {mainNav.map((item, i) => (
                <div key={item.label} onMouseEnter={() => setActiveMega(item.mega ? i : null)}>
                  <Link
                    href={item.href}
                    className={cn(
                      'relative rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink',
                      activeMega === i && item.mega && 'text-ink',
                    )}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Center — logo */}
          <div className="flex justify-center">
            <Logo />
          </div>

          {/* Right — utilities */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <div className="hidden md:block">
              <LocaleSwitcher />
            </div>
            <ThemeToggle />
            <button
              onClick={() => openOverlay('search')}
              className="btn-ghost px-2.5"
              aria-label={siteConfig.name + ' search'}
            >
              <Search size={20} />
            </button>
            <Link href="/account" className="btn-ghost hidden px-2.5 sm:inline-flex" aria-label="Account">
              <User size={20} />
            </Link>
            {siteConfig.features.wishlist && (
              <Link href="/account/wishlist" className="btn-ghost relative hidden px-2.5 sm:inline-flex" aria-label="Wishlist">
                <Heart size={20} />
                {hydrated && wishlist.length > 0 && (
                  <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-ink">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => openOverlay('cart')}
              className="btn-ghost relative px-2.5"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingBag size={20} />
              {hydrated && cartCount > 0 && (
                <span className="absolute right-0.5 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-ink">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mega menu panel */}
      <AnimatePresence>
        {activeItem?.mega && (
          <MegaMenu
            key={activeItem.label}
            mega={activeItem.mega}
            onClose={() => setActiveMega(null)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
