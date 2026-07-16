'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { LaunchChecklist } from '@/components/admin/launch-checklist';
import { useAdminConfig } from '@/components/admin/use-admin-config';

export default function AdminLaunchPage() {
  const { config, error } = useAdminConfig();

  return (
    <AdminShell
      title="Launch checklist"
      description="The guided path from template to live store. Auto items tick themselves as you configure; the rest are one-time manual checks."
      writable={config?.meta.writable}
    >
      {error && <p className="rounded-xl bg-sale/10 px-4 py-3 text-sm text-sale">{error}</p>}
      {!config && !error && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-44 rounded-card" />
          ))}
        </div>
      )}
      {config && <LaunchChecklist config={config} />}
    </AdminShell>
  );
}
