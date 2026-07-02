import type { BlogPost } from '@/lib/types';

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-a-capsule-wardrobe',
    title: 'Building a Capsule Wardrobe That Actually Lasts',
    excerpt:
      'Fewer, better things. Our guide to assembling a wardrobe of pieces that work harder, last longer, and always feel like you.',
    category: 'Style Guide',
    author: 'The AURA Studio',
    readingTime: '6 min read',
    date: '2026-06-24',
    seed: 'blog-capsule',
    body: [
      'A capsule wardrobe isn’t about owning less for the sake of it. It’s about owning the right things — pieces that layer effortlessly, transcend seasons, and only get better with age.',
      'Start with a neutral foundation: a perfect tee, a relaxed knit, a well-cut trouser. From there, add texture and interest through accessories rather than volume.',
      'The goal is a wardrobe where everything works with everything else. When each piece earns its place, getting dressed becomes a pleasure rather than a chore.',
      'Invest in natural fibres — merino, linen, organic cotton — and care for them well. Quality materials reward you with years of wear and a patina that fast fashion can never replicate.',
    ],
  },
  {
    slug: 'the-art-of-slow-living',
    title: 'The Art of Slow Living at Home',
    excerpt:
      'Small rituals, considered objects, and warm light. How to turn everyday moments into something to savour.',
    category: 'Living',
    author: 'Priya Sharma',
    readingTime: '5 min read',
    date: '2026-06-16',
    seed: 'blog-slow',
    body: [
      'Slow living begins with attention. It’s the candle lit at dusk, the ceramic mug that feels right in the hand, the throw that invites you to linger a little longer.',
      'You don’t need to overhaul your home to feel its benefits. Begin with one corner — a reading chair, a bedside table — and fill it only with things you genuinely love.',
      'Objects made by hand carry a quiet warmth. A hand-thrown vase, a stonewashed textile, a wood-wick candle — these small imperfections are exactly what make a space feel alive.',
    ],
  },
  {
    slug: 'meet-the-makers',
    title: 'Meet the Makers Behind the Craft',
    excerpt:
      'From a family-run knitting mill in Portugal to a ceramics studio in Stoke, the people who bring our pieces to life.',
    category: 'Behind the Scenes',
    author: 'Marcus Thorne',
    readingTime: '8 min read',
    date: '2026-06-02',
    seed: 'blog-makers',
    body: [
      'Every AURA piece begins with a person. We partner with small, specialist workshops who have spent generations perfecting their craft.',
      'In northern Portugal, a family-run mill knits our merino on machines older than most of the team. In Stoke-on-Trent, a two-person studio throws each vase by hand.',
      'These partnerships are why we can promise quality — and why we can trace every piece back to the hands that made it. Craft, for us, isn’t a marketing word. It’s a relationship.',
    ],
  },
  {
    slug: 'sustainability-report',
    title: 'Our Progress: The 2026 Sustainability Report',
    excerpt:
      'Carbon-neutral shipping, recycled materials, and where we still have work to do. Full transparency on our journey.',
    category: 'Sustainability',
    author: 'The AURA Studio',
    readingTime: '7 min read',
    date: '2026-05-20',
    seed: 'blog-sustain',
    body: [
      'Transparency means sharing the whole picture — the wins and the work still ahead. Here’s where we stand this year.',
      'All shipping is now carbon-neutral, offset through verified reforestation projects. Over 70% of our range uses recycled or organic materials, up from 48% last year.',
      'We’re not perfect, and we won’t pretend to be. But we believe in measuring, reporting, and improving — season after season.',
    ],
  },
];

export const blogPostMap = new Map(blogPosts.map((p) => [p.slug, p]));

export function getBlogPost(slug: string) {
  return blogPostMap.get(slug);
}
