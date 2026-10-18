/**
 * Display helpers.
 *
 * Prices live as integer cents everywhere else in the app; they only become
 * strings here. Change CURRENCY and LOCALE in one place to re-denominate the
 * whole storefront.
 */

const CURRENCY = "USD";
const LOCALE = "en-US";

const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
});

export function formatPrice(cents: number): string {
  return priceFormatter.format(cents / 100);
}

/** e.g. 29900 -> 24900 becomes "17% off" */
export function discountLabel(priceCents: number, compareAtCents: number): string {
  const off = Math.round(((compareAtCents - priceCents) / compareAtCents) * 100);
  return `${off}% off`;
}
