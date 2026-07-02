import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const runtime = 'edge';
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: '#faf8f5',
          backgroundImage:
            'radial-gradient(120% 90% at 20% 10%, #ffffff, transparent 55%), linear-gradient(135deg, #f0e2db 0%, #e6d3a9 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 44, color: '#1a1816', fontWeight: 600 }}>{siteConfig.name}</div>
          <div style={{ width: 12, height: 12, borderRadius: 12, background: '#b2583f', marginTop: 18 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, color: '#1a1816', lineHeight: 1.05, maxWidth: 900 }}>
            Considered essentials for a beautiful everyday.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: '#4a4641', fontFamily: 'Arial, sans-serif' }}>
            Premium storefront template · Crafted to last · Shipped worldwide
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, fontSize: 24, color: '#4a4641', fontFamily: 'Arial, sans-serif' }}>
          <span>Free shipping over $75</span>
          <span>·</span>
          <span>30-day returns</span>
          <span>·</span>
          <span>4.8★ from 12,000+ reviews</span>
        </div>
      </div>
    ),
    size,
  );
}
