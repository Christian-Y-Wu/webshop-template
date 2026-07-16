import type { Metadata } from 'next';

/* The Admin Studio is never indexed and renders without storefront chrome
   (see SiteChrome). Access is enforced by src/middleware.ts. */

export const metadata: Metadata = {
  title: 'Admin Studio',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
