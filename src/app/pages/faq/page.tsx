import Link from 'next/link';
import type { Metadata } from 'next';
import { faqs, faqCategories } from '@/lib/data/faq';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Accordion } from '@/components/ui/accordion';

export const metadata: Metadata = buildMetadata({
  title: 'FAQ',
  description: 'Answers to common questions about shipping, returns, sizing and more.',
  path: '/pages/faq',
});

export default function FaqPage() {
  return (
    <div className="container-page pt-6">
      <JsonLd data={faqJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))} />
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'FAQ', href: '/pages/faq' }]} className="mb-6" />

      <header className="mx-auto max-w-2xl text-center">
        <p className="eyebrow mb-3">Help centre</p>
        <h1 className="text-display">How can we help?</h1>
        <p className="mt-4 text-ink-soft">
          Answers to the questions we hear most. Still stuck?{' '}
          <Link href="/pages/contact" className="font-medium text-ink link-underline">
            Get in touch
          </Link>
          .
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-3xl space-y-10 pb-8">
        {faqCategories.map((category) => (
          <section key={category}>
            <h2 className="mb-2 font-serif text-2xl">{category}</h2>
            <Accordion items={faqs.filter((f) => (f.category ?? 'General') === category).map((f) => ({ title: f.question, content: f.answer }))} />
          </section>
        ))}
      </div>
    </div>
  );
}
