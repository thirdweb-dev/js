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
  zora,
  zoraSepolia,
} from "thirdweb/chains";

type NFT = {
  metadata: {
    name?: string;
    description?: string;
    image?: string | null;
    animation_url?: string | null;
    external_url?: string | null;
    background_color?: string;
    properties?: Record<string, unknown> | Array<Record<string, unknown>>;
  } & Record<string, unknown>;
  owner: string;
  type: "ERC1155" | "ERC721";
  supply: string;
  quantityOwned?: string;
};

export type WalletNFT = NFT & {
  contractAddress: string;
  tokenId: string;
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
