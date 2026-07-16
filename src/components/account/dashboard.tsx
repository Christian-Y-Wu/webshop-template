'use client';

import Link from 'next/link';
import { ArrowRight, Heart, MapPin, Package, Truck } from 'lucide-react';
import { AccountShell } from '@/components/account/account-shell';
import { useAuth } from '@/components/providers/auth-provider';
import { useStore } from '@/components/providers/store-provider';

/**
 * Account dashboard. Orders/addresses are illustrative demo data (there is no
 * order backend in the template); the greeting and wishlist count are real.
 */
export function AccountDashboard() {
  const { user } = useAuth();
  const { wishlist, hydrated } = useStore();

  const stats = [
    { label: 'Total orders', value: '—', icon: Package },
    { label: 'In transit', value: '—', icon: Truck },
    { label: 'Wishlist items', value: hydrated ? String(wishlist.length) : '…', icon: Heart },
    { label: 'Saved addresses', value: '—', icon: MapPin },
  ];

  return (
    <AccountShell
      title={user ? `Hello, ${user.firstName} 👋` : 'Hello 👋'}
      description="Welcome back to your account."
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-card border border-line bg-surface p-5">
            <s.icon size={20} className="text-accent" />
            <p className="mt-3 font-serif text-2xl">{s.value}</p>
            <p className="text-xs text-ink-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-card border border-line bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Orders</h2>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink link-underline"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <p className="mt-4 rounded-xl bg-surface-muted p-4 text-sm text-ink-soft">
          Orders appear here once the store is connected to a commerce backend — see
          “Connecting a real backend” in the README.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/addresses"
          className="group flex items-center justify-between rounded-card border border-line bg-surface p-5 hover:border-ink"
        >
          <div>
            <p className="font-medium text-ink">Manage addresses</p>
            <p className="text-sm text-ink-muted">Update your shipping details</p>
          </div>
          <ArrowRight size={18} className="text-ink-muted transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/account/settings"
          className="group flex items-center justify-between rounded-card border border-line bg-surface p-5 hover:border-ink"
        >
          <div>
            <p className="font-medium text-ink">Profile settings</p>
            <p className="text-sm text-ink-muted">Password, preferences & more</p>
          </div>
          <ArrowRight size={18} className="text-ink-muted transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </AccountShell>
  );
}
