import { describe, expect, it } from 'vitest';
import { applyDiscount, findDiscount } from '@/lib/discounts';

describe('findDiscount', () => {
  it('finds a configured code case-insensitively', () => {
    expect(findDiscount('welcome10')?.code).toBe('WELCOME10');
    expect(findDiscount('  WELCOME10  ')?.code).toBe('WELCOME10');
  });

  it('returns undefined for an unknown or empty code', () => {
    expect(findDiscount('not-a-real-code')).toBeUndefined();
    expect(findDiscount('')).toBeUndefined();
  });
});

describe('applyDiscount', () => {
  it('passes subtotal and shipping through unchanged when there is no discount', () => {
    const result = applyDiscount(100, 10, undefined);
    expect(result).toEqual({ subtotal: 100, shipping: 10, discountAmount: 0, total: 110 });
  });

  it('takes a percentage off the subtotal only, leaving shipping untouched', () => {
    const result = applyDiscount(100, 10, { code: 'X', description: '', kind: 'percent', value: 20 });
    expect(result.discountAmount).toBe(20);
    expect(result.shipping).toBe(10);
    expect(result.total).toBe(90);
  });

  it('zeroes shipping for a freeShipping discount and credits it as the discount amount', () => {
    const result = applyDiscount(100, 10, { code: 'X', description: '', kind: 'freeShipping' });
    expect(result.shipping).toBe(0);
    expect(result.discountAmount).toBe(10);
    expect(result.total).toBe(100);
  });

  it('never returns a negative total for a >100% edge case', () => {
    const result = applyDiscount(50, 0, { code: 'X', description: '', kind: 'percent', value: 150 });
    expect(result.total).toBe(0);
  });
});
