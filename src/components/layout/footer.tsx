'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Instagram, Facebook, Youtube, Check, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';
import { footerNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { Logo } from '@/components/ui/logo';
import { PaymentIcons } from '@/components/ui/payment-icons';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';

const valueProps = [
  { icon: Truck, title: 'Free shipping', body: 'On all orders over $75' },
  { icon: RotateCcw, title: '30-day returns', body: 'Free & carbon-neutral' },
  { icon: ShieldCheck, title: 'Secure payments', body: 'SSL encrypted checkout' },
  { icon: Headphones, title: 'Human support', body: 'We reply within hours' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      {/* Value props strip */}
      <div className="border-b border-line">
        <div className="container-page grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4">
          {valueProps.map((v) => (
            <div key={v.title} className="flex items-center gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <v.icon size={20} strokeWidth={1.6} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{v.title}</p>
                <p className="text-xs text-ink-muted">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.4fr_2fr]">
        {/* Brand + newsletter */}
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{siteConfig.description}</p>

          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSubscribed(true);
            }}
          >
            <p className="text-sm font-medium text-ink">Join the list — get 10% off</p>
            {subscribed ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-success">
                <Check size={16} /> You’re in! Check your inbox for your code.
              </p>
            ) : (
              <div className="mt-3 flex items-center rounded-pill border border-line bg-canvas p-1 focus-within:border-ink">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={siteConfig.email ? 'Enter your email' : ''}
                  className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
                  aria-label="Email address"
                />
                <button type="submit" className="btn-primary px-5 py-2.5" aria-label="Subscribe">
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </form>

          <div className="mt-6 flex items-center gap-3">
            {[
              { icon: Instagram, href: siteConfig.social.instagram, label: 'Instagram' },
              { icon: Facebook, href: siteConfig.social.facebook, label: 'Facebook' },
              { icon: Youtube, href: siteConfig.social.youtube, label: 'YouTube' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                <s.icon size={17} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerNav.map((col) => (
            <div key={col.heading}>
              <p className="eyebrow mb-4">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-soft transition-colors hover:text-ink link-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="order-2 text-xs text-ink-muted md:order-1">
            © {new Date().getFullYear()} {siteConfig.legalName}. {siteConfig.name} is a demo template. All rights reserved.
          </p>
          <div className="order-1 flex items-center gap-5 md:order-2">
            <LocaleSwitcher />
            <PaymentIcons methods={siteConfig.payments} />
          </div>
        </div>
      </div>
    </footer>
  );
}
