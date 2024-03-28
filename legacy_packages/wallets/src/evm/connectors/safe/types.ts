import type { Chain } from "@thirdweb-dev/chains";
import { EVMWallet } from "../../interfaces";

export interface SafeConnectionArgs {
  safeAddress: string;
  personalWallet: EVMWallet;
  chain: Pick<Chain, "chainId" | "rpc">;
}

// Base Sepolia ( 84532 ) Not added yet because we don't know the safe transaction service host ( it's missing in the above page )

export type SafeSupportedChains =
  // ethereum
  | 1
  // polygon
  | 137
  // bsc
  | 56
  // arbitrum
  | 42161
  // aurora
  | 1313161554
  // avalanche
  | 43114
  // optimism
  | 10
  // celo
  | 42220
  // gnosis chain
  | 100
  // Sepolia
  | 11155111
  // base mainnet
  | 8453
  // Polygon zkEVM
  | 1101
  // zkSync Mainnet
  | 324;
