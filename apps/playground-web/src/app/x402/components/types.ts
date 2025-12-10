import type { Chain } from "thirdweb/chains";
import type { Address } from "thirdweb/utils";

export type X402PlaygroundOptions = {
  chain: Chain;
  tokenAddress: Address;
  tokenSymbol: string;
  tokenDecimals: number;
  amount: string;
  payTo: Address;
  waitUntil: "simulated" | "submitted" | "confirmed";
  scheme: "exact" | "upto";
  minAmount: string;
};
