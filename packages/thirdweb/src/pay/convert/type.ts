const SUPPORTED_FIAT_CURRENCIES = [
  "USD",
  "CAD",
  "GBP",
  "EUR",
  "JPY",
  "AUD",
  "NZD",
] as const;
/**
 * @internal
 */
export type SupportedFiatCurrency = (typeof SUPPORTED_FIAT_CURRENCIES)[number];

export function getFiatSymbol(showBalanceInFiat: SupportedFiatCurrency) {
  switch (showBalanceInFiat) {
    case "USD":
      return "$";
    case "CAD":
      return "$";
    case "GBP":
      return "£";
    case "EUR":
      return "€";
    case "JPY":
      return "¥";
    case "AUD":
      return "$";
    case "NZD":
      return "$";
    default:
      return "$";
  }
}
