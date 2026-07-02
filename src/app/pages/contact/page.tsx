import Link from 'next/link';
import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { MediaImage } from '@/components/ui/media-image';
import { ContactForm } from '@/components/contact/contact-form';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description: 'Get in touch with the AURA team — we’re here to help.',
  path: '/pages/contact',
});

export default function ContactPage() {
  return (
    <div className="container-page pt-6">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Contact', href: '/pages/contact' }]} className="mb-6" />

      <header className="max-w-2xl">
        <p className="eyebrow mb-3">We’d love to hear from you</p>
        <h1 className="text-display">Get in touch</h1>
        <p className="mt-4 text-ink-soft">
          Questions about an order, sizing or anything else? Our team is here and happy to help.
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        {/* Info */}
        <div className="space-y-4">
          {[
            { icon: Mail, title: 'Email us', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
            { icon: Phone, title: 'Call us', value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
            { icon: MessageCircle, title: 'Live chat', value: 'Available 9am–6pm, Mon–Fri', href: undefined },
            { icon: MapPin, title: 'Visit', value: siteConfig.address, href: undefined },
            { icon: Clock, title: 'Support hours', value: 'Mon–Fri: 9am–6pm · Sat: 10am–4pm', href: undefined },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 rounded-card border border-line bg-surface p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <item.icon size={19} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{item.title}</p>
                {item.href ? (
                  <a href={item.href} className="text-sm text-ink-soft hover:text-ink link-underline">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-ink-soft">{item.value}</p>
                )}
              </div>
            </div>
          ))}

          <div className="relative aspect-[16/10] overflow-hidden rounded-card">
            <MediaImage seed="contact-map" alt="Store location map" monogram={false} sizes="(max-width: 1024px) 100vw, 40vw" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-canvas text-accent shadow-lift">
                <MapPin size={22} />
              </span>
            </div>
          </div>

          <p className="text-sm text-ink-muted">
            Looking for quick answers? Visit our{' '}
            <Link href="/pages/faq" className="font-medium text-ink link-underline">
              FAQ
            </Link>
            .
          </p>
        </div>

        {/* Form */}
        <ContactForm />
      </div>
    </div>
  );
}
