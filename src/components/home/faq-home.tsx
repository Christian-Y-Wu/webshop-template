import Link from 'next/link';
import { faqs } from '@/lib/data/faq';
import { Accordion } from '@/components/ui/accordion';
import { Reveal } from '@/components/ui/reveal';

export function FaqHome() {
  const items = faqs.slice(0, 6).map((f) => ({ title: f.question, content: f.answer }));

  return (
    <section className="container-page mt-20 lg:mt-28">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-3">Support</p>
          <h2 className="text-headline text-balance">Frequently asked questions</h2>
          <p className="mt-4 text-ink-soft">
            Everything you need to know about ordering, shipping and returns. Can’t find your answer?
          </p>
          <Link href="/pages/contact" className="btn-outline mt-6">
            Contact our team
          </Link>
        </Reveal>
        <Reveal delay={100}>
          <Accordion items={items} defaultOpen={0} />
        </Reveal>
      </div>
    </section>
  );
}
