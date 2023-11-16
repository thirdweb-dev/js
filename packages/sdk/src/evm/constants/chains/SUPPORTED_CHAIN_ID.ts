import { ChainId } from "./ChainId";

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
  | ChainId.ArbitrumSepolia
  | ChainId.BinanceSmartChainMainnet
  | ChainId.BinanceSmartChainTestnet
  | ChainId.Hardhat
  | ChainId.Localhost;
