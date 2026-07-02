import type { FaqItem } from '@/lib/types';

export const faqs: FaqItem[] = [
  {
    category: 'Shipping',
    question: 'How long does shipping take?',
    answer:
      'Orders are dispatched within 1–2 business days. Standard delivery takes 3–5 business days domestically and 5–10 business days internationally. Express options are available at checkout.',
  },
  {
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer:
      'Yes — we ship to over 60 countries worldwide with carbon-neutral delivery. Duties and taxes are calculated transparently at checkout so there are no surprises on arrival.',
  },
  {
    category: 'Shipping',
    question: 'Is shipping really free?',
    answer:
      'Standard shipping is complimentary on all orders over $75. Below that threshold, a flat rate is shown at checkout before you pay.',
  },
  {
    category: 'Returns',
    question: 'What is your return policy?',
    answer:
      'We offer free, easy returns within 30 days of delivery. Items should be unworn with tags attached. Start a return from your account and we’ll email you a prepaid label.',
  },
  {
    category: 'Returns',
    question: 'How do exchanges work?',
    answer:
      'Exchanges are free within 30 days. Select “Exchange” when starting your return and we’ll reserve your new size or colour right away so it doesn’t sell out.',
  },
  {
    category: 'Product',
    question: 'How do I find my size?',
    answer:
      'Each product page includes a detailed size guide with measurements and fit notes from real customers. If you’re between sizes, our team is happy to advise — just reach out.',
  },
  {
    category: 'Product',
    question: 'How should I care for my pieces?',
    answer:
      'Care instructions are listed on every product page. In general, washing cold and air-drying will keep natural fibres looking their best for years.',
  },
  {
    category: 'Orders',
    question: 'Can I change or cancel my order?',
    answer:
      'We move fast, but if you contact us within one hour of ordering we can usually make changes. After that, your order may already be on its way — but returns are always free.',
  },
  {
    category: 'Orders',
    question: 'How can I track my order?',
    answer:
      'You’ll receive a tracking link by email as soon as your order ships. You can also view live status any time from the Orders section of your account.',
  },
  {
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, PayPal, Apple Pay, Google Pay, Shop Pay and Klarna. All payments are encrypted and processed securely.',
  },
];

export const faqCategories = Array.from(new Set(faqs.map((f) => f.category ?? 'General')));
