import type { Address as ox__Address } from "ox";

export type Token = {
  chainId: number;
  address: ox__Address.Address;
  decimals: number;
  symbol: string;
  name: string;
  iconUri?: string;
};

export type TokenWithPrices = Token & {
  prices: Record<string, number>;
};
