'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useStore } from '@/components/providers/store-provider';
import { cn } from '@/lib/utils';

/** Combined currency + language selector used in the header and footer. */
export function LocaleSwitcher({ align = 'right' }: { align?: 'left' | 'right' }) {
  const { currency, setCurrencyCode, locale, setLocale } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const activeLang = siteConfig.languages.find((l) => l.code === locale) ?? siteConfig.languages[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{activeLang.flag}</span>
        <span className="font-medium">{currency.code}</span>
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className={cn(
            'absolute top-full z-50 mt-3 w-64 origin-top rounded-2xl border border-line bg-surface p-4 shadow-lift',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          <p className="eyebrow mb-2">Currency</p>
          <div className="mb-4 grid grid-cols-2 gap-1">
            {siteConfig.currencies.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrencyCode(c.code)}
                className={cn(
                  'flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-surface-muted',
                  currency.code === c.code && 'bg-surface-muted font-medium',
                )}
              >
                <span className="flex items-center gap-1.5">
                  <span>{c.flag}</span>
                  {c.code}
                </span>
                {currency.code === c.code && <Check size={13} className="text-accent" />}
              </button>
            ))}
          </div>

          <p className="eyebrow mb-2">Language</p>
          <div className="grid grid-cols-1 gap-0.5">
            {siteConfig.languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code)}
                className={cn(
                  'flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-surface-muted',
                  locale === l.code && 'bg-surface-muted font-medium',
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{l.flag}</span>
                  {l.label}
                </span>
                {locale === l.code && <Check size={13} className="text-accent" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
