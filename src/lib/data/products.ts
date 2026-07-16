import type { Product } from '@/lib/types';
import { siteConfig } from '@/config/site';
import customProductsJson from './custom-products.json';

/* ==========================================================================
   PRODUCT CATALOGUE (placeholder)
   Replace with your real products. Prices are in the store base currency
   (USD by default). `images[].seed` drives the generated placeholder art;
   set `images[].src` to a real photo URL to override.

   YOUR products live in `custom-products.json` next to this file — add and
   edit them visually in the Admin Studio (/admin/products) or by hand. They
   are listed ahead of the demo catalogue below, and the demo catalogue
   disappears entirely once you set `hideDemoCatalog` in the studio.

   SINGLE-PRODUCT vs CATALOG:
   - If you're launching with one product (`storeMode: 'single'` in
     src/config/site.ts), you only need a single entry here. Set its `slug`
     to match `featuredProductSlug` and the whole site is built around it.
     The demo below ships a full catalogue only so the 'catalog' mode has
     something to show — trim it down to your one product when you go live.
   - As you add products, keep filling this array. Flip `storeMode` to
     'catalog' once customers need to browse, and every product becomes
     shoppable through collections and search automatically.
   ========================================================================== */

const SIZES_APPAREL = ['XS', 'S', 'M', 'L', 'XL'];

const demoProducts: Product[] = [
  {
    id: 'p-aria-knit',
    slug: 'aria-merino-sweater',
    title: 'Aria Merino Sweater',
    subtitle: 'Relaxed crewneck in extra-fine merino',
    tagline: 'The everyday layer, elevated',
    description:
      'A quietly luxurious crewneck knit from traceable extra-fine merino wool. Naturally temperature-regulating, breathable, and soft enough to wear against the skin. Cut with a relaxed body and a slightly dropped shoulder for an easy, lived-in drape.',
    price: 128,
    compareAtPrice: 168,
    images: [
      { seed: 'aria-1', alt: 'Aria Merino Sweater in oat, front view' },
      { seed: 'aria-2', alt: 'Aria Merino Sweater detail of ribbed cuff' },
      { seed: 'aria-3', alt: 'Aria Merino Sweater styled with trousers' },
      { seed: 'aria-4', alt: 'Aria Merino Sweater flat lay' },
    ],
    colors: [
      { name: 'Oat', hex: '#dcd3c4' },
      { name: 'Fog', hex: '#b8bcc0' },
      { name: 'Clay', hex: '#b2583f' },
      { name: 'Ink', hex: '#26241f' },
    ],
    sizes: SIZES_APPAREL,
    badges: [
      { label: 'Best Seller', tone: 'ink' },
      { label: '-24%', tone: 'sale' },
    ],
    collections: ['new-arrivals', 'best-sellers', 'knitwear', 'summer', 'sale', 'all'],
    brand: 'AURA Studio',
    tags: ['merino', 'knit', 'sweater', 'unisex'],
    rating: { rating: 4.9, count: 842 },
    stock: 24,
    lowStockThreshold: 8,
    bestSeller: true,
    newArrival: true,
    specs: [
      { label: 'Fabric', value: '100% Extra-fine Merino Wool' },
      { label: 'Weight', value: 'Midweight, 12-gauge' },
      { label: 'Fit', value: 'Relaxed' },
      { label: 'Origin', value: 'Knit in Portugal' },
    ],
    materials: '100% traceable extra-fine merino wool from certified non-mulesed farms.',
    care: 'Hand wash cold or dry clean. Lay flat to dry. Do not tumble dry.',
    shippingNote: 'Ships within 1–2 business days.',
    pairsWith: ['p-linen-trouser', 'p-orbit-tote', 'p-atlas-scarf'],
    hasVideo: true,
    createdAt: '2026-06-02',
  },
  {
    id: 'p-linen-trouser',
    slug: 'sabbia-linen-trouser',
    title: 'Sabbia Linen Trouser',
    subtitle: 'High-rise wide-leg trouser',
    tagline: 'Breezy tailoring for warm days',
    description:
      'A fluid, high-rise trouser cut from breathable European linen. The wide leg falls into a clean column, while a partially elasticated back waist keeps it comfortable from morning to evening.',
    price: 118,
    compareAtPrice: null,
    images: [
      { seed: 'linen-1', alt: 'Sabbia Linen Trouser in natural' },
      { seed: 'linen-2', alt: 'Sabbia Linen Trouser side profile' },
      { seed: 'linen-3', alt: 'Sabbia Linen Trouser waistband detail' },
    ],
    colors: [
      { name: 'Natural', hex: '#e4dccb' },
      { name: 'Black', hex: '#26241f' },
      { name: 'Olive', hex: '#6b6a4b' },
    ],
    sizes: SIZES_APPAREL,
    badges: [{ label: 'New', tone: 'accent' }],
    collections: ['new-arrivals', 'summer', 'all', 'tops'],
    brand: 'AURA Studio',
    tags: ['linen', 'trouser', 'summer'],
    rating: { rating: 4.7, count: 318 },
    stock: 42,
    lowStockThreshold: 6,
    newArrival: true,
    trending: true,
    materials: '100% European flax linen.',
    care: 'Machine wash cold, gentle. Warm iron while damp.',
    specs: [
      { label: 'Fabric', value: '100% European Flax Linen' },
      { label: 'Rise', value: 'High-rise' },
      { label: 'Leg', value: 'Wide' },
    ],
    pairsWith: ['p-aria-knit', 'p-halo-sandal'],
    createdAt: '2026-06-10',
  },
  {
    id: 'p-orbit-tote',
    slug: 'orbit-leather-tote',
    title: 'Orbit Leather Tote',
    subtitle: 'Structured everyday carryall',
    tagline: 'Room for everything that matters',
    description:
      'A structured tote in full-grain vegetable-tanned leather that softens beautifully with age. Roomy enough for a laptop and the day’s essentials, with a suede-lined interior and a magnetic closure.',
    price: 268,
    compareAtPrice: 320,
    images: [
      { seed: 'orbit-1', alt: 'Orbit Leather Tote in tan' },
      { seed: 'orbit-2', alt: 'Orbit Leather Tote interior' },
      { seed: 'orbit-3', alt: 'Orbit Leather Tote carried on shoulder' },
      { seed: 'orbit-4', alt: 'Orbit Leather Tote hardware detail' },
    ],
    colors: [
      { name: 'Tan', hex: '#a9754c' },
      { name: 'Espresso', hex: '#4b3527' },
      { name: 'Black', hex: '#26241f' },
    ],
    badges: [
      { label: 'Best Seller', tone: 'ink' },
      { label: 'Limited', tone: 'highlight' },
    ],
    collections: ['best-sellers', 'trending', 'bags', 'all', 'sale'],
    brand: 'AURA Atelier',
    tags: ['leather', 'bag', 'tote'],
    rating: { rating: 4.9, count: 1204 },
    stock: 5,
    lowStockThreshold: 8,
    bestSeller: true,
    trending: true,
    materials: 'Full-grain vegetable-tanned leather. Suede lining.',
    care: 'Wipe with a soft dry cloth. Condition seasonally.',
    specs: [
      { label: 'Dimensions', value: '38 × 30 × 12 cm' },
      { label: 'Leather', value: 'Full-grain, veg-tanned' },
      { label: 'Laptop', value: 'Fits up to 15"' },
    ],
    pairsWith: ['p-aria-knit', 'p-atlas-scarf'],
    createdAt: '2026-05-18',
  },
  {
    id: 'p-halo-sandal',
    slug: 'halo-leather-sandal',
    title: 'Halo Leather Sandal',
    subtitle: 'Minimal square-toe slide',
    tagline: 'Fuss-free warm-weather footwear',
    description:
      'A pared-back leather slide with a softly squared toe and a padded footbed. Handmade in Spain from supple nappa leather that moulds to your foot.',
    price: 142,
    compareAtPrice: null,
    images: [
      { seed: 'halo-1', alt: 'Halo Leather Sandal in bone' },
      { seed: 'halo-2', alt: 'Halo Leather Sandal top view' },
      { seed: 'halo-3', alt: 'Halo Leather Sandal worn' },
    ],
    colors: [
      { name: 'Bone', hex: '#e8e2d6' },
      { name: 'Cognac', hex: '#9c5a34' },
      { name: 'Black', hex: '#26241f' },
    ],
    sizes: ['36', '37', '38', '39', '40', '41'],
    badges: [{ label: 'Trending', tone: 'accent' }],
    collections: ['trending', 'summer', 'new-arrivals', 'all'],
    brand: 'AURA Atelier',
    tags: ['shoes', 'sandal', 'leather'],
    rating: { rating: 4.6, count: 226 },
    stock: 18,
    trending: true,
    materials: 'Nappa leather upper and lining. Leather sole with rubber tread.',
    care: 'Protect with leather spray before wear.',
    pairsWith: ['p-linen-trouser'],
    createdAt: '2026-06-14',
  },
  {
    id: 'p-atlas-scarf',
    slug: 'atlas-cashmere-scarf',
    title: 'Atlas Cashmere Scarf',
    subtitle: 'Oversized brushed cashmere wrap',
    tagline: 'Cloud-soft warmth, all year',
    description:
      'An generously sized wrap woven from grade-A Mongolian cashmere and brushed for an impossibly soft hand-feel. Equally at home over a coat or as an aeroplane blanket.',
    price: 188,
    compareAtPrice: 240,
    images: [
      { seed: 'atlas-1', alt: 'Atlas Cashmere Scarf in dove grey' },
      { seed: 'atlas-2', alt: 'Atlas Cashmere Scarf fringe detail' },
      { seed: 'atlas-3', alt: 'Atlas Cashmere Scarf styled' },
    ],
    colors: [
      { name: 'Dove', hex: '#c7c2ba' },
      { name: 'Camel', hex: '#c19a6b' },
      { name: 'Charcoal', hex: '#3c3a36' },
    ],
    badges: [{ label: '-22%', tone: 'sale' }],
    collections: ['best-sellers', 'summer', 'sale', 'small-goods', 'all'],
    brand: 'AURA Studio',
    tags: ['cashmere', 'scarf', 'accessory'],
    rating: { rating: 4.8, count: 512 },
    stock: 31,
    bestSeller: true,
    materials: '100% grade-A Mongolian cashmere.',
    care: 'Dry clean only.',
    pairsWith: ['p-aria-knit', 'p-orbit-tote'],
    createdAt: '2026-04-22',
  },
  {
    id: 'p-terra-vase',
    slug: 'terra-stoneware-vase',
    title: 'Terra Stoneware Vase',
    subtitle: 'Hand-thrown ceramic vase',
    tagline: 'A sculptural centrepiece',
    description:
      'Each Terra vase is hand-thrown by a small studio and finished in a reactive matte glaze, so no two are exactly alike. The generous mouth suits everything from a single stem to an armful of branches.',
    price: 86,
    compareAtPrice: null,
    images: [
      { seed: 'terra-1', alt: 'Terra Stoneware Vase in sand' },
      { seed: 'terra-2', alt: 'Terra Stoneware Vase glaze detail' },
      { seed: 'terra-3', alt: 'Terra Stoneware Vase styled on shelf' },
    ],
    colors: [
      { name: 'Sand', hex: '#d8c7a8' },
      { name: 'Slate', hex: '#7c8085' },
      { name: 'Terracotta', hex: '#b2583f' },
    ],
    badges: [
      { label: 'New', tone: 'accent' },
      { label: 'Handmade', tone: 'success' },
    ],
    collections: ['new-arrivals', 'ceramics', 'trending', 'all'],
    brand: 'AURA Home',
    tags: ['ceramic', 'vase', 'home'],
    rating: { rating: 4.9, count: 189 },
    stock: 12,
    lowStockThreshold: 6,
    newArrival: true,
    materials: 'High-fired stoneware with a food-safe reactive glaze.',
    care: 'Hand wash. Not dishwasher safe.',
    specs: [
      { label: 'Height', value: '24 cm' },
      { label: 'Finish', value: 'Reactive matte glaze' },
    ],
    pairsWith: ['p-lumen-candle'],
    createdAt: '2026-06-20',
  },
  {
    id: 'p-lumen-candle',
    slug: 'lumen-soy-candle',
    title: 'Lumen Soy Candle',
    subtitle: 'Cedar, amber & sea salt',
    tagline: '60 hours of quiet ambience',
    description:
      'A slow-burning candle poured from natural soy and coconut wax with a crackling wood wick. Notes of warm cedar, soft amber and a whisper of sea salt fill a room without overwhelming it.',
    price: 42,
    compareAtPrice: 52,
    images: [
      { seed: 'lumen-1', alt: 'Lumen Soy Candle in amber glass' },
      { seed: 'lumen-2', alt: 'Lumen Soy Candle lit' },
      { seed: 'lumen-3', alt: 'Lumen Soy Candle packaging' },
    ],
    badges: [
      { label: 'Best Seller', tone: 'ink' },
      { label: '-19%', tone: 'sale' },
    ],
    collections: ['best-sellers', 'fragrance', 'sale', 'summer', 'all'],
    brand: 'AURA Home',
    tags: ['candle', 'fragrance', 'home'],
    rating: { rating: 4.8, count: 967 },
    stock: 58,
    bestSeller: true,
    ingredients: 'Soy & coconut wax blend, cotton-wrapped wood wick, phthalate-free fragrance oils.',
    care: 'Trim wick to 5mm before each burn. Burn within sight.',
    specs: [
      { label: 'Burn time', value: '~60 hours' },
      { label: 'Wax', value: 'Soy & coconut blend' },
      { label: 'Wick', value: 'Crackling wood wick' },
    ],
    pairsWith: ['p-terra-vase', 'p-halcyon-diffuser'],
    createdAt: '2026-03-30',
  },
  {
    id: 'p-halcyon-diffuser',
    slug: 'halcyon-reed-diffuser',
    title: 'Halcyon Reed Diffuser',
    subtitle: 'Fig leaf & white tea',
    tagline: 'Effortless, flame-free fragrance',
    description:
      'A long-lasting reed diffuser in hand-blown glass. Fibre reeds draw the fig-leaf-and-white-tea blend upward for months of gentle, even scent throw.',
    price: 48,
    compareAtPrice: null,
    images: [
      { seed: 'halcyon-1', alt: 'Halcyon Reed Diffuser bottle' },
      { seed: 'halcyon-2', alt: 'Halcyon Reed Diffuser with reeds' },
    ],
    collections: ['fragrance', 'new-arrivals', 'all'],
    brand: 'AURA Home',
    tags: ['diffuser', 'fragrance', 'home'],
    rating: { rating: 4.5, count: 143 },
    stock: 26,
    newArrival: true,
    ingredients: 'Plant-derived base oils, fig leaf & white tea fragrance.',
    care: 'Flip reeds weekly to refresh scent.',
    createdAt: '2026-06-08',
  },
  {
    id: 'p-cove-throw',
    slug: 'cove-waffle-throw',
    title: 'Cove Waffle Throw',
    subtitle: 'Stonewashed cotton throw',
    tagline: 'The sofa’s best friend',
    description:
      'A generously sized waffle-weave throw in stonewashed organic cotton. Lightweight yet cocooning, with a lived-in softness from the very first use.',
    price: 98,
    compareAtPrice: 128,
    images: [
      { seed: 'cove-1', alt: 'Cove Waffle Throw folded' },
      { seed: 'cove-2', alt: 'Cove Waffle Throw draped on sofa' },
      { seed: 'cove-3', alt: 'Cove Waffle Throw weave detail' },
    ],
    colors: [
      { name: 'Oat', hex: '#ddd3c1' },
      { name: 'Sage', hex: '#9aa78d' },
      { name: 'Rust', hex: '#a75e3d' },
    ],
    badges: [{ label: '-23%', tone: 'sale' }],
    collections: ['textiles', 'sale', 'best-sellers', 'all'],
    brand: 'AURA Home',
    tags: ['throw', 'blanket', 'home', 'cotton'],
    rating: { rating: 4.7, count: 401 },
    stock: 37,
    bestSeller: true,
    materials: '100% GOTS-certified organic cotton.',
    care: 'Machine wash warm. Tumble dry low.',
    specs: [
      { label: 'Dimensions', value: '130 × 170 cm' },
      { label: 'Weave', value: 'Waffle' },
    ],
    pairsWith: ['p-lumen-candle', 'p-cove-cushion'],
    createdAt: '2026-05-02',
  },
  {
    id: 'p-cove-cushion',
    slug: 'cove-boucle-cushion',
    title: 'Cove Bouclé Cushion',
    subtitle: 'Textured bouclé cushion cover',
    tagline: 'Instant textural warmth',
    description:
      'A plush bouclé cushion cover with a hidden zip and a feather-down insert included. Adds depth and a tactile softness to any seat.',
    price: 58,
    compareAtPrice: null,
    images: [
      { seed: 'cushion-1', alt: 'Cove Bouclé Cushion in cream' },
      { seed: 'cushion-2', alt: 'Cove Bouclé Cushion texture detail' },
    ],
    colors: [
      { name: 'Cream', hex: '#e7ddca' },
      { name: 'Cocoa', hex: '#6c5747' },
    ],
    collections: ['textiles', 'new-arrivals', 'all'],
    brand: 'AURA Home',
    tags: ['cushion', 'home'],
    rating: { rating: 4.6, count: 158 },
    stock: 44,
    newArrival: true,
    materials: 'Bouclé cover (recycled polyester blend). Feather-down insert.',
    care: 'Spot clean cover. Insert dry clean only.',
    createdAt: '2026-06-16',
  },
  {
    id: 'p-solstice-dress',
    slug: 'solstice-slip-dress',
    title: 'Solstice Slip Dress',
    subtitle: 'Bias-cut satin midi',
    tagline: 'From desk to dinner',
    description:
      'A fluid bias-cut slip dress in a matte, machine-washable satin. Adjustable straps and a subtle cowl neck make it endlessly wearable — layer it over a tee or wear it solo.',
    price: 148,
    compareAtPrice: 198,
    images: [
      { seed: 'solstice-1', alt: 'Solstice Slip Dress in champagne' },
      { seed: 'solstice-2', alt: 'Solstice Slip Dress back detail' },
      { seed: 'solstice-3', alt: 'Solstice Slip Dress movement' },
      { seed: 'solstice-4', alt: 'Solstice Slip Dress styled with knit' },
    ],
    colors: [
      { name: 'Champagne', hex: '#e6d5b8' },
      { name: 'Ink', hex: '#26241f' },
      { name: 'Bordeaux', hex: '#6d2233' },
    ],
    sizes: SIZES_APPAREL,
    badges: [
      { label: 'Trending', tone: 'accent' },
      { label: '-25%', tone: 'sale' },
    ],
    collections: ['dresses', 'trending', 'sale', 'summer', 'new-arrivals', 'all'],
    brand: 'AURA Studio',
    tags: ['dress', 'satin', 'occasion'],
    rating: { rating: 4.8, count: 634 },
    stock: 15,
    lowStockThreshold: 8,
    trending: true,
    newArrival: true,
    hasVideo: true,
    materials: 'Recycled satin (matte finish).',
    care: 'Machine wash cold on delicate. Hang to dry.',
    pairsWith: ['p-halo-sandal', 'p-atlas-scarf'],
    createdAt: '2026-06-01',
  },
  {
    id: 'p-meridian-jacket',
    slug: 'meridian-cotton-jacket',
    title: 'Meridian Cotton Jacket',
    subtitle: 'Unlined chore jacket',
    tagline: 'The transitional overshirt',
    description:
      'A clean-lined chore jacket in a garment-dyed organic cotton twill. Three patch pockets, corozo buttons, and a boxy, layer-friendly cut make it a year-round staple.',
    price: 158,
    compareAtPrice: null,
    images: [
      { seed: 'meridian-1', alt: 'Meridian Cotton Jacket in khaki' },
      { seed: 'meridian-2', alt: 'Meridian Cotton Jacket button detail' },
      { seed: 'meridian-3', alt: 'Meridian Cotton Jacket worn open' },
    ],
    colors: [
      { name: 'Khaki', hex: '#9a9070' },
      { name: 'Navy', hex: '#2c3440' },
      { name: 'Ecru', hex: '#e4ddc9' },
    ],
    sizes: SIZES_APPAREL,
    badges: [{ label: 'New', tone: 'accent' }],
    collections: ['outerwear', 'new-arrivals', 'best-sellers', 'all'],
    brand: 'AURA Studio',
    tags: ['jacket', 'outerwear', 'cotton'],
    rating: { rating: 4.7, count: 287 },
    stock: 22,
    newArrival: true,
    bestSeller: true,
    materials: '100% organic cotton twill, garment-dyed.',
    care: 'Machine wash cold. Line dry.',
    createdAt: '2026-06-12',
  },
  {
    id: 'p-vega-tee',
    slug: 'vega-organic-tee',
    title: 'Vega Organic Tee',
    subtitle: 'Heavyweight boxy tee',
    tagline: 'The perfect white tee',
    description:
      'A heavyweight 240gsm organic cotton tee with a boxy body and a clean ribbed neckline that holds its shape. The one you’ll reach for every day.',
    price: 48,
    compareAtPrice: null,
    images: [
      { seed: 'vega-1', alt: 'Vega Organic Tee in white' },
      { seed: 'vega-2', alt: 'Vega Organic Tee neckline detail' },
      { seed: 'vega-3', alt: 'Vega Organic Tee back' },
    ],
    colors: [
      { name: 'White', hex: '#f4f1ea' },
      { name: 'Black', hex: '#26241f' },
      { name: 'Sage', hex: '#9aa78d' },
      { name: 'Butter', hex: '#ecd9a3' },
    ],
    sizes: SIZES_APPAREL,
    badges: [{ label: 'Best Seller', tone: 'ink' }],
    collections: ['tops', 'best-sellers', 'all', 'summer'],
    brand: 'AURA Studio',
    tags: ['tee', 'tshirt', 'cotton', 'basics'],
    rating: { rating: 4.9, count: 1893 },
    stock: 120,
    bestSeller: true,
    materials: '100% organic cotton, 240gsm.',
    care: 'Machine wash cold. Tumble dry low.',
    pairsWith: ['p-linen-trouser', 'p-meridian-jacket'],
    createdAt: '2026-02-15',
  },
  {
    id: 'p-nova-lamp',
    slug: 'nova-table-lamp',
    title: 'Nova Table Lamp',
    subtitle: 'Alabaster-look table lamp',
    tagline: 'A warm, sculptural glow',
    description:
      'A softly rounded table lamp with a resin shade that mimics translucent alabaster, casting a warm ambient glow. Includes a dimmable warm-white LED and inline switch.',
    price: 164,
    compareAtPrice: 198,
    images: [
      { seed: 'nova-1', alt: 'Nova Table Lamp unlit' },
      { seed: 'nova-2', alt: 'Nova Table Lamp lit at dusk' },
      { seed: 'nova-3', alt: 'Nova Table Lamp base detail' },
    ],
    badges: [{ label: '-17%', tone: 'sale' }],
    collections: ['lighting', 'sale', 'trending', 'all'],
    brand: 'AURA Home',
    tags: ['lamp', 'lighting', 'home'],
    rating: { rating: 4.6, count: 212 },
    stock: 9,
    lowStockThreshold: 10,
    trending: true,
    materials: 'Resin shade, powder-coated steel base.',
    specs: [
      { label: 'Height', value: '34 cm' },
      { label: 'Bulb', value: 'Dimmable warm-white LED (included)' },
    ],
    care: 'Dust with a dry microfibre cloth.',
    createdAt: '2026-05-25',
  },
  {
    id: 'p-pebble-earrings',
    slug: 'pebble-gold-earrings',
    title: 'Pebble Gold Earrings',
    subtitle: '18k gold-vermeil hoops',
    tagline: 'Everyday fine jewellery',
    description:
      'Organically shaped hoops in 18k gold vermeil over recycled sterling silver. Lightweight and hypoallergenic — designed to be worn day and night.',
    price: 78,
    compareAtPrice: null,
    images: [
      { seed: 'pebble-1', alt: 'Pebble Gold Earrings pair' },
      { seed: 'pebble-2', alt: 'Pebble Gold Earrings worn' },
    ],
    badges: [
      { label: 'New', tone: 'accent' },
      { label: 'Trending', tone: 'accent' },
    ],
    collections: ['jewellery', 'new-arrivals', 'trending', 'small-goods', 'all'],
    brand: 'AURA Atelier',
    tags: ['jewellery', 'earrings', 'gold'],
    rating: { rating: 4.8, count: 356 },
    stock: 48,
    newArrival: true,
    trending: true,
    materials: '18k gold vermeil over recycled 925 sterling silver.',
    care: 'Avoid contact with perfume and water. Store dry.',
    createdAt: '2026-06-18',
  },
  {
    id: 'p-drift-cap',
    slug: 'drift-canvas-cap',
    title: 'Drift Canvas Cap',
    subtitle: 'Washed six-panel cap',
    tagline: 'Broken-in from day one',
    description:
      'A washed organic-cotton canvas cap with an unstructured crown and an antique-brass buckle strap for the perfect fit.',
    price: 38,
    compareAtPrice: 48,
    images: [
      { seed: 'drift-1', alt: 'Drift Canvas Cap in stone' },
      { seed: 'drift-2', alt: 'Drift Canvas Cap side profile' },
    ],
    colors: [
      { name: 'Stone', hex: '#cbc3b1' },
      { name: 'Black', hex: '#26241f' },
      { name: 'Forest', hex: '#47684a' },
    ],
    badges: [{ label: '-21%', tone: 'sale' }],
    collections: ['small-goods', 'sale', 'summer', 'all'],
    brand: 'AURA Studio',
    tags: ['cap', 'hat', 'accessory'],
    rating: { rating: 4.5, count: 174 },
    stock: 63,
    materials: '100% organic cotton canvas.',
    care: 'Spot clean only.',
    createdAt: '2026-04-11',
  },
  {
    id: 'p-marlow-mug',
    slug: 'marlow-ceramic-mug',
    title: 'Marlow Ceramic Mug (Set of 2)',
    subtitle: 'Speckled stoneware mugs',
    tagline: 'Slow mornings, beautifully served',
    description:
      'A pair of speckled stoneware mugs with a comfortable, chunky handle and a reactive glaze that pools beautifully at the base. Microwave and dishwasher safe.',
    price: 44,
    compareAtPrice: null,
    images: [
      { seed: 'marlow-1', alt: 'Marlow Ceramic Mug set' },
      { seed: 'marlow-2', alt: 'Marlow Ceramic Mug glaze detail' },
    ],
    colors: [
      { name: 'Oat', hex: '#ddd2bd' },
      { name: 'Moss', hex: '#8a936f' },
      { name: 'Storm', hex: '#7d828a' },
    ],
    collections: ['ceramics', 'new-arrivals', 'all'],
    brand: 'AURA Home',
    tags: ['mug', 'ceramic', 'kitchen', 'home'],
    rating: { rating: 4.9, count: 421 },
    stock: 71,
    newArrival: true,
    materials: 'Reactive-glazed stoneware.',
    care: 'Dishwasher and microwave safe.',
    createdAt: '2026-06-05',
  },
  {
    id: 'p-summit-parka',
    slug: 'summit-recycled-parka',
    title: 'Summit Recycled Parka',
    subtitle: 'Weatherproof insulated parka',
    tagline: 'Built for the elements',
    description:
      'A weatherproof parka with a fully recycled shell and PFC-free DWR finish, insulated with responsibly sourced down alternative. Storm cuffs, a two-way zip and a detachable hood keep the weather out.',
    price: 298,
    compareAtPrice: 380,
    images: [
      { seed: 'summit-1', alt: 'Summit Recycled Parka in black' },
      { seed: 'summit-2', alt: 'Summit Recycled Parka hood detail' },
      { seed: 'summit-3', alt: 'Summit Recycled Parka worn' },
    ],
    colors: [
      { name: 'Black', hex: '#26241f' },
      { name: 'Moss', hex: '#5c6448' },
    ],
    sizes: SIZES_APPAREL,
    badges: [
      { label: '-22%', tone: 'sale' },
      { label: 'Limited', tone: 'highlight' },
    ],
    collections: ['outerwear', 'sale', 'best-sellers', 'all'],
    brand: 'AURA Studio',
    tags: ['parka', 'outerwear', 'winter'],
    rating: { rating: 4.7, count: 198 },
    stock: 7,
    lowStockThreshold: 8,
    bestSeller: true,
    materials: '100% recycled polyester shell, recycled insulation. PFC-free DWR.',
    care: 'Machine wash cold. Tumble dry low with dryer balls.',
    createdAt: '2026-05-08',
  },
  {
    id: 'p-gift-card',
    slug: 'gift-card',
    title: 'The AURA Gift Card',
    subtitle: 'Digital gift card',
    tagline: 'Always the right choice',
    description:
      'A digital gift card delivered instantly by email, redeemable across the entire store. Choose an amount and add a personal message at checkout. Never expires.',
    price: 50,
    compareAtPrice: null,
    images: [
      { seed: 'giftcard-1', alt: 'AURA digital gift card' },
      { seed: 'giftcard-2', alt: 'AURA gift card envelope' },
    ],
    sizes: ['$25', '$50', '$100', '$150', '$250'],
    collections: ['all'],
    brand: 'AURA',
    tags: ['gift card', 'gift'],
    rating: { rating: 5.0, count: 88 },
    stock: 9999,
    materials: 'Digital delivery — no physical item shipped.',
    care: 'Redeemable online. Never expires.',
    createdAt: '2026-01-01',
  },
];

/* ---- Lookup helpers ------------------------------------------------------ */

/** Products managed from the Admin Studio (custom-products.json). */
export const customProducts = customProductsJson as unknown as Product[];

/** The built-in demo catalogue (used by the Admin Studio product manager). */
export const demoCatalog = demoProducts;

/** IDs of the demo entries above — used to label them in the Admin Studio. */
export const demoProductIds = new Set(demoProducts.map((p) => p.id));

/** The live catalogue: your products first, then the demo set (unless hidden). */
export const products: Product[] = [
  ...customProducts,
  ...(siteConfig.hideDemoCatalog ? [] : demoProducts),
];

export const productMap = new Map(products.map((p) => [p.slug, p]));
export const productMapById = new Map(products.map((p) => [p.id, p]));

export function getProduct(slug: string) {
  return productMap.get(slug);
}

export function getProductById(id: string) {
  return productMapById.get(id);
}

export function getProductsByCollection(handle: string) {
  if (handle === 'all') return products;
  return products.filter((p) => p.collections.includes(handle));
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.collections.some((c) => product.collections.includes(c) && c !== 'all'),
    )
    .slice(0, limit);
}

export function getBoughtTogether(product: Product) {
  return (product.pairsWith ?? [])
    .map((id) => getProductById(id))
    .filter((p): p is Product => Boolean(p));
}
