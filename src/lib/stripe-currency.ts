/** Currencies Stripe expects as a whole integer, with no *100 multiplier. */
const ZERO_DECIMAL_CURRENCIES = new Set([
  'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf',
]);

export function isZeroDecimalCurrency(code: string) {
  return ZERO_DECIMAL_CURRENCIES.has(code.toLowerCase());
}

/** Convert a base-currency amount (e.g. dollars) to Stripe's smallest unit. */
export function toStripeAmount(amount: number, currencyCode: string) {
  return Math.round(isZeroDecimalCurrency(currencyCode) ? amount : amount * 100);
}

/** Convert a Stripe amount (smallest unit) back to a base-currency amount. */
export function fromStripeAmount(amount: number, currencyCode: string) {
  return isZeroDecimalCurrency(currencyCode) ? amount : amount / 100;
}
