import { describe, expect, it, vi } from 'vitest';

vi.mock('@/config/site', () => ({
  siteConfig: { url: 'https://fallback.example.com' },
}));

const { normalizeUrl, resolveSiteUrl } = await import('@/lib/site-url');

describe('normalizeUrl', () => {
  it('adds https:// when a scheme is missing', () => {
    expect(normalizeUrl('shop.example.com')).toBe('https://shop.example.com');
  });

  it('preserves an existing scheme', () => {
    expect(normalizeUrl('http://localhost:3000')).toBe('http://localhost:3000');
  });

  it('strips trailing slashes and surrounding whitespace', () => {
    expect(normalizeUrl('  https://shop.example.com/  ')).toBe('https://shop.example.com');
  });
});

describe('resolveSiteUrl', () => {
  it('prefers NEXT_PUBLIC_SITE_URL above everything else', () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: 'https://custom-domain.com',
        VERCEL_PROJECT_PRODUCTION_URL: 'prod.vercel.app',
        VERCEL_URL: 'preview.vercel.app',
      }),
    ).toBe('https://custom-domain.com');
  });

  it("falls back to Vercel's production domain, adding the scheme", () => {
    expect(
      resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'prod.vercel.app', VERCEL_URL: 'preview.vercel.app' }),
    ).toBe('https://prod.vercel.app');
  });

  it('uses the per-deployment Vercel URL for preview builds', () => {
    expect(resolveSiteUrl({ VERCEL_URL: 'preview.vercel.app' })).toBe('https://preview.vercel.app');
  });

  it('falls back to siteConfig.url when nothing is set', () => {
    expect(resolveSiteUrl({})).toBe('https://fallback.example.com');
  });
});
