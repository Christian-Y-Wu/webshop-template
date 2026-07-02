/* ==========================================================================
   NAVIGATION — header mega-menu, footer, and utility links.
   ========================================================================== */

export interface MegaColumn {
  heading: string;
  links: { label: string; href: string; badge?: string }[];
}

export interface MegaFeature {
  eyebrow: string;
  title: string;
  href: string;
  seed: string;
  cta: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** When present, hovering opens a mega menu. */
  mega?: {
    columns: MegaColumn[];
    feature?: MegaFeature;
  };
}

export const mainNav: NavItem[] = [
  {
    label: 'New',
    href: '/collections/new-arrivals',
  },
  {
    label: 'Shop',
    href: '/collections/all',
    mega: {
      columns: [
        {
          heading: 'Collections',
          links: [
            { label: 'New Arrivals', href: '/collections/new-arrivals', badge: 'Fresh' },
            { label: 'Best Sellers', href: '/collections/best-sellers' },
            { label: 'Trending Now', href: '/collections/trending' },
            { label: 'The Summer Edit', href: '/collections/summer' },
            { label: 'Sale', href: '/collections/sale', badge: '-40%' },
          ],
        },
        {
          heading: 'Apparel',
          links: [
            { label: 'Knitwear', href: '/collections/knitwear' },
            { label: 'Outerwear', href: '/collections/outerwear' },
            { label: 'Dresses', href: '/collections/dresses' },
            { label: 'Tops & Tees', href: '/collections/tops' },
          ],
        },
        {
          heading: 'Home & Living',
          links: [
            { label: 'Ceramics', href: '/collections/ceramics' },
            { label: 'Textiles', href: '/collections/textiles' },
            { label: 'Lighting', href: '/collections/lighting' },
            { label: 'Fragrance', href: '/collections/fragrance' },
          ],
        },
        {
          heading: 'Accessories',
          links: [
            { label: 'Bags', href: '/collections/bags' },
            { label: 'Jewellery', href: '/collections/jewellery' },
            { label: 'Small Goods', href: '/collections/small-goods' },
            { label: 'Gift Cards', href: '/products/gift-card' },
          ],
        },
      ],
      feature: {
        eyebrow: 'Just landed',
        title: 'The Summer Edit',
        href: '/collections/summer',
        seed: 'mega-summer',
        cta: 'Shop the edit',
      },
    },
  },
  {
    label: 'Collections',
    href: '/collections',
    mega: {
      columns: [
        {
          heading: 'By Mood',
          links: [
            { label: 'Quiet Luxury', href: '/collections/trending' },
            { label: 'Everyday Essentials', href: '/collections/best-sellers' },
            { label: 'Statement Pieces', href: '/collections/new-arrivals' },
            { label: 'The Gift Guide', href: '/collections/summer' },
          ],
        },
        {
          heading: 'By Material',
          links: [
            { label: 'Organic Cotton', href: '/collections/tops' },
            { label: 'Merino Wool', href: '/collections/knitwear' },
            { label: 'Recycled Fibres', href: '/collections/outerwear' },
            { label: 'Stoneware', href: '/collections/ceramics' },
          ],
        },
      ],
      feature: {
        eyebrow: 'Editorial',
        title: 'Meet the makers behind the craft',
        href: '/blog',
        seed: 'mega-makers',
        cta: 'Read the journal',
      },
    },
  },
  { label: 'Journal', href: '/blog' },
  { label: 'About', href: '/pages/about' },
];

export const footerNav: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'Shop',
    links: [
      { label: 'New Arrivals', href: '/collections/new-arrivals' },
      { label: 'Best Sellers', href: '/collections/best-sellers' },
      { label: 'The Summer Edit', href: '/collections/summer' },
      { label: 'Sale', href: '/collections/sale' },
      { label: 'Gift Cards', href: '/products/gift-card' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact Us', href: '/pages/contact' },
      { label: 'Shipping', href: '/pages/shipping' },
      { label: 'Returns & Exchanges', href: '/pages/returns' },
      { label: 'Track Your Order', href: '/account/orders' },
      { label: 'FAQ', href: '/pages/faq' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Our Story', href: '/pages/about' },
      { label: 'Sustainability', href: '/pages/sustainability' },
      { label: 'The Journal', href: '/blog' },
      { label: 'Careers', href: '/pages/about' },
      { label: 'Store Locator', href: '/pages/contact' },
    ],
  },
  {
    heading: 'Policies',
    links: [
      { label: 'Privacy Policy', href: '/pages/privacy' },
      { label: 'Terms of Service', href: '/pages/terms' },
      { label: 'Refund Policy', href: '/pages/returns' },
      { label: 'Cookie Settings', href: '/pages/privacy' },
      { label: 'Accessibility', href: '/pages/accessibility' },
    ],
  },
];
