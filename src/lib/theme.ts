/* ==========================================================================
   THEME HELPERS — derive the accent trio + no-flash colour-mode script.

   The storefront theme is CSS custom properties (globals.css). When the
   store picks a custom accent in the Admin Studio, we derive the soft tint
   and readable ink shade here and inject them as an inline <style> in the
   root layout, so one hex value restyles the whole site — light AND dark.
   ========================================================================== */

import { siteConfig } from '@/config/site';

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

const triple = (r: number, g: number, b: number) => `${r} ${g} ${b}`;

/** Mix a colour toward a target (0 = target, 1 = original). */
function mix(c: { r: number; g: number; b: number }, target: { r: number; g: number; b: number }, amount: number) {
  const ch = (a: number, b: number) => Math.round(a * amount + b * (1 - amount));
  return triple(ch(c.r, target.r), ch(c.g, target.g), ch(c.b, target.b));
}

function luminance({ r, g, b }: { r: number; g: number; b: number }) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const WHITE = { r: 255, g: 255, b: 255 };
const DARK_SURFACE = { r: 30, g: 32, b: 38 };

/** Everything needed to restyle both modes from a single hex accent. */
export function deriveAccent(hex: string) {
  const rgb = hexToRgb(hex);
  return {
    accent: triple(rgb.r, rgb.g, rgb.b),
    /** Pale tint for light mode chips/badges. */
    soft: mix(rgb, WHITE, 0.14),
    /** Dark-mode tint: same idea, mixed toward the dark surface. */
    softDark: mix(rgb, DARK_SURFACE, 0.22),
    /** Text colour that stays readable on the accent. */
    ink: luminance(rgb) < 140 ? '255 255 255' : '26 24 22',
  };
}

/** Inline CSS applied when the store configures a custom accent colour. */
export function accentStyle(): string | null {
  if (!siteConfig.accentColor) return null;
  const a = deriveAccent(siteConfig.accentColor);
  return [
    `:root{--color-accent:${a.accent};--color-accent-soft:${a.soft};--color-accent-ink:${a.ink};}`,
    `[data-mode='dark']{--color-accent-soft:${a.softDark};}`,
  ].join('\n');
}

/**
 * No-flash colour-mode bootstrap. Runs synchronously before first paint:
 * reads the visitor's saved choice (localStorage), falls back to the store
 * default (or the OS preference when that default is 'system') and stamps
 * `data-mode` on <html>. Kept dependency-free and tiny on purpose.
 */
export function colorModeScript(): string {
  const def = siteConfig.colorMode.default;
  return `(function(){try{var m=localStorage.getItem('aura:mode');if(m!=='light'&&m!=='dark'){m=${
    def === 'system'
      ? "window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'"
      : `'${def}'`
  };}var d=document.documentElement;d.dataset.mode=m;d.style.colorScheme=m;}catch(e){}})();`;
}
