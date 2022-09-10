/* eslint-disable line-comment-position */
import { ChainId, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";

export const SUPPORTED_CHAIN_IDS_V1: SUPPORTED_CHAIN_ID[] = [
  ChainId.Mainnet,
  ChainId.Rinkeby,
  ChainId.Polygon,
  ChainId.Mumbai,
  ChainId.Fantom,
  ChainId.Avalanche,
];

export const SupportedChainIdToNetworkMap: Record<SUPPORTED_CHAIN_ID, string> =
  {
    [ChainId.Mainnet]: "ethereum",
    [ChainId.Rinkeby]: "rinkeby",
    [ChainId.Goerli]: "goerli",
    [ChainId.Polygon]: "polygon",
    [ChainId.Mumbai]: "mumbai",
    [ChainId.Fantom]: "fantom",
    [ChainId.FantomTestnet]: "fantom-testnet",
    [ChainId.Avalanche]: "avalanche",
    [ChainId.AvalancheFujiTestnet]: "avalanche-fuji",
    [ChainId.Optimism]: "optimism",
    [ChainId.OptimismKovan]: "optimism-kovan",
    [ChainId.OptimismGoerli]: "optimism-goerli",
    [ChainId.Arbitrum]: "arbitrum",
    [ChainId.ArbitrumRinkeby]: "arbitrum-rinkeby",
    [ChainId.ArbitrumGoerli]: "arbitrum-goerli",
    [ChainId.BinanceSmartChainMainnet]: "binance",
    [ChainId.BinanceSmartChainTestnet]: "binance-testnet",
  } as const;

export type ValueOf<T> = T[keyof T];

export const SupportedNetworkToChainIdMap: Record<
  ValueOf<typeof SupportedChainIdToNetworkMap>,
  SUPPORTED_CHAIN_ID
> = {
  ethereum: ChainId.Mainnet, // 1
  rinkeby: ChainId.Rinkeby, // 4
  goerli: ChainId.Goerli, // 5
  polygon: ChainId.Polygon, // 137
  mumbai: ChainId.Mumbai, // 80001
  fantom: ChainId.Fantom, // 250
  "fantom-testnet": ChainId.FantomTestnet, // 4002
  avalanche: ChainId.Avalanche, // 43114
  "avalanche-fuji": ChainId.AvalancheFujiTestnet, // 43113
  optimism: ChainId.Optimism, // 10
  "optimism-kovan": ChainId.OptimismKovan, // 69
  "optimism-goerli": ChainId.OptimismGoerli, // 420
  arbitrum: ChainId.Arbitrum, // 42161
  "arbitrum-rinkeby": ChainId.ArbitrumRinkeby, // 4216111
  "arbitrum-goerli": ChainId.ArbitrumGoerli, // 4216113
  binance: ChainId.BinanceSmartChainMainnet,
  "binance-testnet": ChainId.BinanceSmartChainTestnet,
} as const;

export const NetworkToBlockTimeMap: Record<SUPPORTED_CHAIN_ID, string> = {
  [ChainId.Mainnet]: "14",
  [ChainId.Rinkeby]: "14",
  [ChainId.Goerli]: "14",
  [ChainId.Polygon]: "2",
  [ChainId.Mumbai]: "2",
  [ChainId.Fantom]: "0.7",
  [ChainId.FantomTestnet]: "0.7",
  [ChainId.Avalanche]: "3",
  [ChainId.AvalancheFujiTestnet]: "3",
  [ChainId.Optimism]: "13",
  [ChainId.OptimismKovan]: "13",
  [ChainId.OptimismGoerli]: "13",
  [ChainId.Arbitrum]: "15",
  [ChainId.ArbitrumGoerli]: "15",
  [ChainId.ArbitrumRinkeby]: "15",
  [ChainId.BinanceSmartChainMainnet]: "3",
  [ChainId.BinanceSmartChainTestnet]: "3",
};

export type SupportedNetwork = keyof typeof SupportedNetworkToChainIdMap;

export function getChainIdFromNetwork(
  network?: SupportedNetwork,
): SUPPORTED_CHAIN_ID | undefined {
  if (!network || !SupportedNetworkToChainIdMap[network]) {
    return undefined;
  }

  return SupportedNetworkToChainIdMap[network];
}

export function isSupportedNetwork(network?: string): boolean {
  return network ? network in SupportedNetworkToChainIdMap : false;
}

export function getNetworkFromChainId<T extends SUPPORTED_CHAIN_ID>(
  chainId: T,
): SupportedNetwork {
  return SupportedChainIdToNetworkMap[chainId] || "";
}
