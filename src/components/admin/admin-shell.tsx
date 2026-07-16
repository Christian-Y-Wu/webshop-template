'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ExternalLink, ListChecks, LogOut, Package, SlidersHorizontal } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

const nav = [
  { label: 'Store settings', href: '/admin', icon: SlidersHorizontal },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Launch checklist', href: '/admin/launch', icon: ListChecks },
];

export function AdminShell({
  title,
  description,
  writable,
  children,
}: {
  title: string;
  description?: string;
  /** undefined = still loading */
  writable?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[230px_1fr] lg:gap-12 lg:py-10">
        {/* Sidebar */}
        <aside>
          <div className="lg:sticky lg:top-8">
            <p className="font-serif text-2xl">
              {siteConfig.name}
              <span className="ml-2 align-middle text-xs font-sans uppercase tracking-eyebrow text-ink-muted">
                Studio
              </span>
            </p>

            {writable !== undefined && (
              <span
                className={cn(
                  'mt-3 inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
                  writable ? 'bg-success/10 text-success' : 'bg-highlight/15 text-ink-soft',
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', writable ? 'bg-success' : 'bg-highlight')} />
                {writable ? 'Editing local files' : 'Read-only deploy'}
              </span>
            )}

            <nav className="mt-6 space-y-1">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      active ? 'bg-ink text-canvas' : 'text-ink-soft hover:bg-surface-muted hover:text-ink',
                    )}
                  >
                    <item.icon size={17} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 space-y-1 border-t border-line pt-4">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
              >
                <ExternalLink size={17} /> View store
              </Link>
              <button
                onClick={signOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-surface-muted hover:text-sale"
              >
                <LogOut size={17} /> Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0">
          <header className="mb-6">
            <h1 className="font-serif text-2xl lg:text-3xl">{title}</h1>
            {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
