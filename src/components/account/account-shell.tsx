'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Heart, LayoutDashboard, LogOut, MapPin, Package, Settings } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { useAuth } from '@/components/providers/auth-provider';
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
  const router = useRouter();
  const { user, hydrated, logout } = useAuth();

  // The account area requires a session — bounce to sign-in once we know.
  useEffect(() => {
    if (hydrated && !user) router.replace('/account/login');
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div className="container-page py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
          <div className="skeleton h-72 rounded-card" />
          <div className="skeleton h-72 rounded-card" />
        </div>
      </div>
    );
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

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
                {(user.firstName[0] ?? 'A').toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{fullName}</p>
                <p className="truncate text-xs text-ink-muted">{user.email}</p>
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
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-surface-muted hover:text-sale"
              >
                <LogOut size={17} /> Sign out
              </button>
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
