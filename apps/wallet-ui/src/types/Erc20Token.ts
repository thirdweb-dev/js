import type { Address } from "thirdweb";

export type Erc20Token = {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
};
