export const toUSD = (value: number) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const toSize = (value: number) => {
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

export const toNumber = (value: number) => {
  return new Intl.NumberFormat(undefined).format(value);
};

export const toPercent = (num1: number, num2: number) => {
  return Math.round(((num1 / num2) * 100 * 10) / 10);
};
