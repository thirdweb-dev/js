import type { Address as ox__Address } from "ox";

export type Route = {
  originToken: {
    chainId: number;
    address: ox__Address.Address;
    decimals: number;
    symbol: string;
    name: string;
    iconUri?: string;
  };
  destinationToken: {
    chainId: number;
    address: string;
    decimals: number;
    symbol: string;
    name: string;
    iconUri?: string;
  };
};
