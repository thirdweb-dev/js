import type { NFT } from "@thirdweb-dev/sdk";
import {
  Arbitrum,
  ArbitrumGoerli,
  ArbitrumNova,
  ArbitrumSepolia,
  Avalanche,
  AvalancheFuji,
  Base,
  BaseGoerli,
  BaseSepoliaTestnet,
  Binance,
  BinanceTestnet,
  Celo,
  Cronos,
  Ethereum,
  Fantom,
  FrameTestnet,
  Gnosis,
  GnosisChiadoTestnet,
  Godwoken,
  GodwokenTestnetV1,
  Goerli,
  Linea,
  MantaPacific,
  MantaPacificTestnet,
  Moonbeam,
  Mumbai,
  Optimism,
  OptimismGoerli,
  Palm,
  PalmTestnet,
  Polygon,
  PolygonZkevm,
  PolygonZkevmTestnet,
  Scroll,
  ScrollAlphaTestnet,
  ScrollSepoliaTestnet,
  Sepolia,
  Zksync,
  ZksyncEraGoerliTestnetDeprecated,
  Zora,
  ZoraSepoliaTestnet,
  ZoraTestnet,
} from "@thirdweb-dev/chains";

export type WalletNFT = NFT & {
  contractAddress: string;
  tokenId: string;
};

// List: https://docs.alchemy.com/reference/nft-api-faq
export const alchemySupportedChainIdsMap: Record<number, string> = {
  [Ethereum.chainId]: "eth-mainnet",
  [Goerli.chainId]: "eth-goerli",
  [Sepolia.chainId]: "eth-sepolia",
  [Polygon.chainId]: "polygon-mainnet",
  [Mumbai.chainId]: "polygon-mumbai",
  [Optimism.chainId]: "opt-mainnet",
  [OptimismGoerli.chainId]: "opt-goerli",
  [Arbitrum.chainId]: "arb-mainnet",
  [ArbitrumGoerli.chainId]: "arb-goerli",
};

// List: https://docs.moralis.io/supported-chains
const moralisSupportedChainIdsMap: Record<number, string> = {
  [Ethereum.chainId]: "",
  [Goerli.chainId]: "",
  [Sepolia.chainId]: "",
  [Polygon.chainId]: "",
  [Mumbai.chainId]: "",
  [Binance.chainId]: "",
  [BinanceTestnet.chainId]: "",
  [Avalanche.chainId]: "",
  [Fantom.chainId]: "",
  [Cronos.chainId]: "",
  [Palm.chainId]: "",
  [Arbitrum.chainId]: "",
  [Gnosis.chainId]: "",
  [GnosisChiadoTestnet.chainId]: "",
  [Base.chainId]: "",
  [BaseGoerli.chainId]: "",
};

// List: https://docs.simplehash.com/reference/supported-chains-testnets
export const simpleHashSupportedChainIdsMap: Record<number, string> = {
  [Ethereum.chainId]: "ethereum",
  [Goerli.chainId]: "ethereum-goerli",
  [Polygon.chainId]: "polygon",
  [Mumbai.chainId]: "polygon-mumbai",
  [Binance.chainId]: "bsc",
  [BinanceTestnet.chainId]: "bsc-testnet",
  [Avalanche.chainId]: "avalanche",
  [AvalancheFuji.chainId]: "avalanche-fuji",
  [Optimism.chainId]: "optimism",
  [OptimismGoerli.chainId]: "optimism-goerli",
  [Arbitrum.chainId]: "arbitrum",
  [ArbitrumGoerli.chainId]: "arbitrum-goerli",
  [ArbitrumNova.chainId]: "arbitrum-nova",
  [Base.chainId]: "base",
  [BaseGoerli.chainId]: "base-goerli",
  [Gnosis.chainId]: "gnosis",
  [Godwoken.chainId]: "godwoken",
  [Palm.chainId]: "palm",
  [PolygonZkevm.chainId]: "polygon-zkevm",
  [Zksync.chainId]: "zksync-era",
  [Zora.chainId]: "zora",
  [Sepolia.chainId]: "ethereum-sepolia",
  [GodwokenTestnetV1.chainId]: "godwoken-testnet",
  [MantaPacificTestnet.chainId]: "manta-testnet",
  [PalmTestnet.chainId]: "palm-testnet",
  [PolygonZkevmTestnet.chainId]: "polygon-zkevm-testnet",
  [ScrollAlphaTestnet.chainId]: "scroll-testnet",
  [ScrollSepoliaTestnet.chainId]: "scroll-sepolia",
  [ZksyncEraGoerliTestnetDeprecated.chainId]: "zksync-era-testnet",
  [ZoraTestnet.chainId]: "zora-testnet",
  [Celo.chainId]: "celo",
  [Linea.chainId]: "linea",
  [MantaPacific.chainId]: "manta",
  [Moonbeam.chainId]: "moonbeam",
  [Scroll.chainId]: "scroll",
  [ArbitrumSepolia.chainId]: "arbitrum-sepolia",
  [BaseSepoliaTestnet.chainId]: "base-sepolia",
  [FrameTestnet.chainId]: "frame-testnet",
  [ZoraSepoliaTestnet.chainId]: "zora-sepolia",
};

export type AlchemySupportedChainId = keyof typeof alchemySupportedChainIdsMap;
export type MoralisSupportedChainId = keyof typeof moralisSupportedChainIdsMap;
export type SimpleHashSupportedChainId =
  keyof typeof simpleHashSupportedChainIdsMap;

export const alchemySupportedChainIds = Object.keys(
  alchemySupportedChainIdsMap,
);

export const moralisSupportedChainIds = Object.keys(
  moralisSupportedChainIdsMap,
);

export const simpleHashSupportedNetworks = Object.keys(
  simpleHashSupportedChainIdsMap,
);

export interface GenerateURLParams {
  chainId: number;
  owner: string;
}
