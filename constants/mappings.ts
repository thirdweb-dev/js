import type { ContractType, Role } from "@thirdweb-dev/sdk";
import { StaticImageData } from "next/image";

export const FeatureIconMap: Record<ContractType, StaticImageData> = {
  "nft-drop": require("public/assets/tw-icons/nft-drop.png"),
  "nft-collection": require("public/assets/tw-icons/nft-collection.png"),
  "edition-drop": require("public/assets/tw-icons/edition-drop.png"),
  edition: require("public/assets/tw-icons/edition.png"),
  token: require("public/assets/tw-icons/token.png"),
  vote: require("public/assets/tw-icons/vote.png"),
  marketplace: require("public/assets/tw-icons/marketplace.png"),
  pack: require("public/assets/tw-icons/pack.png"),
  split: require("public/assets/tw-icons/split.png"),
  "token-drop": require("public/assets/tw-icons/token.png"),
  // TODO (byoc) icon for custom contract
  custom: require("public/assets/tw-icons/general.png"),
  "signature-drop": require("public/assets/tw-icons/general.png"),
  multiwrap: require("public/assets/tw-icons/general.png"),
} as const;

export const UrlMap: Record<ContractType, string> = {
  "nft-drop": "nft-drop",
  "nft-collection": "nft-collection",
  "edition-drop": "edition-drop",
  edition: "edition",
  token: "token",
  vote: "vote",
  marketplace: "marketplace",
  pack: "pack",
  split: "split",
  "token-drop": "token-drop",
  // TODO (byoc)
  custom: "",
  "signature-drop": "",
  multiwrap: "",
};

export interface BuiltinContractDetails {
  title: string;
  description: string;
  icon: StaticImageData;
  comingSoon?: boolean;
}

export const BuiltinContractMap: Record<ContractType, BuiltinContractDetails> =
  {
    "nft-drop": {
      title: "NFT Drop",
      description: "Claimable drop of one-of-one NFTs",
      icon: FeatureIconMap["nft-drop"],
    },
    "nft-collection": {
      title: "NFT Collection",
      description: "A collection of one-of-one NFTs",
      icon: FeatureIconMap["nft-collection"],
    },
    marketplace: {
      title: "Marketplace",
      description: "Your very own marketplace",
      icon: FeatureIconMap["marketplace"],
    },
    token: {
      title: "Token",
      description: "Your own ERC20 token",
      icon: FeatureIconMap["token"],
    },
    pack: {
      title: "Pack",
      description: "Randomized rewards (loot boxes)",
      icon: FeatureIconMap["pack"],

      comingSoon: true,
    },
    split: {
      title: "Split",
      description: "Fee splitting for your revenue",
      icon: FeatureIconMap["split"],
    },
    "edition-drop": {
      title: "Edition Drop",
      description: "Claimable drop of N-of-one NFTs",
      icon: FeatureIconMap["edition-drop"],
    },
    edition: {
      title: "Edition",
      description: "A collection of N-of-one NFTs",
      icon: FeatureIconMap["edition"],
    },
    vote: {
      title: "Vote",
      description: "On-chain ERC20 based voting",
      icon: FeatureIconMap["vote"],
    },
    "token-drop": {
      title: "Token Drop",
      description: "Claimable drop of ERC20 tokens",
      icon: FeatureIconMap["token-drop"],
    },
    custom: {
      title: "NOT IMPLEMENTED",
      description: "NOT IMPLEMENTED",
      icon: FeatureIconMap["token-drop"],
    },
    "signature-drop": {
      title: "Signature Drop",
      description: "Claimable drop with signature verification",
      icon: FeatureIconMap["token-drop"],
      comingSoon: true,
    },
    multiwrap: {
      title: "Multiwrap",
      description: "Bundle Tokens and NFTs together",
      icon: FeatureIconMap["token-drop"],
      comingSoon: true,
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
  "nft-drop": {
    deployContract: 785405,
    setClaimPhase: 187999,
    batchUpload: 169832,
    claim: 277449,
  },
  "edition-drop": {
    deployContract: 746515,
    setClaimPhase: 168589,
    batchUpload: 168483,
    claim: 186485,
  },
  "nft-collection": {
    deployContract: 928006,
    mint: 208102,
  },
  edition: {
    deployContract: 793195,
    mint: 160173,
  },
  marketplace: {
    deployContract: 785536,
  },
  token: {
    deployContract: 837345,
  },
  pack: {
    deployContract: 0,
  },
  split: {
    deployContract: 594540,
    distributeFunds: 153078,
  },
  vote: {
    deployContract: 454740,
  },
  "token-drop": {
    deployContract: 0,
  },
  custom: {
    deployContract: 0,
  },
  "signature-drop": {
    deployContract: 0,
  },
  multiwrap: {
    deployContract: 0,
  },
};

export const CONTRACT_TYPE_NAME_MAP: Record<ContractType, string> = {
  // drop
  "nft-drop": "NFT Drop" as const,
  "edition-drop": "Edition Drop" as const,
  "token-drop": "Token Drop" as const,
  "signature-drop": "Signature Drop" as const,

  // token
  token: "Token" as const,
  "nft-collection": "NFT Collection" as const,
  edition: "Edition" as const,
  multiwrap: "Multi Wrap" as const,

  // other
  vote: "Vote" as const,
  marketplace: "Marketplace" as const,
  pack: "Pack" as const,
  split: "Split" as const,

  custom: "Custom" as const,
} as const;

export const ROLE_DESCRIPTION_MAP: Record<Role | string, string> = {
  admin:
    "Determine who can grant or revoke roles and modify settings on this contract.",
  minter: "Determine who can create new tokens on this contract.",
  pauser:
    "Determine who can pause (and unpause) all external calls made to this contract's contract.",
  transfer: "Determine who can transfer tokens on this contract.",
  lister: "Determine who can create new listings on this contract.",
  asset: "Determine which assets can be listed on this marketplace.",
  unwrap: "Determine who can unwrap tokens on this contract.",
};

// gnosis mappings
export const GNOSIS_TO_CHAIN_ID = {
  // supported mainnets
  eth: 1,
  matic: 137,
  avax: 43114,
  // supported testnets
  rin: 4,
  gor: 5,
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
