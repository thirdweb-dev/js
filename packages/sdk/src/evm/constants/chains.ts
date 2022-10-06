/**
 * @public
 */
export enum ChainId {
  Mainnet = 1,
  Goerli = 5,
  Polygon = 137,
  Mumbai = 80001,
  Harmony = 1666600000,
  Localhost = 1337,
  Hardhat = 31337,
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
