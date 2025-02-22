import type { Address } from "thirdweb";

export type Route = {
  originToken: {
    address: Address;
    chainId: number;
    iconUri: string;
  };
  destinationToken: {
    address: Address;
    chainId: number;
    iconUri: string;
  };
};
