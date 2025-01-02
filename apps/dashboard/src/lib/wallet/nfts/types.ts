import type { NFT } from "thirdweb";
import {
  arbitrum,
  arbitrumNova,
  arbitrumSepolia,
  astriaEvmDusknet,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  bsc,
  bscTestnet,
  celo,
  cronos,
  degen,
  ethereum,
  fantom,
  frameTestnet,
  gnosis,
  gnosisChiadoTestnet,
  godWoken,
  godWokenTestnetV1,
  hokumTestnet,
  linea,
  lineaSepolia,
  loot,
  mantaPacific,
  mantaPacificTestnet,
  moonbeam,
  optimism,
  optimismSepolia,
  palm,
  palmTestnet,
  polygon,
  polygonAmoy,
  polygonMumbai,
  polygonZkEvm,
  polygonZkEvmTestnet,
  rari,
  rariTestnet,
  scroll,
  scrollAlphaTestnet,
  scrollSepoliaTestnet,
  sepolia,
  xai,
  xaiSepolia,
  zkSync,
  zkSyncSepolia,
  zora,
  zoraSepolia,
} from "thirdweb/chains";

// Cannot use BigInt for the values here because it will result in error: "fail to serialize bigint"
// when the data is being sent from server to client (when we fetch the owned NFTs from simplehash/alchemy/moralis)
export type WalletNFT = Omit<NFT, "id" | "supply"> & {
  id: string;
  contractAddress: string;
  supply: string;
};

// List: https://docs.alchemy.com/reference/nft-api-faq
export const alchemySupportedChainIdsMap: Record<number, string> = {
  [ethereum.id]: "eth-mainnet",
  [sepolia.id]: "eth-sepolia",
  [polygon.id]: "polygon-mainnet",
  [polygonMumbai.id]: "polygon-mumbai",
  [optimism.id]: "opt-mainnet",
  [arbitrum.id]: "arb-mainnet",
};

// List: https://docs.moralis.io/supported-chains
const moralisSupportedChainIdsMap: Record<number, string> = {
  [ethereum.id]: "",
  [sepolia.id]: "",
  [polygon.id]: "",
  [polygonMumbai.id]: "",
  [bsc.id]: "",
  [bscTestnet.id]: "",
  [avalanche.id]: "",
  [fantom.id]: "",
  [cronos.id]: "",
  [palm.id]: "",
  [arbitrum.id]: "",
  [gnosis.id]: "",
  [gnosisChiadoTestnet.id]: "",
  [base.id]: "",
  [polygonAmoy.id]: "",
  [optimism.id]: "",
  [linea.id]: "",
  // Chiliz
  [88888]: "",
  // Chiliz testnet
  [88882]: "",
  // Holesky
  [17000]: "",
  // Pulse chain
  [369]: "",
  [moonbeam.id]: "",
  // Moonriver
  [1285]: "",
  // Moonbase Alpha
  [1287]: "",
  [blast.id]: "",
  [blastSepolia.id]: "",
  [zkSync.id]: "",
  [zkSyncSepolia.id]: "",
  // Mantle
  [5000]: "",
  // Mantle Sepolia
  [5003]: "",
  // opBNB
  [204]: "",
  [polygonZkEvm.id]: "",
  [polygonZkEvmTestnet.id]: "",
  // Zeta chain
  [7000]: "",
  // Zeta chain testnet
  [7001]: "",
  // Flow
  [747]: "",
  // Flow testnet
  [545]: "",
  // Ronin
  [2020]: "",
  // Ronin Saigon testnet
  [2021]: "",
  // Lisk
  [1135]: "",
  // Lisk Sepolia testnet
  [4202]: "",
};

// List: https://docs.simplehash.com/reference/supported-chains-testnets
export const simpleHashSupportedChainIdsMap: Record<number, string> = {
  [arbitrum.id]: "arbitrum",
  [arbitrumNova.id]: "arbitrum-nova",
  [arbitrumSepolia.id]: "arbitrum-sepolia",
  [astriaEvmDusknet.id]: "astria-devnet",
  [avalanche.id]: "avalanche",
  [avalancheFuji.id]: "avalanche-fuji",
  [base.id]: "base",
  [baseSepolia.id]: "base-sepolia",
  [bsc.id]: "bsc",
  [bscTestnet.id]: "bsc-testnet",
  [blast.id]: "blast",
  [blastSepolia.id]: "blast-sepolia",
  [celo.id]: "celo",
  [ethereum.id]: "ethereum",
  [degen.id]: "degen",
  [fantom.id]: "fantom",
  [frameTestnet.id]: "frame-testnet",
  [gnosis.id]: "gnosis",
  [godWoken.id]: "godwoken",
  [godWokenTestnetV1.id]: "godwoken-testnet",
  [hokumTestnet.id]: "hokum-testnet",
  [linea.id]: "linea",
  [lineaSepolia.id]: "linea-testnet",
  [loot.id]: "loot",
  [mantaPacific.id]: "manta",
  [mantaPacificTestnet.id]: "manta-testnet",
  [moonbeam.id]: "moonbeam",
  [polygonMumbai.id]: "polygon-mumbai",
  [optimism.id]: "optimism",
  [optimismSepolia.id]: "optimism-sepolia",
  [palm.id]: "palm",
  [palmTestnet.id]: "palm-testnet",
  [polygon.id]: "polygon",
  [polygonAmoy.id]: "polygon-amoy",
  [polygonZkEvm.id]: "polygon-zkevm",
  [polygonZkEvmTestnet.id]: "polygon-zkevm-testnet",
  [rari.id]: "rari",
  [rariTestnet.id]: "rari-testnet",
  [scroll.id]: "scroll",
  [scrollAlphaTestnet.id]: "scroll-testnet",
  [scrollSepoliaTestnet.id]: "scroll-sepolia",
  [sepolia.id]: "ethereum-sepolia",
  [xai.id]: "xai",
  [xaiSepolia.id]: "xai-sepolia",
  [zkSync.id]: "zksync-era",
  [zora.id]: "zora",
  [zoraSepolia.id]: "zora-sepolia",
  [1329]: "sei",
  [1328]: "sei-atlantic-2",
  [360]: "shape",
  [33139]: "apechain",
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
