import {
  ChainId,
  ContractType,
  CustomContract,
  Edition,
  EditionDrop,
  Marketplace,
  NFTCollection,
  NFTDrop,
  Pack,
  Role,
  Split,
  Token,
  TokenDrop,
  Vote,
} from "@thirdweb-dev/sdk";
import * as CSS from "csstype";
import { StaticImageData } from "next/image";

export const FeatureIconMap: Record<ContractType, StaticImageData> = {
  [NFTDrop.contractType]: require("public/assets/tw-icons/drop.png"),
  [NFTCollection.contractType]: require("public/assets/tw-icons/nft-collection.png"),
  [EditionDrop.contractType]: require("public/assets/tw-icons/drop.png"),
  [Edition.contractType]: require("public/assets/tw-icons/edition.png"),
  [Token.contractType]: require("public/assets/tw-icons/token.png"),
  [Vote.contractType]: require("public/assets/tw-icons/vote.png"),
  [Marketplace.contractType]: require("public/assets/tw-icons/marketplace.png"),
  [Pack.contractType]: require("public/assets/tw-icons/pack.png"),
  [Split.contractType]: require("public/assets/tw-icons/splits.png"),
  [TokenDrop.contractType]: require("public/assets/tw-icons/token.png"),
  // TODO (byoc) icon for custom contract
  [CustomContract.contractType]: require("public/assets/tw-icons/general.png"),
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
  [CustomContract.contractType]: "",
};

interface BuiltinContractDetails {
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
    },
    [NFTCollection.contractType]: {
      title: "NFT Collection",
      description: "A collection of one-of-one NFTs",
      icon: FeatureIconMap[NFTCollection.contractType],
    },
    [Marketplace.contractType]: {
      title: "Marketplace",
      description: "Your very own marketplace",
      icon: FeatureIconMap[Marketplace.contractType],
    },
    [Token.contractType]: {
      title: "Token",
      description: "Your own ERC20 token",
      icon: FeatureIconMap[Token.contractType],
    },
    [Pack.contractType]: {
      title: "Pack",
      description: "Randomized rewards (loot boxes)",
      icon: FeatureIconMap[Pack.contractType],
      comingSoon: true,
    },
    [Split.contractType]: {
      title: "Split",
      description: "Fee splitting for your revenue",
      icon: FeatureIconMap[Split.contractType],
    },
    [EditionDrop.contractType]: {
      title: "Edition Drop",
      description: "Claimable drop of N-of-one NFTs",
      icon: FeatureIconMap[EditionDrop.contractType],
    },
    [Edition.contractType]: {
      title: "Edition",
      description: "A collection of N-of-one NFTs",
      icon: FeatureIconMap[Edition.contractType],
    },
    [Vote.contractType]: {
      title: "Vote",
      description: "ERC20 based voting",
      icon: FeatureIconMap[Vote.contractType],
    },
    [TokenDrop.contractType]: {
      title: "Token Drop",
      description: "Claimable drop of ERC20 tokens",
      icon: FeatureIconMap[TokenDrop.contractType],
      comingSoon: true,
    },

    [CustomContract.contractType]: {
      title: "NOT IMPLEMENTED",
      description: "NOT IMPLEMENTED",
      icon: FeatureIconMap[TokenDrop.contractType],
    },
  };

interface FeatureCard {
  title: string;
  description: string;
  icon: StaticImageData;
  bg: string;
  gradientBg?: {
    url: StaticImageData;
    position: string;
    blendMode: CSS.Property.MixBlendMode;
  };
}

export const FeatureCardMap: Record<ContractType, FeatureCard> = {
  [NFTDrop.contractType]: {
    title: "Drops",
    description: "Timed drops for users to easily claim NFTs and other tokens",
    icon: FeatureIconMap[NFTDrop.contractType],
    bg: "#400B31",
    gradientBg: {
      url: require("public/assets/gradient-drops.png"),
      position: "bottom right",
      blendMode: "overlay" as CSS.Property.MixBlendMode,
    },
  },
  [NFTCollection.contractType]: {
    title: "NFTs",
    description:
      "Collections or one-of-a-kind tokens with fully customizable properties",
    icon: FeatureIconMap[NFTCollection.contractType],
    bg: "linear-gradient(130.03deg, #00304B 27.17%, #4B0012 85.87%)",
    gradientBg: {
      url: require("public/assets/gradient-airdrops.png"),
      position: "top left",
      blendMode: "normal",
    },
  },
  [Marketplace.contractType]: {
    title: "Marketplaces",
    description: "Your own marketplaces to let users buy and sell any tokens",
    icon: FeatureIconMap[Marketplace.contractType],
    bg: "linear-gradient(180deg, #01044C 0%, #571B1B 72.43%)",
  },
  [Token.contractType]: {
    title: "Tokens",
    description:
      "Custom social tokens, governance tokens, and currencies that you control",
    icon: FeatureIconMap[Token.contractType],
    bg: "linear-gradient(180deg, #271571 0%, #2C142A 100%)",
    gradientBg: {
      url: require("public/assets/gradient-currency.png"),
      position: "bottom right",
      blendMode: "normal",
    },
  },
  [Pack.contractType]: {
    title: "Packs",
    description: `Loot boxes full of NFTs with rarity-based unboxing mechanics`,
    icon: FeatureIconMap[Pack.contractType],
    bg: "#25004B",
    gradientBg: {
      url: require("public/assets/gradient-packs.png"),
      position: "bottom right",
      blendMode: "normal",
    },
  },
  [Split.contractType]: {
    title: "Splits",
    description: "Custom royalty splits to easily manage your revenue",
    icon: FeatureIconMap[Split.contractType],
    bg: "#2E1328",
    gradientBg: {
      url: require("public/assets/gradient-splits.png"),
      position: "bottom right",
      blendMode: "screen",
    },
  },

  // below is unused so far but added for completeness
  [EditionDrop.contractType]: {
    title: "Edition Drop",
    description: "NOT IMPLEMENTED",
    icon: FeatureIconMap[EditionDrop.contractType],
    bg: "#400B31",
  },
  [Edition.contractType]: {
    title: "Edition",
    description: "NOT IMPLEMENTED",
    icon: FeatureIconMap[Edition.contractType],
    bg: "#400B31",
  },
  [Vote.contractType]: {
    title: "Vote",
    description: "NOT IMPLEMENTED",
    icon: FeatureIconMap[Vote.contractType],
    bg: "#400B31",
  },
  [TokenDrop.contractType]: {
    title: "Token Drop",
    description: "NOT IMPLEMENTED",
    icon: FeatureIconMap[TokenDrop.contractType],
    bg: "#400B31",
  },

  [CustomContract.contractType]: {
    title: "NOT IMPLEMENTED",
    description: "NOT IMPLEMENTED",
    icon: FeatureIconMap[TokenDrop.contractType],
    bg: "#400B31",
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
  [CustomContract.contractType]: {
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

  [CustomContract.contractType]: "Custom" as const,
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
