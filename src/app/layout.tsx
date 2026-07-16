import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import { siteUrl } from '@/lib/site-url';
import { accentStyle, colorModeScript } from '@/lib/theme';
import { buildMetadata, organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { Providers } from '@/components/providers';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SiteChrome } from '@/components/layout/site-chrome';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...buildMetadata({}),
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName }],
  keywords: ['webshop', 'ecommerce', 'premium', 'store', siteConfig.name],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#1a1816',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const accent = accentStyle();

  return (
    <html
      lang={siteConfig.locale}
      data-theme={siteConfig.theme || undefined}
      className={`${inter.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        {/* Stamp data-mode before first paint so dark mode never flashes light. */}
        <script dangerouslySetInnerHTML={{ __html: colorModeScript() }} />
        {accent && <style dangerouslySetInnerHTML={{ __html: accent }} />}
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
        >
          Skip to content
        </a>
        <Providers>
          <SiteChrome announcement={<AnnouncementBar />} header={<Header />} footer={<Footer />}>
            {children}
          </SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
