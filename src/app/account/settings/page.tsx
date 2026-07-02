import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { AccountShell } from '@/components/account/account-shell';

export const metadata: Metadata = buildMetadata({ title: 'Settings', path: '/account/settings', noIndex: true });

export default function SettingsPage() {
  return (
    <AccountShell title="Profile settings" description="Manage your personal details and preferences.">
      <div className="space-y-6">
        {/* Profile */}
        <section className="rounded-card border border-line bg-surface p-6">
          <h2 className="font-serif text-xl">Personal details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="First name" defaultValue="Alex" />
            <Field label="Last name" defaultValue="Morgan" />
            <Field label="Email" defaultValue="alex@example.com" type="email" />
            <Field label="Phone" defaultValue="+44 20 7946 0958" type="tel" />
          </div>
          <button className="btn-primary mt-6">Save changes</button>
        </section>

        {/* Password */}
        <section className="rounded-card border border-line bg-surface p-6">
          <h2 className="font-serif text-xl">Password</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Current password" type="password" placeholder="••••••••" />
            <div />
            <Field label="New password" type="password" placeholder="••••••••" />
            <Field label="Confirm new password" type="password" placeholder="••••••••" />
          </div>
          <button className="btn-primary mt-6">Update password</button>
        </section>

        {/* Preferences */}
        <section className="rounded-card border border-line bg-surface p-6">
          <h2 className="font-serif text-xl">Communication preferences</h2>
          <div className="mt-5 space-y-4">
            {[
              { label: 'Product news & new arrivals', desc: 'Be first to know when new pieces drop.', on: true },
              { label: 'Private sales & offers', desc: 'Exclusive early access and member discounts.', on: true },
              { label: 'The Journal', desc: 'Stories, guides and inspiration, monthly.', on: false },
            ].map((p) => (
              <label key={p.label} className="flex items-center justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium text-ink">{p.label}</span>
                  <span className="block text-xs text-ink-muted">{p.desc}</span>
                </span>
                <span className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-surface-muted transition-colors">
                  <input type="checkbox" defaultChecked={p.on} className="peer sr-only" />
                  <span className="ml-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5 peer-checked:bg-accent" />
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Danger */}
        <section className="rounded-card border border-sale/30 bg-surface p-6">
          <h2 className="font-serif text-xl text-sale">Delete account</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button className="btn mt-4 border border-sale/40 px-6 py-3 text-sale hover:bg-sale hover:text-white">
            Delete my account
          </button>
        </section>
      </div>
    </AccountShell>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-soft">{label}</span>
      <input className="input" {...props} />
    </label>
  );
}
