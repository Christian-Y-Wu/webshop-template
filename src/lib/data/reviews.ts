import type { Review } from '@/lib/types';

/* A pool of placeholder reviews. `getReviews` maps them onto any product so
   every PDP has believable social proof out of the box. */

const REVIEW_POOL: Omit<Review, 'id' | 'productId'>[] = [
  {
    author: 'Eleanor V.',
    location: 'London, UK',
    rating: 5,
    title: 'Exceeded my expectations',
    body: 'The quality is genuinely exceptional. The fabric feels substantial and the fit is spot on. I’ve already ordered a second in another colour.',
    date: '2026-06-18',
    verified: true,
    helpful: 42,
    hasImage: true,
    fit: 'True to size',
  },
  {
    author: 'Marcus T.',
    location: 'Berlin, DE',
    rating: 5,
    title: 'Beautifully made',
    body: 'Arrived in gorgeous packaging within two days. Every detail feels considered — you can tell it’s built to last.',
    date: '2026-06-11',
    verified: true,
    helpful: 28,
  },
  {
    author: 'Priya S.',
    location: 'Toronto, CA',
    rating: 4,
    title: 'Lovely, runs slightly large',
    body: 'Really happy with this. The colour is true to the photos. I’d size down if you’re between sizes, but otherwise perfect.',
    date: '2026-06-04',
    verified: true,
    helpful: 19,
    hasImage: true,
    fit: 'Runs large',
  },
  {
    author: 'Sofie L.',
    location: 'Copenhagen, DK',
    rating: 5,
    title: 'My new favourite',
    body: 'I wear this constantly. It’s become the first thing I reach for. Comfortable, elegant, and holds up beautifully after washing.',
    date: '2026-05-29',
    verified: true,
    helpful: 35,
    hasVideo: true,
    fit: 'True to size',
  },
  {
    author: 'James K.',
    location: 'Melbourne, AU',
    rating: 5,
    title: 'Worth every penny',
    body: 'Premium quality without the inflated price. Shipping was fast even to Australia and the return policy gave me peace of mind.',
    date: '2026-05-20',
    verified: true,
    helpful: 22,
  },
  {
    author: 'Amara N.',
    location: 'New York, US',
    rating: 4,
    title: 'Great, minor note',
    body: 'Excellent overall. Took a day or two to soften up but now it’s perfect. Would recommend to a friend.',
    date: '2026-05-12',
    verified: true,
    helpful: 11,
    fit: 'True to size',
  },
];

export function getReviews(productId: string, count?: number): Review[] {
  const n = count ?? REVIEW_POOL.length;
  return REVIEW_POOL.slice(0, n).map((r, i) => ({
    ...r,
    id: `${productId}-r${i}`,
    productId,
  }));
}

/** Ratings distribution (5→1 stars) for the histogram, derived from a summary. */
export function ratingBreakdown(average: number, total: number) {
  const weights = average >= 4.7 ? [0.82, 0.13, 0.03, 0.01, 0.01] : [0.62, 0.22, 0.1, 0.04, 0.02];
  return weights.map((w, i) => ({
    stars: 5 - i,
    count: Math.round(total * w),
    percent: Math.round(w * 100),
  }));
}
