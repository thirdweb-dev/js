/* eslint-disable line-comment-position */
import { ChainId, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk/evm";

export const SUPPORTED_CHAIN_IDS_V1: SUPPORTED_CHAIN_ID[] = [
  ChainId.Mainnet,
  ChainId.Polygon,
  ChainId.Mumbai,
  ChainId.Fantom,
  ChainId.Avalanche,
];

export const SupportedChainIdToNetworkMap: Record<SUPPORTED_CHAIN_ID, string> =
  {
    [ChainId.Mainnet]: "ethereum",
    [ChainId.Goerli]: "goerli",
    [ChainId.Polygon]: "polygon",
    [ChainId.Mumbai]: "mumbai",
    [ChainId.Fantom]: "fantom",
    [ChainId.FantomTestnet]: "fantom-testnet",
    [ChainId.Avalanche]: "avalanche",
    [ChainId.AvalancheFujiTestnet]: "avalanche-fuji",
    [ChainId.Optimism]: "optimism",
    [ChainId.OptimismGoerli]: "optimism-goerli",
    [ChainId.Arbitrum]: "arbitrum",
    [ChainId.ArbitrumGoerli]: "arbitrum-goerli",
    [ChainId.BinanceSmartChainMainnet]: "binance",
    [ChainId.BinanceSmartChainTestnet]: "binance-testnet",
  } as const;

export const chainIdToHumanReadable: Record<
  Exclude<SUPPORTED_CHAIN_ID, 1337 | 31337>,
  string
> = {
  1: "Ethereum",
  5: "Goerli",
  137: "Polygon",
  80001: "Mumbai",
  250: "Fantom",
  4002: "Fantom Testnet",
  43114: "Avalanche",
  43113: "Avalanche Fuji",
  10: "Optimism",
  420: "Optimism Goerli",
  42161: "Arbitrum",
  421613: "Arbitrum Goerli",
  56: "Binance Smart Chain",
  97: "Binance Smart Chain Testnet",
};

export const SupportedNetworkToChainIdMap = {
  ethereum: ChainId.Mainnet, // 1

  goerli: ChainId.Goerli, // 5
  polygon: ChainId.Polygon, // 137
  mumbai: ChainId.Mumbai, // 80001
  fantom: ChainId.Fantom, // 250
  "fantom-testnet": ChainId.FantomTestnet, // 4002
  avalanche: ChainId.Avalanche, // 43114
  "avalanche-fuji": ChainId.AvalancheFujiTestnet, // 43113
  optimism: ChainId.Optimism, // 10

  "optimism-goerli": ChainId.OptimismGoerli, // 420
  arbitrum: ChainId.Arbitrum, // 42161

  "arbitrum-goerli": ChainId.ArbitrumGoerli, // 4216113
  binance: ChainId.BinanceSmartChainMainnet,
  "binance-testnet": ChainId.BinanceSmartChainTestnet,
} as const;

export const NetworkToBlockTimeMap: Record<SUPPORTED_CHAIN_ID, string> = {
  [ChainId.Mainnet]: "14",
  [ChainId.Goerli]: "14",
  [ChainId.Polygon]: "2",
  [ChainId.Mumbai]: "2",
  [ChainId.Fantom]: "0.7",
  [ChainId.FantomTestnet]: "0.7",
  [ChainId.Avalanche]: "3",
  [ChainId.AvalancheFujiTestnet]: "3",
  [ChainId.Optimism]: "13",
  [ChainId.OptimismGoerli]: "13",
  [ChainId.Arbitrum]: "15",
  [ChainId.ArbitrumGoerli]: "15",
  [ChainId.BinanceSmartChainMainnet]: "3",
  [ChainId.BinanceSmartChainTestnet]: "3",
};
export const SupportedSolanaNetworkToUrlMap = {
  "mainnet-beta": "solana",
  devnet: "sol-devnet",
} as const;

export const SupportedSolanaUrlToNetworkMap = {
  solana: "mainnet-beta",
  "sol-devnet": "devnet",
} as const;

export type DashboardSolanaNetwork =
  keyof typeof SupportedSolanaNetworkToUrlMap;

export type SupportedNetwork =
  | keyof typeof SupportedNetworkToChainIdMap
  | DashboardSolanaNetwork;

export type DashboardChainIdMode = "evm" | "solana" | "both";

export function getChainIdFromNetworkPath(
  network?: string,
): SUPPORTED_CHAIN_ID | undefined {
  if (isSupportedEVMNetwork(network)) {
    return SupportedNetworkToChainIdMap[network];
  }
  return undefined;
}

export function getSolNetworkFromNetworkPath(
  network?: string,
): DashboardSolanaNetwork | undefined {
  if (isSupportedSOLNetwork(network)) {
    return SupportedSolanaUrlToNetworkMap[network];
  }
  return undefined;
}

export function isSupportedEVMNetwork(
  network?: string,
): network is keyof typeof SupportedNetworkToChainIdMap {
  return network ? network in SupportedNetworkToChainIdMap : false;
}

export function isSupportedSOLNetwork(
  network?: string,
): network is keyof typeof SupportedSolanaUrlToNetworkMap {
  return network ? network in SupportedSolanaUrlToNetworkMap : false;
}

function isChainIdSolanaNetwork(
  chainId: SUPPORTED_CHAIN_ID | DashboardSolanaNetwork,
): chainId is DashboardSolanaNetwork {
  if (chainId in SupportedSolanaNetworkToUrlMap) {
    return true;
  }

  return false;
}
export function isSupportedNetwork(
  network?: string,
): network is SupportedNetwork {
  return isSupportedEVMNetwork(network) || isSupportedSOLNetwork(network);
}

export function getNetworkFromChainId(
  chainId: SUPPORTED_CHAIN_ID | DashboardSolanaNetwork,
) {
  if (isChainIdSolanaNetwork(chainId)) {
    return SupportedSolanaNetworkToUrlMap[chainId];
  } else {
    return SupportedChainIdToNetworkMap[chainId] || "";
  }
}
