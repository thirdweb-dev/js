import type { Chain } from "thirdweb/chains";
import type { Address } from "thirdweb/utils";

export type X402PlaygroundOptions = {
  chain: Chain;
  tokenAddress: Address;
  tokenSymbol: string;
  tokenDecimals: number;
  amount: string;
  payTo: Address;
};
