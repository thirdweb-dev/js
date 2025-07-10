import { formatNumber } from "../../../../../utils/formatNumber.js";
import { toTokens } from "../../../../../utils/units.js";

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

export function formatCurrencyAmount(currency: string, amount: number) {
  return formatMoney(amount, "en-US", currency);
}

function formatMoney(
  value: number,
  locale: string,
  currencyCode: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}
