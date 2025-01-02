export const formatTickerNumber = (value: number) => {
  if (value >= 1000000) {
    const millions = value / 1000000;
    // Only show decimal if not a whole number, up to 2 decimals with no trailing zeros
    return `${millions % 1 === 0 ? millions.toFixed(0) : Number(millions.toFixed(2)).toString()}M`;
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    // Only show decimal if not a whole number
    return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}k`;
  }
  return value.toString();
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
