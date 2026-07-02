import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an amount (stored in the shop's base currency) into a localized
 * string. Conversion + currency come from the active store currency.
 */
export function formatMoney(
  amount: number,
  currency: { code: string; rate: number; locale?: string } = { code: 'USD', rate: 1 },
) {
  const converted = amount * currency.rate;
  try {
    return new Intl.NumberFormat(currency.locale ?? 'en-US', {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: converted % 1 === 0 ? 0 : 2,
    }).format(converted);
  } catch {
    return `${currency.code} ${converted.toFixed(2)}`;
  }
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Deterministic pseudo-random in [0,1) from a string seed (stable SSR/CSR). */
export function seededRandom(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatDate(iso: string, locale = 'en-US') {
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** e.g. 1999 -> "1,999". Compact reviews / counts. */
export function compactNumber(n: number, locale = 'en-US') {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
