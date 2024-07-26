import type { Chain } from "thirdweb";
import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  ethereum,
  fantom,
  fantomTestnet,
  type hardhat,
  localhost,
  optimism,
  optimismSepolia,
  polygon,
  sepolia,
} from "thirdweb/chains";

// TODO: move to API
export const OPSponsoredChains = [
  // Optimism
  10,
  // Base
  8453,
  // Zora
  7777777,
  // Mode
  34443,
  // Frax
  252,
  // Cyber
  7560,
  // Redstone
  690,
];

export const defaultChains: Chain[] = [
  ethereum,
  sepolia,
  base,
  baseSepolia,
  polygon,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  bsc,
  bscTestnet,
  fantom,
  fantomTestnet,
  avalanche,
  avalancheFuji,
  localhost,
];

export type SUPPORTED_CHAIN_ID =
  | typeof ethereum.id
  | typeof polygon.id
  | typeof fantom.id
  | typeof fantomTestnet.id
  | typeof avalanche.id
  | typeof avalancheFuji.id
  | typeof optimism.id
  | typeof arbitrum.id
  | typeof bsc.id
  | typeof bscTestnet.id
  | typeof hardhat.id
  | typeof localhost.id;
