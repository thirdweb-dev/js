export type OnrampCountryToken = {
  chainId: number;
  address: string;
  symbol: string;
};

export type OnrampCountryDetails = {
  code: string;
  name: string;
  currencies: string[];
  tokens: OnrampCountryToken[];
};

export type OnrampCountrySupport = {
  provider: "stripe" | "coinbase" | "transak";
  supportedCountries: OnrampCountryDetails[];
};
