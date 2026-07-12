import { describe, expect, it, vi } from 'vitest';

vi.mock('@/config/site', () => ({
  siteConfig: { storeMode: 'single', featuredProductSlug: 'does-not-exist' },
}));

const { getFeaturedProduct, isSingleProduct, isCatalog } = await import('@/lib/store-mode');
const { products } = await import('@/lib/data/products');

describe('store-mode', () => {
  it('reflects the configured store mode', () => {
    expect(isSingleProduct).toBe(true);
    expect(isCatalog).toBe(false);
  });

  it('falls back to the first product when featuredProductSlug matches nothing', () => {
    expect(getFeaturedProduct()).toBe(products[0]);
  });
});
