/**
 * @internal
 * @param balanceData
 * @returns
 */
export function formatTokenBalance(
  balanceData: {
    symbol: string;
    name: string;
    decimals: number;
    displayValue: string;
  },
  showSymbol = true,
) {
  return (
    Number(balanceData.displayValue).toFixed(3) +
    (showSymbol ? ` ${balanceData.symbol}` : "")
  );
}
