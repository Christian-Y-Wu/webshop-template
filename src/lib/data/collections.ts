import type { Collection } from '@/lib/types';

export const collections: Collection[] = [
  {
    handle: 'new-arrivals',
    title: 'New Arrivals',
    eyebrow: 'Just landed',
    description: 'The latest additions to the studio — fresh silhouettes, colours and objects for the season ahead.',
    seed: 'col-new',
    featured: true,
  },
  {
    handle: 'best-sellers',
    title: 'Best Sellers',
    eyebrow: 'Tried & loved',
    description: 'The pieces our community reaches for again and again. Proven favourites, always in rotation.',
    seed: 'col-best',
    featured: true,
  },
  {
    handle: 'trending',
    title: 'Trending Now',
    eyebrow: 'In the spotlight',
    description: 'What everyone’s adding to cart this week. Move quickly — these tend not to last.',
    seed: 'col-trending',
    featured: true,
  },
  {
    handle: 'summer',
    title: 'The Summer Edit',
    eyebrow: 'Seasonal',
    description: 'Breezy layers, warm-weather footwear and easy essentials for long, bright days.',
    seed: 'col-summer',
    featured: true,
  },
  {
    handle: 'sale',
    title: 'Sale',
    eyebrow: 'Up to 40% off',
    description: 'Considered pieces at a considered price. Selected styles, while stocks last.',
    seed: 'col-sale',
    featured: true,
  },
  { handle: 'knitwear', title: 'Knitwear', description: 'Elevated layers in natural fibres.', seed: 'col-knit' },
  { handle: 'outerwear', title: 'Outerwear', description: 'Jackets and coats for every season.', seed: 'col-outer' },
  { handle: 'dresses', title: 'Dresses', description: 'From easy midis to occasion-ready silhouettes.', seed: 'col-dress' },
  { handle: 'tops', title: 'Tops & Tees', description: 'The building blocks of a considered wardrobe.', seed: 'col-tops' },
  { handle: 'ceramics', title: 'Ceramics', description: 'Hand-thrown objects for the home.', seed: 'col-cer' },
  { handle: 'textiles', title: 'Textiles', description: 'Soft goods that make a house a home.', seed: 'col-tex' },
  { handle: 'lighting', title: 'Lighting', description: 'Warm, sculptural light for every room.', seed: 'col-light' },
  { handle: 'fragrance', title: 'Fragrance', description: 'Candles and diffusers to set the mood.', seed: 'col-frag' },
  { handle: 'bags', title: 'Bags', description: 'Considered carry, made to last.', seed: 'col-bags' },
  { handle: 'jewellery', title: 'Jewellery', description: 'Fine, everyday pieces in recycled metals.', seed: 'col-jewel' },
  { handle: 'small-goods', title: 'Small Goods', description: 'The finishing touches.', seed: 'col-small' },
  { handle: 'all', title: 'Shop All', description: 'Everything in the AURA store, in one place.', seed: 'col-all' },
];

export const collectionMap = new Map(collections.map((c) => [c.handle, c]));

export function getCollection(handle: string) {
  return collectionMap.get(handle);
}

export const featuredCollections = collections.filter((c) => c.featured);

/** Small curated set for the homepage category grid. */
export const categoryGrid = [
  'knitwear',
  'dresses',
  'ceramics',
  'bags',
  'fragrance',
  'jewellery',
].map((h) => collectionMap.get(h)!);
