'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

/**
 * Admin Studio sign-in. When no ADMIN_PASSWORD is configured, the login API
 * answers 404 and this form flips into setup instructions instead — so the
 * studio is discoverable but never accessible unconfigured.
 */
export function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);

  // If the studio isn't enabled, show setup help immediately (probe once).
  useEffect(() => {
    fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      .then((res) => {
        if (res.status === 404) setDisabled(true);
      })
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const next = params.get('next');
        router.push(next && next.startsWith('/admin') ? next : '/admin');
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.status === 404) setDisabled(true);
      else if (res.status === 429) {
        const mins = Math.max(1, Math.ceil((data.retryAfterS ?? 60) / 60));
        setMessage(`Too many attempts. Try again in about ${mins} minute${mins > 1 ? 's' : ''}.`);
      } else setMessage('Wrong password.');
    } catch {
      setMessage('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
            <ShieldCheck size={22} />
          </span>
          <h1 className="font-serif text-3xl">
            {siteConfig.name} <span className="text-ink-muted">Studio</span>
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            The admin cockpit for configuring and launching this store.
          </p>
        </div>

        {disabled ? (
          <div className="rounded-card border border-line bg-surface p-6 text-sm leading-relaxed text-ink-soft">
            <p className="font-medium text-ink">The studio isn&rsquo;t enabled yet.</p>
            <p className="mt-2">
              Add an admin password to <code className="rounded bg-surface-muted px-1.5 py-0.5">.env.local</code> in
              the project root, then restart <code className="rounded bg-surface-muted px-1.5 py-0.5">npm run dev</code>:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-ink px-4 py-3 text-canvas">
              ADMIN_PASSWORD=pick-a-long-passphrase
            </pre>
            <p className="mt-3 text-xs text-ink-muted">
              Use 12+ characters. The studio stays disabled on any deployment that doesn&rsquo;t set this variable.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="rounded-card border border-line bg-surface p-6">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Admin password</span>
              <input
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••••••"
              />
            </label>
            {message && <p className="mt-3 text-sm text-sale">{message}</p>}
            <button type="submit" disabled={busy} className="btn-primary mt-4 w-full">
              {busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} />
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
              <KeyRound size={13} /> Set via ADMIN_PASSWORD in .env.local
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
