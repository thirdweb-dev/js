const currencySymbol = {
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
} as const;

export type SupportedFiatCurrency = keyof typeof currencySymbol;

export function getFiatSymbol(showBalanceInFiat: SupportedFiatCurrency) {
  return currencySymbol[showBalanceInFiat] || "$";
}
