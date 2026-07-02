/** @type {import('next').NextConfig} */
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
};

export default nextConfig;
