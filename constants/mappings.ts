import {
  ChainId,
  ContractType,
  Edition,
  EditionDrop,
  Marketplace,
  NFTCollection,
  NFTDrop,
  Pack,
  Role,
  SmartContract,
  Split,
  Token,
  TokenDrop,
  Vote,
} from "@thirdweb-dev/sdk";
import { StaticImageData } from "next/image";

export const FeatureIconMap: Record<ContractType, StaticImageData> = {
  [NFTDrop.contractType]: require("public/assets/tw-icons/drop.png"),
  [NFTCollection.contractType]: require("public/assets/tw-icons/nft-collection.png"),
  [EditionDrop.contractType]: require("public/assets/tw-icons/edition-drop.png"),
  [Edition.contractType]: require("public/assets/tw-icons/edition.png"),
  [Token.contractType]: require("public/assets/tw-icons/token.png"),
  [Vote.contractType]: require("public/assets/tw-icons/vote.png"),
  [Marketplace.contractType]: require("public/assets/tw-icons/marketplace.png"),
  [Pack.contractType]: require("public/assets/tw-icons/pack.png"),
  [Split.contractType]: require("public/assets/tw-icons/splits.png"),
  [TokenDrop.contractType]: require("public/assets/tw-icons/token.png"),
  // TODO (byoc) icon for custom contract
  [SmartContract.contractType]: require("public/assets/tw-icons/general.png"),
};

export const UrlMap: Record<ContractType, string> = {
  [NFTDrop.contractType]: "nft-drop",
  [NFTCollection.contractType]: "nft-collection",
  [EditionDrop.contractType]: "edition-drop",
  [Edition.contractType]: "edition",
  [Token.contractType]: "token",
  [Vote.contractType]: "vote",
  [Marketplace.contractType]: "marketplace",
  [Pack.contractType]: "pack",
  [Split.contractType]: "split",
  [TokenDrop.contractType]: "token-drop",
  // TODO (byoc)
  [SmartContract.contractType]: "",
};

export interface BuiltinContractDetails {
  title: string;
  description: string;
  icon: StaticImageData;
  abi?: unknown;
  bytecode?: string;
  comingSoon?: boolean;
}

export const BuiltinContractMap: Record<ContractType, BuiltinContractDetails> =
  {
    [NFTDrop.contractType]: {
      title: "NFT Drop",
      description: "Claimable drop of one-of-one NFTs",
      icon: FeatureIconMap[NFTDrop.contractType],
      abi: NFTDrop.contractAbi,
    },
    [NFTCollection.contractType]: {
      title: "NFT Collection",
      description: "A collection of one-of-one NFTs",
      icon: FeatureIconMap[NFTCollection.contractType],
      abi: NFTCollection.contractAbi,
    },
    [Marketplace.contractType]: {
      title: "Marketplace",
      description: "Your very own marketplace",
      icon: FeatureIconMap[Marketplace.contractType],
      abi: Marketplace.contractAbi,
    },
    [Token.contractType]: {
      title: "Token",
      description: "Your own ERC20 token",
      icon: FeatureIconMap[Token.contractType],
      abi: Token.contractAbi,
    },
    [Pack.contractType]: {
      title: "Pack",
      description: "Randomized rewards (loot boxes)",
      icon: FeatureIconMap[Pack.contractType],
      abi: Pack.contractAbi,
      comingSoon: true,
    },
    [Split.contractType]: {
      title: "Split",
      description: "Fee splitting for your revenue",
      icon: FeatureIconMap[Split.contractType],
      abi: Split.contractAbi,
    },
    [EditionDrop.contractType]: {
      title: "Edition Drop",
      description: "Claimable drop of N-of-one NFTs",
      icon: FeatureIconMap[EditionDrop.contractType],
      abi: EditionDrop.contractAbi,
    },
    [Edition.contractType]: {
      title: "Edition",
      description: "A collection of N-of-one NFTs",
      icon: FeatureIconMap[Edition.contractType],
      abi: Edition.contractAbi,
    },
    [Vote.contractType]: {
      title: "Vote",
      description: "On-chain ERC20 based voting",
      icon: FeatureIconMap[Vote.contractType],
      abi: Vote.contractAbi,
    },
    [TokenDrop.contractType]: {
      title: "Token Drop",
      description: "Claimable drop of ERC20 tokens",
      icon: FeatureIconMap[TokenDrop.contractType],
      abi: TokenDrop.contractAbi,
    },
    [SmartContract.contractType]: {
      title: "NOT IMPLEMENTED",
      description: "NOT IMPLEMENTED",
      icon: FeatureIconMap[TokenDrop.contractType],
    },
  };

export interface GasPrice {
  deployContract: number;
  setClaimPhase?: number;
  batchUpload?: number;
  mint?: number;
  claim?: number;
  distributeFunds?: number;
}

export const GasEstimatorMap: Record<ContractType, GasPrice> = {
  [NFTDrop.contractType]: {
    deployContract: 785405,
    setClaimPhase: 187999,
    batchUpload: 169832,
    claim: 277449,
  },
  [EditionDrop.contractType]: {
    deployContract: 746515,
    setClaimPhase: 168589,
    batchUpload: 168483,
    claim: 186485,
  },
  [NFTCollection.contractType]: {
    deployContract: 928006,
    mint: 208102,
  },
  [Edition.contractType]: {
    deployContract: 793195,
    mint: 160173,
  },
  [Marketplace.contractType]: {
    deployContract: 785536,
  },
  [Token.contractType]: {
    deployContract: 837345,
  },
  [Pack.contractType]: {
    deployContract: 0,
  },
  [Split.contractType]: {
    deployContract: 594540,
    distributeFunds: 153078,
  },
  [Vote.contractType]: {
    deployContract: 454740,
  },
  [TokenDrop.contractType]: {
    deployContract: 0,
  },
  [SmartContract.contractType]: {
    deployContract: 0,
  },
};

export const CONTRACT_TYPE_NAME_MAP = {
  // drop
  [NFTDrop.contractType]: "NFT Drop" as const,
  [EditionDrop.contractType]: "Edition Drop" as const,
  [TokenDrop.contractType]: "Token Drop" as const,

  // token
  [Token.contractType]: "Token" as const,
  [NFTCollection.contractType]: "NFT Collection" as const,
  [Edition.contractType]: "Edition" as const,

  // other
  [Vote.contractType]: "Vote" as const,
  [Marketplace.contractType]: "Marketplace" as const,
  [Pack.contractType]: "Pack" as const,
  [Split.contractType]: "Split" as const,

  [SmartContract.contractType]: "Custom" as const,
} as const;

export const ROLE_DESCRIPTION_MAP: Record<Role, string> = {
  admin:
    "Determine who can grant or revoke roles and modify settings on this contract.",
  minter: "Determine who can create new tokens on this contract.",
  pauser:
    "Determine who can pause (and unpause) all external calls made to this contract's contract.",
  transfer: "Determine who can transfer tokens on this contract.",
  lister: "Determine who can create new listings on this contract.",
  editor: "NOT IMPLEMENTED",
  asset: "Determine which assets can be listed on this marketplace.",
};

// gnosis mappings
export const GNOSIS_TO_CHAIN_ID = {
  // supported mainnets
  eth: ChainId.Mainnet,
  matic: ChainId.Polygon,
  avax: ChainId.Avalanche,
  // supported testnets
  rin: ChainId.Rinkeby,
  gor: ChainId.Goerli,
} as const;

export const CHAIN_ID_TO_GNOSIS = Object.entries(GNOSIS_TO_CHAIN_ID).reduce(
  (acc, [gnosis, chainId]) => ({
    ...acc,
    [chainId]: gnosis,
  }),
  {} as Record<
    typeof GNOSIS_TO_CHAIN_ID[keyof typeof GNOSIS_TO_CHAIN_ID],
    keyof typeof GNOSIS_TO_CHAIN_ID
  >,
);
