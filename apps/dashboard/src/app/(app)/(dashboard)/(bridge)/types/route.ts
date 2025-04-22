import type { Address } from "thirdweb";

export type Route = {
  originToken: {
    address: Address;
    chainId: number;
    iconUri?: string;
    name: string;
    symbol: string;
  };
  destinationToken: {
    address: Address;
    chainId: number;
    iconUri?: string;
    name: string;
    symbol: string;
  };
};
