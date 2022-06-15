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
    [ChainId.OptimismTestnet]: "optimism-testnet",
    [ChainId.Arbitrum]: "arbitrum",
    [ChainId.ArbitrumTestnet]: "arbitrum-testnet",
  } as const;

export type ValueOf<T> = T[keyof T];

export const SupportedNetworkToChainIdMap: Record<
  ValueOf<typeof SupportedChainIdToNetworkMap>,
  SUPPORTED_CHAIN_ID
> = {
  ethereum: ChainId.Mainnet,
  rinkeby: ChainId.Rinkeby,
  goerli: ChainId.Goerli,
  polygon: ChainId.Polygon,
  mumbai: ChainId.Mumbai,
  fantom: ChainId.Fantom,
  "fantom-testnet": ChainId.FantomTestnet,
  avalanche: ChainId.Avalanche,
  "avalanche-fuji": ChainId.AvalancheFujiTestnet,
  optimism: ChainId.Optimism,
  "optimism-testnet": ChainId.OptimismTestnet,
  arbitrum: ChainId.Arbitrum,
  "arbitrum-testnet": ChainId.ArbitrumTestnet,
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
  [ChainId.OptimismTestnet]: "13",
  [ChainId.Arbitrum]: "15",
  [ChainId.ArbitrumTestnet]: "15",
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
