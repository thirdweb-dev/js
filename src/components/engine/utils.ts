export const prettyPrintCurrency = ({
  amount,
  symbol,
}: {
  amount?: string | number;
  symbol: string;
}): string => {
  const amountNumber =
    typeof amount === "string" ? parseFloat(amount) : amount ?? 0;
  return `${amountNumber.toFixed(6)} ${symbol}`;
};
