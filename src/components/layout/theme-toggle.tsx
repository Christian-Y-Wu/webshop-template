'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useStore } from '@/components/providers/store-provider';

/**
 * Light/dark mode toggle. The no-flash script in the root layout stamps
 * `data-mode` on <html> before first paint; this button just flips it and
 * persists the visitor's choice. Hidden when the store disables the toggle
 * or uses the inherently-dark 'midnight' preset.
 */
export function ThemeToggle() {
  const { t } = useStore();
  const [mode, setMode] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    setMode(document.documentElement.dataset.mode === 'dark' ? 'dark' : 'light');
  }, []);

  if (!siteConfig.colorMode.showToggle || siteConfig.theme === 'midnight') return null;

  const toggle = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    document.documentElement.dataset.mode = next;
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem('aura:mode', next);
    } catch {
      /* private browsing — the choice just won't persist */
    }
  };

  return (
    <button
      onClick={toggle}
      className="btn-ghost px-2.5"
      aria-label={mode === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
      title={mode === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
    >
      {/* Render nothing mode-specific until mounted so SSR and client agree */}
      {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
