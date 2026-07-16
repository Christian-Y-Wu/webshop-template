'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { SettingsForm } from '@/components/admin/settings-form';
import { useAdminConfig } from '@/components/admin/use-admin-config';

export default function AdminSettingsPage() {
  const { config, error, saveSettings } = useAdminConfig();

  return (
    <AdminShell
      title="Store settings"
      description="Everything needed to launch, in one form. Keep the storefront open in a second tab — saves hot-reload it instantly."
      writable={config?.meta.writable}
    >
      {error && <p className="rounded-xl bg-sale/10 px-4 py-3 text-sm text-sale">{error}</p>}
      {!config && !error && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-40 rounded-card" />
          ))}
        </div>
      )}
      {config && <SettingsForm key={JSON.stringify(config.settings)} config={config} onSave={saveSettings} />}
    </AdminShell>
  );
}
