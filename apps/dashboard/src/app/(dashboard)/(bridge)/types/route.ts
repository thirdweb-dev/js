import type { Address } from "thirdweb";

export type Route = {
  originChainId: number;
  originTokenAddress: Address;
  destinationChainId: number;
  destinationTokenAddress: Address;
};
