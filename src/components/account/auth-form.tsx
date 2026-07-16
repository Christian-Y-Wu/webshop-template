'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Check, Gift, Info } from 'lucide-react';
import { MediaImage } from '@/components/ui/media-image';
import { useAuth } from '@/components/providers/auth-provider';
import { siteConfig } from '@/config/site';

type Mode = 'login' | 'register' | 'forgot';

const copy: Record<Mode, { title: string; subtitle: string; cta: string }> = {
  login: { title: 'Welcome back', subtitle: 'Sign in to your account to continue.', cta: 'Sign in' },
  register: { title: 'Create your account', subtitle: `Join ${siteConfig.name} and enjoy 10% off your first order.`, cta: 'Create account' },
  forgot: { title: 'Reset your password', subtitle: 'Enter your email and we’ll send you a reset link.', cta: 'Send reset link' },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const c = copy[mode];
  const router = useRouter();
  const { login, register } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'forgot') {
      setSubmitted(true);
      return;
    }

    const result =
      mode === 'login' ? login(email) : register({ firstName, lastName, email });

    if (result.ok) {
      router.push('/account');
      return;
    }
    if (result.error === 'not_found') {
      setError('No account with that email in this browser yet — create one below.');
    } else if (result.error === 'exists') {
      setError('That email already has an account — sign in instead.');
    } else {
      setError('Please check the details and try again.');
    }
  };

  return (
    <div className="grid min-h-[70vh] lg:grid-cols-2">
      {/* Visual */}
      <div className="relative hidden overflow-hidden lg:block">
        <MediaImage seed="account-visual" alt={siteConfig.name} monogram={false} sizes="50vw" />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="absolute bottom-12 left-12 max-w-sm text-white">
          <p className="font-serif text-3xl leading-tight">{siteConfig.tagline}</p>
          <p className="mt-3 text-white/75">Members enjoy early access, private sales and free returns.</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          {mode === 'register' && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-pill bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent">
              <Gift size={14} /> 10% off your first order
            </div>
          )}
          <h1 className="font-serif text-3xl">{c.title}</h1>
          <p className="mt-2 text-sm text-ink-soft">{c.subtitle}</p>

          {submitted && mode === 'forgot' ? (
            <p className="mt-8 flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
              <Check size={16} /> If an account exists, a reset link is on its way.
            </p>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={submit}>
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="First name"
                    className="input"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    placeholder="Last name"
                    className="input"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              )}
              <input
                type="email"
                required
                placeholder="Email address"
                className="input"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {mode !== 'forgot' && (
                <input
                  type="password"
                  required
                  placeholder="Password"
                  className="input"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              )}

              {error && <p className="text-sm text-sale">{error}</p>}

              {mode === 'login' && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-ink-soft">
                    <input type="checkbox" className="h-4 w-4 accent-[rgb(var(--color-accent))]" /> Remember me
                  </label>
                  <Link href="/account/forgot" className="text-ink-soft hover:text-ink link-underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button type="submit" className="btn-primary w-full">
                {c.cta} <ArrowRight size={16} />
              </button>
            </form>
          )}

          {mode !== 'forgot' && (
            <>
              <div className="my-6 flex items-center gap-4 text-xs text-ink-muted">
                <span className="h-px flex-1 bg-line" /> or continue with <span className="h-px flex-1 bg-line" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="btn-outline py-3 text-sm">Google</button>
                <button className="btn-outline py-3 text-sm">Apple</button>
              </div>
            </>
          )}

          <p className="mt-8 text-center text-sm text-ink-soft">
            {mode === 'login' ? (
              <>
                New to {siteConfig.name}?{' '}
                <Link href="/account/register" className="font-medium text-ink link-underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/account/login" className="font-medium text-ink link-underline">
                  Sign in
                </Link>
              </>
            )}
          </p>

          {mode !== 'forgot' && (
            <p className="mt-6 flex items-start gap-2 rounded-xl bg-surface-muted px-4 py-3 text-xs leading-relaxed text-ink-muted">
              <Info size={14} className="mt-0.5 shrink-0" />
              <span>
                Demo accounts live only in this browser and never store your password. Connect a real
                auth provider before launch — see the template docs.
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
