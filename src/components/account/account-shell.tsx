'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, LayoutDashboard, LogOut, MapPin, Package, Settings } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { cn } from '@/lib/utils';

const nav = [
  { label: 'Dashboard', href: '/account', icon: LayoutDashboard },
  { label: 'Orders', href: '/account/orders', icon: Package },
  { label: 'Addresses', href: '/account/addresses', icon: MapPin },
  { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { label: 'Settings', href: '/account/settings', icon: Settings },
];

export function AccountShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Account', href: '/account' },
          { name: title, href: pathname },
        ]}
        className="mb-6"
      />

      <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
        {/* Sidebar */}
        <aside>
          <div className="rounded-card border border-line bg-surface p-5">
            <div className="flex items-center gap-3 border-b border-line pb-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-soft font-serif text-lg text-accent">
                A
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">Alex Morgan</p>
                <p className="truncate text-xs text-ink-muted">alex@example.com</p>
              </div>
            </div>
            <nav className="mt-4 space-y-1">
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
              <Link
                href="/account/login"
                className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-surface-muted hover:text-sale"
              >
                <LogOut size={17} /> Sign out
              </Link>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div>
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
