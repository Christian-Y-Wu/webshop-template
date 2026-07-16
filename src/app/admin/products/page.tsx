'use client';

import { AdminShell } from '@/components/admin/admin-shell';
import { ProductsManager } from '@/components/admin/products-manager';
import { useAdminConfig } from '@/components/admin/use-admin-config';

export default function AdminProductsPage() {
  const { config, error, saveProducts } = useAdminConfig();

  return (
    <AdminShell
      title="Products"
      description="Manage your catalogue. Your products live in custom-products.json; the demo set below is a read-only starting point."
      writable={config?.meta.writable}
    >
      {error && <p className="rounded-xl bg-sale/10 px-4 py-3 text-sm text-sale">{error}</p>}
      {!config && !error && (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="skeleton h-56 rounded-card" />
          ))}
        </div>
      )}
      {config && (
        <ProductsManager
          key={JSON.stringify(config.customProducts)}
          config={config}
          onSave={saveProducts}
        />
      )}
    </AdminShell>
  );
}
