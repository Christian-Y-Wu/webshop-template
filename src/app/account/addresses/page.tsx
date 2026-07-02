import type { Metadata } from 'next';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { AccountShell } from '@/components/account/account-shell';

export const metadata: Metadata = buildMetadata({ title: 'Addresses', path: '/account/addresses', noIndex: true });

const addresses = [
  {
    label: 'Home',
    default: true,
    name: 'Alex Morgan',
    lines: ['221B Baker Street', 'London, NW1 6XE', 'United Kingdom'],
    phone: '+44 20 7946 0958',
  },
  {
    label: 'Work',
    default: false,
    name: 'Alex Morgan',
    lines: ['30 St Mary Axe', 'London, EC3A 8BF', 'United Kingdom'],
    phone: '+44 20 7946 1234',
  },
];

export default function AddressesPage() {
  return (
    <AccountShell title="Saved addresses" description="Manage your shipping and billing addresses.">
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.label} className="relative rounded-card border border-line bg-surface p-5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-ink">{a.label}</span>
              {a.default && <span className="badge bg-accent-soft text-accent">Default</span>}
            </div>
            <div className="mt-3 text-sm text-ink-soft">
              <p className="font-medium text-ink">{a.name}</p>
              {a.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
              <p className="mt-1 text-ink-muted">{a.phone}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn-outline gap-1.5 px-3 py-1.5 text-xs">
                <Pencil size={13} /> Edit
              </button>
              <button className="btn-ghost gap-1.5 px-3 py-1.5 text-xs hover:text-sale">
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </div>
        ))}

        <button className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-card border border-dashed border-line text-ink-muted transition-colors hover:border-ink hover:text-ink">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-surface-muted">
            <Plus size={20} />
          </span>
          Add new address
        </button>
      </div>
    </AccountShell>
  );
}
