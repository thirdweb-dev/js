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
// when the data is being sent from server to client (when we fetch the owned NFTs from insight/alchemy/moralis)
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
  [moonbeam.id]: "",
  // Flow testnet
  545: "",
  // Flow
  747: "",
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
  [sepolia.id]: "",
  // opBNB
  204: "",
  // Pulse chain
  369: "",
  [blast.id]: "",
  [blastSepolia.id]: "",
  [zkSync.id]: "",
  [zkSyncSepolia.id]: "",
  [polygonMumbai.id]: "",
  [polygonZkEvm.id]: "",
  [polygonZkEvmTestnet.id]: "",
  [ethereum.id]: "",
  [bsc.id]: "",
  // Lisk
  1135: "",
  [polygon.id]: "",
  // Moonriver
  1285: "",
  // Moonbase Alpha
  1287: "",
  // Ronin
  2020: "",
  // Ronin Saigon testnet
  2021: "",
  // Lisk Sepolia testnet
  4202: "",
  // Mantle
  5000: "",
  // Mantle Sepolia
  5003: "",
  // Zeta chain
  7000: "",
  // Zeta chain testnet
  7001: "",
  // Holesky
  17000: "",
  // Chiliz testnet
  88882: "",
  // Chiliz
  88888: "",
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
