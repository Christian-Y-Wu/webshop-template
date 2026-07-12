'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Gift, MessageCircle, ShoppingBag, X } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { MediaImage } from '@/components/ui/media-image';
import { useUI } from '@/components/providers/ui-provider';
import { cn } from '@/lib/utils';

const NEWSLETTER_COOLDOWN_KEY = 'aura:nl-dismissed-until';
const NEWSLETTER_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function startNewsletterCooldown() {
  localStorage.setItem(NEWSLETTER_COOLDOWN_KEY, String(Date.now() + NEWSLETTER_COOLDOWN_MS));
}

/* ---- Newsletter / welcome-discount popup --------------------------------- */
export function NewsletterPopup() {
  const { overlay, quickView, newsletterOpen, setNewsletterOpen } = useUI();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  // Read live inside the retry closure below, so the popup doesn't need to
  // restart its 6s timer (and forget it already waited) every time some
  // other overlay opens and closes.
  const blockedRef = useRef(false);
  blockedRef.current = overlay !== null || quickView !== null;

  useEffect(() => {
    if (!siteConfig.features.newsletterPopup) return;
    const dismissedUntil = Number(localStorage.getItem(NEWSLETTER_COOLDOWN_KEY) ?? '0');
    if (Date.now() < dismissedUntil) return;

    let cancelled = false;
    const tryOpen = () => {
      if (cancelled) return;
      // Never pop up on top of the cart drawer, mobile menu, search overlay
      // or quick view — wait for it to close instead of covering it.
      if (blockedRef.current) {
        setTimeout(tryOpen, 1000);
        return;
      }
      setNewsletterOpen(true);
    };
    const t = setTimeout(tryOpen, 6000);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismiss() {
    setNewsletterOpen(false);
    startNewsletterCooldown();
  }

  return (
    <AnimatePresence>
      {newsletterOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 z-[var(--z-modal)] bg-ink/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[var(--z-modal)] grid place-items-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-3xl bg-canvas shadow-pop sm:grid-cols-2"
            >
              <button onClick={dismiss} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-surface/80 text-ink backdrop-blur hover:bg-surface" aria-label="Close">
                <X size={18} />
              </button>
              <div className="relative hidden min-h-[260px] sm:block">
                <MediaImage seed="newsletter-popup" alt="Welcome offer" monogram={false} />
              </div>
              <div className="p-8">
                <span className="badge bg-accent-soft text-accent">Welcome offer</span>
                <h2 className="mt-4 font-serif text-3xl leading-tight">Enjoy 10% off your first order</h2>
                <p className="mt-2 text-sm text-ink-soft">
                  Join our list for early access to new arrivals, private sales and stories from the studio.
                </p>
                {done ? (
                  <p className="mt-6 flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
                    <Check size={16} /> Your code <strong>WELCOME10</strong> is on its way!
                  </p>
                ) : (
                  <form
                    className="mt-6 space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (email.trim()) {
                        setDone(true);
                        startNewsletterCooldown();
                      }
                    }}
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="input"
                    />
                    <button type="submit" className="btn-accent w-full">
                      Reveal my code
                    </button>
                    <button type="button" onClick={dismiss} className="w-full text-center text-xs text-ink-muted hover:text-ink">
                      No thanks, I’ll pay full price
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---- Recently-purchased social-proof toast ------------------------------- */
const PURCHASES = [
  { name: 'Emma', place: 'London', product: 'Aria Merino Sweater', seed: 'aria-1' },
  { name: 'Liam', place: 'New York', product: 'Orbit Leather Tote', seed: 'orbit-1' },
  { name: 'Sofia', place: 'Milan', product: 'Solstice Slip Dress', seed: 'solstice-1' },
  { name: 'Noah', place: 'Berlin', product: 'Lumen Soy Candle', seed: 'lumen-1' },
  { name: 'Ava', place: 'Sydney', product: 'Terra Stoneware Vase', seed: 'terra-1' },
];

const RECENTLY_PURCHASED_SESSION_KEY = 'aura:recently-purchased-shown';
const RECENTLY_PURCHASED_MAX_PER_SESSION = 4;

export function RecentlyPurchasedPopup() {
  const { overlay, quickView, newsletterOpen, stickyBarVisible } = useUI();
  const [index, setIndex] = useState<number | null>(null);

  // Read live inside the interval closure so the 22s cadence never resets,
  // instead of restarting the effect (and the timers) on every UI change.
  const suppressedRef = useRef(false);
  suppressedRef.current = overlay !== null || quickView !== null || newsletterOpen;

  useEffect(() => {
    if (!siteConfig.features.recentlyPurchasedPopup) return;

    let shown = Number(sessionStorage.getItem(RECENTLY_PURCHASED_SESSION_KEY) ?? '0');
    if (shown >= RECENTLY_PURCHASED_MAX_PER_SESSION) return;

    let i = 0;
    let hideTimer: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    const show = () => {
      // Skip this tick (don't consume a "shown" credit) if a modal or the
      // newsletter popup currently owns the screen — try again next tick.
      if (suppressedRef.current) return;
      if (shown >= RECENTLY_PURCHASED_MAX_PER_SESSION) {
        clearInterval(interval);
        return;
      }
      shown += 1;
      sessionStorage.setItem(RECENTLY_PURCHASED_SESSION_KEY, String(shown));
      setIndex(i % PURCHASES.length);
      hideTimer = setTimeout(() => setIndex(null), 5000);
      i++;
      if (shown >= RECENTLY_PURCHASED_MAX_PER_SESSION) clearInterval(interval);
    };

    const first = setTimeout(show, 12000);
    interval = setInterval(show, 22000);
    return () => {
      clearTimeout(first);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, []);

  const p = index !== null ? PURCHASES[index] : null;

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: -12 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'fixed left-4 z-[var(--z-popover)] hidden w-[300px] items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-lift sm:flex',
            stickyBarVisible ? 'bottom-20' : 'bottom-4',
          )}
        >
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
            <MediaImage seed={p.seed} alt="" monogram={false} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink">
              <strong className="font-medium">{p.name}</strong> in {p.place}
            </p>
            <p className="truncate text-xs text-ink-muted">purchased {p.product}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-success">
              <ShoppingBag size={11} /> Verified · just now
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---- Live chat launcher (placeholder) ------------------------------------ */
export function LiveChatButton() {
  const { stickyBarVisible } = useUI();
  const [open, setOpen] = useState(false);
  if (!siteConfig.features.liveChat) return null;

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'fixed right-4 z-[var(--z-popover)] grid h-14 w-14 place-items-center rounded-full bg-ink text-canvas shadow-lift transition-transform hover:scale-105',
          stickyBarVisible ? 'bottom-20' : 'bottom-4',
        )}
        aria-label="Open chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'fixed right-4 z-[var(--z-popover)] w-[min(90vw,340px)] overflow-hidden rounded-3xl border border-line bg-surface shadow-pop',
              stickyBarVisible ? 'bottom-36' : 'bottom-20',
            )}
          >
            <div className="flex items-center gap-3 bg-ink p-4 text-canvas">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-ink">
                <Gift size={17} />
              </span>
              <div>
                <p className="text-sm font-medium">{siteConfig.name} Concierge</p>
                <p className="text-xs text-canvas/60">Typically replies in a few minutes</p>
              </div>
            </div>
            <div className="space-y-3 p-4">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-surface-muted px-3.5 py-2.5 text-sm text-ink-soft">
                Hi there 👋 Welcome to {siteConfig.name}. How can we help you today?
              </div>
              <div className="flex flex-wrap gap-2">
                {['Track my order', 'Sizing help', 'Returns'].map((s) => (
                  <button key={s} className="rounded-pill border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-ink hover:text-ink">
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-line p-3">
              <input placeholder="Type a message…" className="input py-2.5 text-sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
