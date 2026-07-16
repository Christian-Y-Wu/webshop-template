'use client';

import { usePathname } from 'next/navigation';

/** True on Admin Studio routes, where storefront chrome must not render. */
export function useIsAdminRoute() {
  const pathname = usePathname() ?? '';
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

/**
 * Wraps the storefront chrome (announcement bar, header, footer) around the
 * page — except on /admin, which has its own shell. The slots are passed as
 * props from the root layout so they keep rendering on the server.
 */
export function SiteChrome({
  announcement,
  header,
  footer,
  children,
}: {
  announcement: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const isAdmin = useIsAdminRoute();

  if (isAdmin) return <main id="main">{children}</main>;

  return (
    <>
      {announcement}
      {header}
      <main id="main">{children}</main>
      {footer}
    </>
  );
}
