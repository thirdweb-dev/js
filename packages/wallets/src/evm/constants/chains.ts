import {
  Arbitrum as ArbitrumChain,
  ArbitrumGoerli as ArbitrumGoerliChain,
  Avalanche as AvalancheChain,
  AvalancheFuji,
  Binance,
  BinanceTestnet,
  Chain,
  Ethereum,
  Fantom as FantomChain,
  FantomTestnet as FantomTestnetChain,
  Goerli as GoerliChain,
  Mumbai as MumbaiChain,
  Optimism as OptimismChain,
  OptimismGoerli as OptimismGoerliChain,
  Polygon as PolygonChain,
} from "@thirdweb-dev/chains";

/**
 * @public
 */
export enum ChainId {
  Mainnet = 1,
  Goerli = 5,
  Polygon = 137,
  Mumbai = 80001,
  Fantom = 250,
  FantomTestnet = 4002,
  Avalanche = 43114,
  AvalancheFujiTestnet = 43113,
  Optimism = 10,
  OptimismGoerli = 420,
  Arbitrum = 42161,
  ArbitrumGoerli = 421613,
  BinanceSmartChainMainnet = 56,
  BinanceSmartChainTestnet = 97,
}

/**
 * @public
 */
export type SUPPORTED_CHAIN_ID =
  | ChainId.Mainnet
  | ChainId.Goerli
  | ChainId.Mumbai
  | ChainId.Polygon
  | ChainId.Fantom
  | ChainId.FantomTestnet
  | ChainId.Avalanche
  | ChainId.AvalancheFujiTestnet
  | ChainId.Optimism
  | ChainId.OptimismGoerli
  | ChainId.Arbitrum
  | ChainId.ArbitrumGoerli
  | ChainId.BinanceSmartChainMainnet
  | ChainId.BinanceSmartChainTestnet;

/**
 * @public
 */
export const SUPPORTED_CHAIN_IDS: SUPPORTED_CHAIN_ID[] = [
  ChainId.Mainnet,
  ChainId.Goerli,
  ChainId.Polygon,
  ChainId.Mumbai,
  ChainId.Fantom,
  ChainId.FantomTestnet,
  ChainId.Avalanche,
  ChainId.AvalancheFujiTestnet,
  ChainId.Optimism,
  ChainId.OptimismGoerli,
  ChainId.Arbitrum,
  ChainId.ArbitrumGoerli,
  ChainId.BinanceSmartChainMainnet,
  ChainId.BinanceSmartChainTestnet,
];

/**
 * @public
 */
export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const DEFAULT_API_KEY =
  "c6634ad2d97b74baf15ff556016830c251050e6c36b9da508ce3ec80095d3dc1";

function getRpcNameFromChainId(chainId: SUPPORTED_CHAIN_ID): string {
  switch (chainId) {
    case ChainId.Mainnet:
      return "mainnet";
    case ChainId.Goerli:
      return "goerli";
    case ChainId.Polygon:
      return "polygon";
    case ChainId.Mumbai:
      return "mumbai";
    case ChainId.Avalanche:
      return "avalanche";
    case ChainId.AvalancheFujiTestnet:
      return "avalanche-fuji";
    case ChainId.Fantom:
      return "fantom";
    case ChainId.FantomTestnet:
      return "fantom-testnet";
    case ChainId.Arbitrum:
      return "arbitrum";
    case ChainId.ArbitrumGoerli:
      return "arbitrum-goerli";
    case ChainId.Optimism:
      return "optimism";
    case ChainId.OptimismGoerli:
      return "optimism-goerli";
    case ChainId.BinanceSmartChainMainnet:
      return "bsc";
    case ChainId.BinanceSmartChainTestnet:
      return "bsc-testnet";
    default:
      throw new Error("Unsupported chain id");
  }
}

export function getRpcUrl(chainId: SUPPORTED_CHAIN_ID) {
  return `https://${getRpcNameFromChainId(
    chainId,
  )}.rpc.thirdweb.com/${DEFAULT_API_KEY}`;
}

export const supportedChains: Record<SUPPORTED_CHAIN_ID, Chain> = {
  [ChainId.Mainnet]: Ethereum,
  [ChainId.Goerli]: GoerliChain,
  [ChainId.Polygon]: PolygonChain,
  [ChainId.Mumbai]: MumbaiChain,
  [ChainId.Avalanche]: AvalancheChain,
  [ChainId.AvalancheFujiTestnet]: AvalancheFuji,
  [ChainId.Fantom]: FantomChain,
  [ChainId.FantomTestnet]: FantomTestnetChain,
  [ChainId.Arbitrum]: ArbitrumChain,
  [ChainId.ArbitrumGoerli]: ArbitrumGoerliChain,
  [ChainId.Optimism]: OptimismChain,
  [ChainId.OptimismGoerli]: OptimismGoerliChain,
  [ChainId.BinanceSmartChainMainnet]: Binance,
  [ChainId.BinanceSmartChainTestnet]: BinanceTestnet,
};

export const thirdwebChains: Chain[] = Object.values(supportedChains);
