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
  decimals = 5,
) {
  return (
    formatNumber(Number(balanceData.displayValue), decimals) +
    (showSymbol ? ` ${balanceData.symbol}` : "")
  );
}
