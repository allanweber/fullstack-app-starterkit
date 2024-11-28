export const shortDate = new Intl.DateTimeFormat(navigator.language, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export const DEFAULT_CURRENCY = 'EUR';
export const currencyFormatter = new Intl.NumberFormat(navigator.language, {
  style: 'currency',
  currency: DEFAULT_CURRENCY,
});
