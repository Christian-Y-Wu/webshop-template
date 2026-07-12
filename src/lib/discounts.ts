import { siteConfig, type DiscountCode } from '@/config/site';

/** Case-insensitive lookup against the configured discount codes. */
export function findDiscount(code: string): DiscountCode | undefined {
  const normalized = code.trim().toLowerCase();
  if (!normalized) return undefined;
  return siteConfig.discountCodes.find((d) => d.code.toLowerCase() === normalized);
}

export interface DiscountResult {
  subtotal: number;
  shipping: number;
  discountAmount: number;
  total: number;
}

/** Apply a resolved discount to a subtotal/shipping pair. */
export function applyDiscount(subtotal: number, shipping: number, discount?: DiscountCode): DiscountResult {
  if (!discount) {
    return { subtotal, shipping, discountAmount: 0, total: subtotal + shipping };
  }

  if (discount.kind === 'freeShipping') {
    return { subtotal, shipping: 0, discountAmount: shipping, total: subtotal };
  }

  const percentOff = subtotal * ((discount.value ?? 0) / 100);
  return {
    subtotal,
    shipping,
    discountAmount: percentOff,
    total: Math.max(0, subtotal - percentOff + shipping),
  };
}
