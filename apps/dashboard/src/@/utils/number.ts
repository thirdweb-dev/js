const usdCurrencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
  notation: "compact",
  roundingMode: "halfEven",
  style: "currency",
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
