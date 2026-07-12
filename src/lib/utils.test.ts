import { describe, expect, it } from 'vitest';
import { discountPercent, formatMoney, slugify } from '@/lib/utils';

describe('formatMoney', () => {
  it('formats a whole-number USD amount with no decimals', () => {
    expect(formatMoney(128, { code: 'USD', rate: 1, locale: 'en-US' })).toBe('$128');
  });

  it('applies the currency rate before formatting', () => {
    expect(formatMoney(100, { code: 'EUR', rate: 0.92, locale: 'de-DE' })).toContain('92');
  });

  it('falls back to a plain string if Intl throws on a bad currency code', () => {
    expect(formatMoney(10, { code: 'NOPE', rate: 1 })).toBe('NOPE 10.00');
  });
});

describe('discountPercent', () => {
  it('returns 0 when there is no compare-at price', () => {
    expect(discountPercent(100)).toBe(0);
  });

  it('returns 0 when compare-at is not actually higher', () => {
    expect(discountPercent(100, 90)).toBe(0);
  });

  it('rounds the percentage off', () => {
    expect(discountPercent(75, 100)).toBe(25);
  });
});

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Aria Merino Sweater')).toBe('aria-merino-sweater');
  });

  it('strips non-alphanumeric characters and trims stray hyphens', () => {
    expect(slugify("  Founder's Blend! ")).toBe('founder-s-blend');
  });
});
