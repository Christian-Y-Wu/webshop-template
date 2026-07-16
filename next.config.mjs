/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Never let browsers guess content types (blocks a class of XSS smuggling).
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // The store never needs to run inside someone else's <iframe> (clickjacking).
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Send only the origin cross-site — full URLs can leak search terms etc.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // The storefront uses none of these device APIs.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // Enforce HTTPS for two years once seen over HTTPS (no-op during local dev).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  eslint: {
    // Templates ship with intentionally loose linting so downstream stores
    // can adopt their own rules without a blocked build.
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      // Belt-and-braces: even if a crawler ignores robots.txt, admin pages
      // and APIs tell it explicitly to stay out of the index.
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
    ];
  },
};

export default nextConfig;
