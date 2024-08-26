import { formatNumber } from "../../../../../utils/formatNumber.js";

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
    formatNumber(Number(balanceData.displayValue), 5) +
    (showSymbol ? ` ${balanceData.symbol}` : "")
  );
}
