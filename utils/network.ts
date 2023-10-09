/* eslint-disable line-comment-position */
import { ChainId, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";

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

  "arbitrum-goerli": ChainId.ArbitrumGoerli, // 421613
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
  // Temporary placeholders for now
  [ChainId.Localhost]: "1",
  [ChainId.Hardhat]: "1",
};

export type SupportedNetwork = keyof typeof SupportedNetworkToChainIdMap;
