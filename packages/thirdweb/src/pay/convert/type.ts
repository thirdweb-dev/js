const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "KRW",
  "CNY",
  "INR",
  "NOK",
  "SEK",
  "CHF",
  "AUD",
  "CAD",
  "NZD",
  "MXN",
  "BRL",
  "CLP",
  "CZK",
  "DKK",
  "HKD",
  "HUF",
  "IDR",
  "ILS",
  "ISK",
] as const;

export type SupportedFiatCurrency = (typeof CURRENCIES)[number] | (string & {});

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
