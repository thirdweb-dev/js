const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
});

export const formatTickerNumber = (value: number) => {
  return compactNumberFormatter.format(value);
};

export const formatWalletType = (walletType: string) => {
  return walletType.toLowerCase().includes("inapp") ||
    walletType.toLowerCase().includes("embedded")
    ? "in-app"
    : walletType.toLowerCase().includes("metamask")
      ? "metamask"
      : walletType.toLowerCase().includes("coinbase")
        ? "coinbase"
        : walletType.toLowerCase();
};
