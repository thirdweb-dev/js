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
  if (currencySymbol[showBalanceInFiat]) {
    return currencySymbol[showBalanceInFiat];
  }
  return "$";
}

const currencySymbol: Record<SupportedFiatCurrency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  KRW: "₩",
  CNY: "¥",
  INR: "₹",
  NOK: "kr",
  SEK: "kr",
  CHF: "CHF",
  AUD: "$",
  CAD: "$",
  NZD: "$",
  MXN: "$",
  BRL: "R$",
  CLP: "$",
  CZK: "Kč",
  DKK: "kr",
  HKD: "$",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  ISK: "kr",
};
