import type { SupportedFiatCurrency } from "thirdweb/react";

export function isValidCurrency(
  currency: string,
): currency is SupportedFiatCurrency {
  if (currency in VALID_CURRENCIES) {
    return true;
  }
  return false;
}

const VALID_CURRENCIES: Record<SupportedFiatCurrency, true> = {
  USD: true,
  EUR: true,
  GBP: true,
  JPY: true,
  KRW: true,
  CNY: true,
  INR: true,
  NOK: true,
  SEK: true,
  CHF: true,
  AUD: true,
  CAD: true,
  NZD: true,
  MXN: true,
  BRL: true,
  CLP: true,
  CZK: true,
  DKK: true,
  HKD: true,
  HUF: true,
  IDR: true,
  ILS: true,
  ISK: true,
};
