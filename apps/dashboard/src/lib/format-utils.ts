const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
});

export const formatTickerNumber = (value: number) => {
  return compactNumberFormatter.format(value);
};
