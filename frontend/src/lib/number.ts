type CurrencyFormatterOptions = {
  digits?: number;
  thousandsSeparator?: string;
  decimalSeparator?: string;
  symbol?: string;
};

const defaultOptions: CurrencyFormatterOptions = {
  digits: 2,
  thousandsSeparator: ".",
  decimalSeparator: ",",
  symbol: "$",
};

export const currencyFormatter = (value: number | undefined, currency: string) => {
  const options = { ...defaultOptions, symbol: getSymbol(currency) };
  const formatted = numberFormat(value, options);

  return `${options.symbol} ${formatted}`;
};

export const percentFormatter = (value: number | undefined) => {
  let valueFormatted;
  if (value) {
    valueFormatted = numberFormat(value * 100, defaultOptions);
  } else {
    valueFormatted = numberFormat(0, defaultOptions);
  }
  return `${valueFormatted} %`;
};

export const numberFormatter = (value: number | undefined) => {
  return numberFormat(value, defaultOptions);
};

export const numberFormat = (value: number | undefined, options: CurrencyFormatterOptions) => {
  if (value === undefined) {
    value = 0;
  }
  if (typeof value !== "number") {
    value = Number(value);
  }

  options = { ...defaultOptions, ...options };
  const fixed = value.toFixed(options.digits);

  const [currency, decimal] = fixed.split(".");

  const thousandsSeparator = options.thousandsSeparator ?? ".";

  return `${currency.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)}${
    options.decimalSeparator
  }${decimal}`;
};

const getSymbol = (currency: string) => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    default:
      return currency;
  }
};
