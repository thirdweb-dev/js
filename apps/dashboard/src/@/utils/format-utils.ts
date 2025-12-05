const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export const formatTickerNumber = (value: number) => {
  return compactNumberFormatter.format(value);
};
