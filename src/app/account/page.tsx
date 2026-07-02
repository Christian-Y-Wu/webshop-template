import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Heart, MapPin, Package, Truck } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { AccountShell } from '@/components/account/account-shell';

export const metadata: Metadata = buildMetadata({ title: 'Dashboard', path: '/account', noIndex: true });

const stats = [
  { label: 'Total orders', value: '14', icon: Package },
  { label: 'In transit', value: '1', icon: Truck },
  { label: 'Wishlist items', value: '6', icon: Heart },
  { label: 'Saved addresses', value: '2', icon: MapPin },
];

export default function AccountDashboard() {
  return (
    <AccountShell title="Hello, Alex 👋" description="Welcome back to your account.">
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
          <h2 className="font-serif text-xl">Recent order</h2>
          <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink link-underline">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-surface-muted p-4">
          <div>
            <p className="text-sm font-medium text-ink">Order #AUR-10428</p>
            <p className="text-xs text-ink-muted">Placed Jun 24, 2026 · 3 items · $394.00</p>
          </div>
          <span className="badge bg-success/12 text-success">
            <Truck size={13} /> In transit
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/account/addresses" className="group flex items-center justify-between rounded-card border border-line bg-surface p-5 hover:border-ink">
          <div>
            <p className="font-medium text-ink">Manage addresses</p>
            <p className="text-sm text-ink-muted">Update your shipping details</p>
          </div>
          <ArrowRight size={18} className="text-ink-muted transition-transform group-hover:translate-x-1" />
        </Link>
        <Link href="/account/settings" className="group flex items-center justify-between rounded-card border border-line bg-surface p-5 hover:border-ink">
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
