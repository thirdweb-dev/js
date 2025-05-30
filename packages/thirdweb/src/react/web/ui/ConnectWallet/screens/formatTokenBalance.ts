import { formatNumber } from "../../../../../utils/formatNumber.js";
import { toTokens } from "../../../../../utils/units.js";
import { getCurrencyMeta } from "./Buy/fiat/currencies.js";

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

export function formatTokenAmount(
  amount: bigint,
  decimals: number,
  decimalsToShow = 5,
) {
  return formatNumber(
    Number.parseFloat(toTokens(amount, decimals)),
    decimalsToShow,
  ).toString();
}

export function formatCurrencyAmount(
  currency: string,
  amount: number,
  decimals = 2,
) {
  const symbol = getCurrencyMeta(currency).symbol;
  return `${symbol}${formatNumber(amount, decimals).toFixed(decimals)}`;
}
