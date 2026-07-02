/* Editorial + policy page content. Extend or replace freely. */

export interface ContentSection {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface ContentPage {
  slug: string;
  title: string;
  eyebrow?: string;
  intro: string;
  updated?: string;
  seed?: string;
  layout?: 'editorial' | 'legal';
  sections: ContentSection[];
}

export const contentPages: ContentPage[] = [
  {
    slug: 'about',
    title: 'Our Story',
    eyebrow: 'About AURA',
    intro:
      'We started AURA with a simple belief: that the things we live with every day should be beautiful, honest and built to last.',
    seed: 'page-about',
    layout: 'editorial',
    sections: [
      {
        heading: 'How it began',
        paragraphs: [
          'AURA was founded in a small studio with a big frustration — that so much of what we buy is designed to be replaced, not treasured. We wanted to make the opposite: considered pieces, made well, priced fairly, and meant to be kept.',
          'What began as a handful of knitwear styles has grown into a full collection spanning apparel, home and accessories — but our approach hasn’t changed.',
        ],
      },
      {
        heading: 'What we stand for',
        paragraphs: ['Three principles guide everything we make:'],
        bullets: [
          'Craft over quantity — we work with small, specialist makers who care as much as we do.',
          'Materials that last — natural and recycled fibres, chosen to age beautifully.',
          'Radical transparency — we tell you where things are made, and what they’re made of.',
        ],
      },
      {
        heading: 'Where we’re going',
        paragraphs: [
          'We’re a work in progress, and we like it that way. Every season we push to do better — for our customers, our makers and the planet. Thank you for being part of the journey.',
        ],
      },
    ],
  },
  {
    slug: 'sustainability',
    title: 'Sustainability',
    eyebrow: 'Our commitment',
    intro:
      'Doing better isn’t a marketing line — it’s a set of measurable commitments we report on openly, every year.',
    seed: 'page-sustain',
    layout: 'editorial',
    sections: [
      {
        heading: 'Materials',
        paragraphs: [
          'Over 70% of our range is made from organic, recycled or traceable natural fibres — and we’re working toward 100%. Every material is chosen for durability first.',
        ],
      },
      {
        heading: 'Carbon-neutral shipping',
        paragraphs: [
          'All deliveries are carbon-neutral, offset through verified reforestation and renewable-energy projects. Our packaging is plastic-free and fully recyclable.',
        ],
      },
      {
        heading: 'Fair partnerships',
        paragraphs: [
          'We partner only with workshops that share our values on fair pay and safe conditions, and we visit them regularly. Long-term relationships, not lowest-bid contracts.',
        ],
      },
    ],
  },
  {
    slug: 'shipping',
    title: 'Shipping Information',
    eyebrow: 'Help',
    intro: 'Everything you need to know about how and when your order arrives.',
    layout: 'legal',
    updated: 'July 1, 2026',
    sections: [
      {
        heading: 'Processing time',
        paragraphs: ['Orders are processed and dispatched within 1–2 business days. You’ll receive tracking as soon as your parcel is on its way.'],
      },
      {
        heading: 'Delivery times & costs',
        paragraphs: ['We offer the following options at checkout:'],
        bullets: [
          'Standard (3–5 business days) — Free over $75, otherwise $6.95',
          'Express (1–2 business days) — $14.95',
          'International (5–10 business days) — calculated at checkout, duties included',
        ],
      },
      {
        heading: 'Where we ship',
        paragraphs: ['We ship to over 60 countries worldwide. All shipping is carbon-neutral at no extra cost to you.'],
      },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns & Exchanges',
    eyebrow: 'Help',
    intro: 'Not quite right? No problem. We offer free, easy returns within 30 days.',
    layout: 'legal',
    updated: 'July 1, 2026',
    sections: [
      {
        heading: 'Our policy',
        paragraphs: ['Return any unworn item with tags attached within 30 days of delivery for a full refund or exchange. Returns are free — we’ll send you a prepaid label.'],
      },
      {
        heading: 'How to start a return',
        paragraphs: ['Head to your account, open the order, and select “Return or exchange”. Follow the steps and drop your parcel at any carrier point.'],
        bullets: [
          'Refunds are issued to your original payment method within 5–7 business days of us receiving the item.',
          'Exchanges reserve your new size or colour immediately so it doesn’t sell out.',
          'Final-sale and personalised items are not eligible for return.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    intro: 'Your privacy matters. This policy explains what we collect and how we use it.',
    layout: 'legal',
    updated: 'July 1, 2026',
    sections: [
      { heading: 'Information we collect', paragraphs: ['We collect the information you provide when you place an order or create an account — name, contact details, shipping address and payment information — as well as basic analytics about how you use our site.'] },
      { heading: 'How we use it', paragraphs: ['To process your orders, provide support, improve our store, and (only with your consent) send you marketing you can opt out of at any time.'] },
      { heading: 'Your rights', paragraphs: ['You can request access to, correction of, or deletion of your personal data at any time by contacting us. We never sell your data to third parties.'] },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    eyebrow: 'Legal',
    intro: 'The terms that govern your use of our store and the purchase of our products.',
    layout: 'legal',
    updated: 'July 1, 2026',
    sections: [
      { heading: 'Using our site', paragraphs: ['By accessing this store you agree to these terms. You may not use our products for any illegal or unauthorised purpose.'] },
      { heading: 'Orders & pricing', paragraphs: ['We reserve the right to refuse or cancel any order. Prices are subject to change, and occasional errors may occur which we’ll correct as quickly as possible.'] },
      { heading: 'Intellectual property', paragraphs: ['All content on this site — imagery, copy and design — is the property of the store and may not be reproduced without permission.'] },
    ],
  },
  {
    slug: 'accessibility',
    title: 'Accessibility Statement',
    eyebrow: 'Legal',
    intro: 'We’re committed to making our store usable and welcoming for everyone.',
    layout: 'legal',
    updated: 'July 1, 2026',
    sections: [
      { heading: 'Our commitment', paragraphs: ['We aim to meet WCAG 2.1 AA standards, with keyboard-navigable interfaces, screen-reader support, sufficient colour contrast, visible focus states and a reduced-motion mode.'] },
      { heading: 'Feedback', paragraphs: ['We know there’s always more to do. If you encounter any barrier using our site, please contact us — we take every report seriously and act quickly.'] },
    ],
  },
];

export const contentPageMap = new Map(contentPages.map((p) => [p.slug, p]));
