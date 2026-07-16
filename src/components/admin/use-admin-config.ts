'use client';

import { useCallback, useEffect, useState } from 'react';
import type { StoreSettings } from '@/config/settings-schema';
import type { SiteConfig } from '@/config/site';
import type { Product } from '@/lib/types';

/* ==========================================================================
   useAdminConfig — one hook that powers the whole Admin Studio: loads the
   current configuration and exposes typed save calls.
   ========================================================================== */

export interface AdminConfig {
  settings: StoreSettings;
  effective: SiteConfig;
  customProducts: Product[];
  demoProducts: Product[];
  collections: { handle: string; title: string }[];
  meta: {
    writable: boolean;
    stripeConfigured: boolean;
    siteUrl: string;
    siteUrlFromEnv: boolean;
    adminPasswordLength: number;
  };
}

export type SaveResult = { ok: true } | { ok: false; problems: string[] };

async function parseProblems(res: Response): Promise<string[]> {
  try {
    const data = await res.json();
    if (Array.isArray(data?.problems) && data.problems.length) return data.problems;
    if (data?.error === 'read_only') {
      return ['This deployment is read-only. Run the studio locally (npm run dev) to edit the store.'];
    }
    if (data?.error) return [`Save failed (${data.error}).`];
  } catch {
    /* fall through */
  }
  return ['Save failed — check the terminal running `npm run dev`.'];
}

export function useAdminConfig() {
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/config', { cache: 'no-store' });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setConfig((await res.json()) as AdminConfig);
      setError(null);
    } catch {
      setError('Could not load the store configuration.');
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const saveSettings = useCallback(
    async (settings: StoreSettings): Promise<SaveResult> => {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) return { ok: false, problems: await parseProblems(res) };
      await reload();
      return { ok: true };
    },
    [reload],
  );

  const saveProducts = useCallback(
    async (products: Product[]): Promise<SaveResult> => {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products }),
      });
      if (!res.ok) return { ok: false, problems: await parseProblems(res) };
      await reload();
      return { ok: true };
    },
    [reload],
  );

  return { config, error, reload, saveSettings, saveProducts };
}
