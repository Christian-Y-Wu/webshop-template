/* ==========================================================================
   i18n dictionaries
   Every visible UI string flows through `t('key')`. English is the source of
   truth; other locales may be partial and fall back to English automatically.
   Add a locale by copying the `en` block and translating the values.
   ========================================================================== */

export const dictionaries = {
  en: {
    'nav.search': 'Search',
    'nav.account': 'Account',
    'nav.wishlist': 'Wishlist',
    'nav.cart': 'Cart',
    'nav.menu': 'Menu',
    'nav.shopAll': 'Shop all',

    'common.addToCart': 'Add to cart',
    'common.addToBag': 'Add to bag',
    'common.quickAdd': 'Quick add',
    'common.buyNow': 'Buy it now',
    'common.soldOut': 'Sold out',
    'common.new': 'New',
    'common.sale': 'Sale',
    'common.from': 'From',
    'common.viewAll': 'View all',
    'common.viewDetails': 'View details',
    'common.readMore': 'Read more',
    'common.learnMore': 'Learn more',
    'common.shopNow': 'Shop now',
    'common.subscribe': 'Subscribe',
    'common.close': 'Close',
    'common.loading': 'Loading',
    'common.reviews': 'reviews',
    'common.inStock': 'In stock',
    'common.lowStock': 'Low stock — order soon',
    'common.selectOptions': 'Select options',

    'cart.title': 'Your cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyBody': 'Discover something you’ll love — your next favourite is a click away.',
    'cart.subtotal': 'Subtotal',
    'cart.checkout': 'Checkout',
    'cart.viewCart': 'View cart',
    'cart.continue': 'Continue shopping',
    'cart.freeShipping': 'You’ve unlocked free shipping!',
    'cart.freeShippingAway': 'away from free shipping',
    'cart.giftWrap': 'Add gift wrapping',
    'cart.discountCode': 'Discount code',
    'cart.apply': 'Apply',
    'cart.remove': 'Remove',
    'cart.saveForLater': 'Save for later',
    'cart.recommend': 'You may also like',

    'product.addToWishlist': 'Add to wishlist',
    'product.description': 'Description',
    'product.specifications': 'Specifications',
    'product.materials': 'Materials & Care',
    'product.shipping': 'Shipping & Returns',
    'product.reviews': 'Reviews',
    'product.related': 'You may also like',
    'product.boughtTogether': 'Frequently bought together',
    'product.recentlyViewed': 'Recently viewed',
    'product.quantity': 'Quantity',
    'product.color': 'Colour',
    'product.size': 'Size',
    'product.sizeGuide': 'Size guide',
    'product.shareLabel': 'Share',
    'product.deliveryEstimate': 'Estimated delivery',

    'footer.newsletter': 'Join the list',
    'footer.newsletterBody': 'Be first to know about new arrivals, private sales and stories from the studio. Enjoy 10% off your first order.',
    'footer.emailPlaceholder': 'Enter your email',
    'footer.rights': 'All rights reserved.',

    'search.placeholder': 'Search for products, collections…',
    'search.trending': 'Trending searches',
    'search.recent': 'Recently searched',
    'search.popular': 'Popular right now',
    'search.noResults': 'No results found',
    'search.noResultsBody': 'Try a different term, or explore our best sellers below.',
    'search.results': 'Results',

    'account.login': 'Sign in',
    'account.register': 'Create account',
    'account.dashboard': 'Dashboard',
    'account.orders': 'Orders',
    'account.addresses': 'Addresses',
    'account.settings': 'Settings',
    'account.logout': 'Sign out',
  },

  da: {
    'nav.search': 'Søg',
    'nav.account': 'Konto',
    'nav.wishlist': 'Ønskeliste',
    'nav.cart': 'Kurv',
    'nav.menu': 'Menu',
    'common.addToCart': 'Læg i kurv',
    'common.addToBag': 'Læg i kurv',
    'common.quickAdd': 'Hurtig tilføj',
    'common.buyNow': 'Køb nu',
    'common.soldOut': 'Udsolgt',
    'common.shopNow': 'Shop nu',
    'common.subscribe': 'Tilmeld',
    'common.viewAll': 'Se alle',
    'cart.title': 'Din kurv',
    'cart.empty': 'Din kurv er tom',
    'cart.subtotal': 'Subtotal',
    'cart.checkout': 'Til kassen',
    'footer.emailPlaceholder': 'Indtast din e-mail',
    'search.placeholder': 'Søg efter produkter, kollektioner…',
  },

  de: {
    'nav.search': 'Suche',
    'nav.account': 'Konto',
    'nav.wishlist': 'Wunschliste',
    'nav.cart': 'Warenkorb',
    'nav.menu': 'Menü',
    'common.addToCart': 'In den Warenkorb',
    'common.addToBag': 'In den Warenkorb',
    'common.quickAdd': 'Schnell hinzufügen',
    'common.buyNow': 'Jetzt kaufen',
    'common.soldOut': 'Ausverkauft',
    'common.shopNow': 'Jetzt shoppen',
    'common.subscribe': 'Abonnieren',
    'common.viewAll': 'Alle ansehen',
    'cart.title': 'Ihr Warenkorb',
    'cart.empty': 'Ihr Warenkorb ist leer',
    'cart.subtotal': 'Zwischensumme',
    'cart.checkout': 'Zur Kasse',
    'footer.emailPlaceholder': 'E-Mail-Adresse eingeben',
    'search.placeholder': 'Produkte, Kollektionen suchen…',
  },

  fr: {
    'nav.cart': 'Panier',
    'common.addToCart': 'Ajouter au panier',
    'common.buyNow': 'Acheter',
    'common.soldOut': 'Épuisé',
    'common.shopNow': 'Acheter',
    'cart.checkout': 'Paiement',
  },

  es: {
    'nav.cart': 'Carrito',
    'common.addToCart': 'Añadir al carrito',
    'common.buyNow': 'Comprar ahora',
    'common.soldOut': 'Agotado',
    'common.shopNow': 'Comprar',
    'cart.checkout': 'Pagar',
  },
} as const;

export type Locale = keyof typeof dictionaries;
export type TranslationKey = keyof (typeof dictionaries)['en'];

export function translate(locale: string, key: TranslationKey): string {
  const dict = (dictionaries as Record<string, Partial<Record<TranslationKey, string>>>)[locale];
  return dict?.[key] ?? dictionaries.en[key] ?? key;
}
