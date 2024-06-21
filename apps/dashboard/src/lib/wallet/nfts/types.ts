import {
  Arbitrum,
  ArbitrumGoerli,
  ArbitrumNova,
  ArbitrumSepolia,
  AstriaEvmDusknet,
  Avalanche,
  AvalancheFuji,
  Base,
  BaseGoerli,
  BaseSepoliaTestnet,
  Binance,
  BinanceTestnet,
  BlastBlastmainnet,
  BlastSepoliaTestnet,
  Celo,
  Cronos,
  DegenChain,
  Ethereum,
  Fantom,
  FrameTestnet,
  Gnosis,
  GnosisChiadoTestnet,
  Godwoken,
  GodwokenTestnetV1,
  Goerli,
  HokumTestnet,
  Linea,
  LineaSepolia,
  LootChain,
  MantaPacific,
  MantaPacificTestnet,
  Moonbeam,
  Mumbai,
  Optimism,
  OptimismGoerli,
  Palm,
  PalmTestnet,
  Polygon,
  PolygonAmoyTestnet,
  PolygonZkevm,
  PolygonZkevmTestnet,
  Rari,
  RarichainTestnet,
  Scroll,
  ScrollAlphaTestnet,
  ScrollSepoliaTestnet,
  Sepolia,
  Xai,
  XaiSepolia,
  Zksync,
  ZksyncEraGoerliTestnetDeprecated,
  Zora,
  ZoraSepoliaTestnet,
  ZoraTestnet,
} from "@thirdweb-dev/chains";
import type { NFT } from "@thirdweb-dev/sdk";
import { optimismSepolia } from "thirdweb/chains";

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
  [Arbitrum.chainId]: "arbitrum",
  [ArbitrumGoerli.chainId]: "arbitrum-goerli",
  [ArbitrumNova.chainId]: "arbitrum-nova",
  [ArbitrumSepolia.chainId]: "arbitrum-sepolia",
  [AstriaEvmDusknet.chainId]: "astria-devnet",
  [Avalanche.chainId]: "avalanche",
  [AvalancheFuji.chainId]: "avalanche-fuji",
  [Base.chainId]: "base",
  [BaseGoerli.chainId]: "base-goerli",
  [BaseSepoliaTestnet.chainId]: "base-sepolia",
  [Binance.chainId]: "bsc",
  [BinanceTestnet.chainId]: "bsc-testnet",
  [BlastBlastmainnet.chainId]: "blast",
  [BlastSepoliaTestnet.chainId]: "blast-sepolia",
  [Celo.chainId]: "celo",
  [Ethereum.chainId]: "ethereum",
  [DegenChain.chainId]: "degen",
  [Fantom.chainId]: "fantom",
  [FrameTestnet.chainId]: "frame-testnet",
  [Gnosis.chainId]: "gnosis",
  [Godwoken.chainId]: "godwoken",
  [GodwokenTestnetV1.chainId]: "godwoken-testnet",
  [Goerli.chainId]: "ethereum-goerli",
  [HokumTestnet.chainId]: "hokum-testnet",
  [Linea.chainId]: "linea",
  [LineaSepolia.chainId]: "linea-testnet",
  [LootChain.chainId]: "loot",
  [MantaPacific.chainId]: "manta",
  [MantaPacificTestnet.chainId]: "manta-testnet",
  [Moonbeam.chainId]: "moonbeam",
  [Mumbai.chainId]: "polygon-mumbai",
  [Optimism.chainId]: "optimism",
  [OptimismGoerli.chainId]: "optimism-goerli",
  [optimismSepolia.id]: "optimism-sepolia",
  [Palm.chainId]: "palm",
  [PalmTestnet.chainId]: "palm-testnet",
  [Polygon.chainId]: "polygon",
  [PolygonAmoyTestnet.chainId]: "polygon-amoy",
  [PolygonZkevm.chainId]: "polygon-zkevm",
  [PolygonZkevmTestnet.chainId]: "polygon-zkevm-testnet",
  [Rari.chainId]: "rari",
  [RarichainTestnet.chainId]: "rari-testnet",
  [Scroll.chainId]: "scroll",
  [ScrollAlphaTestnet.chainId]: "scroll-testnet",
  [ScrollSepoliaTestnet.chainId]: "scroll-sepolia",
  [Sepolia.chainId]: "ethereum-sepolia",
  [Xai.chainId]: "xai",
  [XaiSepolia.chainId]: "xai-sepolia",
  [Zksync.chainId]: "zksync-era",
  [ZksyncEraGoerliTestnetDeprecated.chainId]: "zksync-era-testnet",
  [Zora.chainId]: "zora",
  [ZoraSepoliaTestnet.chainId]: "zora-sepolia",
  [ZoraTestnet.chainId]: "zora-testnet",
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
