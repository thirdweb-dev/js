const usdCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD", // prefix with $
  minimumFractionDigits: 0, // don't show decimal places if value is a whole number
  maximumFractionDigits: 2, // at max 2 decimal places
  roundingMode: "halfEven", // round to nearest even number, standard practice for financial calculations
  notation: "compact", // shows 1.2M instead of 1,200,000, 1.2B instead of 1,200,000,000
});

export const toUSD = (value: number) => {
  return usdCurrencyFormatter.format(value);
};

export const toSize = (value: number | bigint, defaultUnit?: string) => {
  if (value === 0 && defaultUnit) {
    return `${value}${defaultUnit}`;
  }

  const formatted = new Intl.NumberFormat("en", {
    notation: "compact",
    style: "unit",
    unit: "byte",
    unitDisplay: "narrow",
  }).format(value);

  // bummer: there is a bug with NumberFormat and it does not support GB
  if (formatted.endsWith("BB")) {
    return formatted.replace(/BB$/, "GB");
  }

  return formatted;
};

export const toPercent = (num1: number, num2: number) => {
  return Math.round(((num1 / num2) * 100 * 10) / 10);
};
