const SUPPORTED_FIAT_CURRENCIES = ["USD"] as const;
/**
 * @internal
 */
export type SupportedFiatCurrency = (typeof SUPPORTED_FIAT_CURRENCIES)[number];
