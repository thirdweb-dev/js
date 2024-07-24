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
