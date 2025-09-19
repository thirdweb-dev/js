export function cleanedChainName(name: string) {
  return name.replace("Mainnet", "");
}

export const tokenAmountFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 5,
  minimumFractionDigits: 2,
});
