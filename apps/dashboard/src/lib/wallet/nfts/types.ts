import type { NFT } from "thirdweb";
import {
  arbitrum,
  avalanche,
  base,
  blast,
  blastSepolia,
  bsc,
  bscTestnet,
  cronos,
  ethereum,
  fantom,
  gnosis,
  gnosisChiadoTestnet,
  linea,
  moonbeam,
  optimism,
  palm,
  polygon,
  polygonAmoy,
  polygonMumbai,
  polygonZkEvm,
  polygonZkEvmTestnet,
  sepolia,
  zkSync,
  zkSyncSepolia,
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

export type AlchemySupportedChainId = keyof typeof alchemySupportedChainIdsMap;
export type MoralisSupportedChainId = keyof typeof moralisSupportedChainIdsMap;

export const alchemySupportedChainIds = Object.keys(
  alchemySupportedChainIdsMap,
);

export const moralisSupportedChainIds = Object.keys(
  moralisSupportedChainIdsMap,
);

export interface GenerateURLParams {
  chainId: number;
  owner: string;
}
