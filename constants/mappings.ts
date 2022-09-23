import {
  CONTRACTS_MAP,
  ContractType,
  FullPublishMetadata,
  Role,
  SUPPORTED_CHAIN_ID,
} from "@thirdweb-dev/sdk";
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
  "signature-drop": require("public/assets/tw-icons/nft-drop.png"),
  multiwrap: require("public/assets/tw-icons/edition.png"),
} as const;

export interface BuiltinContractDetails {
  id: string;
  title: string;
  description: string;
  icon: StaticImageData;
  href: string;
  comingSoon?: boolean;
  contractType: ContractType;
  sourceUrl: string;
  erc?: "ERC721" | "ERC20" | "ERC1155" | "ERC721A";
  audit?: string;
  roles?: readonly Role[];
  ecosytem: "evm" | "solana";
  metadata: Omit<FullPublishMetadata, "logo"> & { logo: StaticImageData };
}

export const DisabledChainsMap: Record<ContractType, SUPPORTED_CHAIN_ID[]> = {
  "nft-drop": [],
  "nft-collection": [],
  "edition-drop": [],
  edition: [],
  token: [],
  vote: [],
  marketplace: [],
  pack: [],
  split: [],
  "token-drop": [],
  "signature-drop": [],
  multiwrap: [],
  custom: [],
};
function buildContractForContractMap(
  type: ContractType,
  details: Omit<
    BuiltinContractDetails,
    "id" | "contractType" | "roles" | "metadata" | "icon"
  >,
): BuiltinContractDetails {
  const icon = FeatureIconMap[type];
  const sdkData = CONTRACTS_MAP[type];
  return {
    ...details,
    id: sdkData.name,
    contractType: sdkData.contractType,
    roles: sdkData.roles,
    icon,

    metadata: {
      name: details.title,
      description: details.description,
      logo: icon,
      version: "2.0.0",
      bytecodeUri: "",
      metadataUri: "",
      audit: details.audit,
      publisher: "deployer.thirdweb.eth",
    },
  };
}

export const BuiltinContractMap: Record<ContractType, BuiltinContractDetails> =
  {
    "nft-drop": buildContractForContractMap("nft-drop", {
      title: "NFT Drop",
      description: "One NFT, one owner",
      erc: "ERC721",
      audit: "ipfs://QmNgNaLwzgMxcx9r6qDvJmTFam6xxUxX7Vp8E99oRt7i74",
      sourceUrl:
        "https://raw.githubusercontent.com/thirdweb-dev/contracts/v3.1.3/contracts/drop/DropERC721.sol",
      ecosytem: "evm",
      href: "/contracts/new/pre-built/drop/nft-drop",
    }),
    "signature-drop": buildContractForContractMap("signature-drop", {
      title: "Signature Drop",
      description: "ERC721A NFTs that other people can claim",
      erc: "ERC721A",
      audit: "ipfs://QmWfueeKQrggrVQNjWkF4sYJECp56vNnuAXCPVecFFKz2j",
      sourceUrl:
        "https://raw.githubusercontent.com/thirdweb-dev/contracts/v3.1.3/contracts/signature-drop/SignatureDrop.sol",
      ecosytem: "evm",
      href: "/contracts/new/pre-built/drop/signature-drop",
    }),
    marketplace: buildContractForContractMap("marketplace", {
      title: "Marketplace",
      description: "Marketplace for ERC721/ERC1155 NFTs",
      audit: "ipfs://QmNgNaLwzgMxcx9r6qDvJmTFam6xxUxX7Vp8E99oRt7i74",
      sourceUrl:
        "https://raw.githubusercontent.com/thirdweb-dev/contracts/v3.1.3/contracts/marketplace/Marketplace.sol",
      ecosytem: "evm",
      href: "/contracts/new/pre-built/marketplace/marketplace",
    }),
    "edition-drop": buildContractForContractMap("edition-drop", {
      title: "Edition Drop",
      description: "One NFT, multiple owners",
      erc: "ERC1155",
      audit: "ipfs://QmWfueeKQrggrVQNjWkF4sYJECp56vNnuAXCPVecFFKz2j",
      sourceUrl:
        "https://raw.githubusercontent.com/thirdweb-dev/contracts/v3.1.3/contracts/drop/DropERC1155.sol",
      ecosytem: "evm",
      href: "/contracts/new/pre-built/drop/edition-drop",
    }),
    multiwrap: buildContractForContractMap("multiwrap", {
      title: "Multiwrap",
      description:
        "Bundle multiple ERC721/ERC1155/ERC20 tokens into a single ERC721",
      erc: "ERC721",
      audit: "ipfs://QmWfueeKQrggrVQNjWkF4sYJECp56vNnuAXCPVecFFKz2j",
      sourceUrl:
        "https://raw.githubusercontent.com/thirdweb-dev/contracts/v3.1.3/contracts/multiwrap/Multiwrap.sol",
      ecosytem: "evm",
      href: "/contracts/new/pre-built/token/multiwrap",
    }),
    token: buildContractForContractMap("token", {
      title: "Token",
      description: "ERC20 token",
      erc: "ERC20",
      sourceUrl:
        "https://raw.githubusercontent.com/thirdweb-dev/contracts/v3.1.3/contracts/token/TokenERC20.sol",
      ecosytem: "evm",
      href: "/contracts/new/pre-built/token/token",
    }),
    edition: buildContractForContractMap("edition", {
      title: "Edition",
      description: "ERC1155 mintable NFTs",
      erc: "ERC1155",
      sourceUrl:
        "https://raw.githubusercontent.com/thirdweb-dev/contracts/v3.1.3/contracts/token/TokenERC1155.sol",
      ecosytem: "evm",
      href: "/contracts/new/pre-built/token/edition",
    }),
    "token-drop": buildContractForContractMap("token-drop", {
      title: "Token Drop",
      description: "ERC20 token that you can sell for other tokens",
      erc: "ERC20",
      sourceUrl:
        "https://raw.githubusercontent.com/thirdweb-dev/contracts/v3.1.3/contracts/drop/DropERC20.sol",
      ecosytem: "evm",
      href: "/contracts/new/pre-built/drop/token-drop",
    }),
    split: buildContractForContractMap("split", {
      title: "Split",
      description: "Fee splitting for your primary sales and royalties",
      sourceUrl:
        "https://raw.githubusercontent.com/thirdweb-dev/contracts/v3.1.3/contracts/Split.sol",
      ecosytem: "evm",
      href: "/contracts/new/pre-built/governance/split",
    }),
    "nft-collection": buildContractForContractMap("nft-collection", {
      title: "NFT Collection",
      description: "ERC721 mintable NFTs",
      erc: "ERC721",
      sourceUrl:
        "https://raw.githubusercontent.com/thirdweb-dev/contracts/v3.1.3/contracts/token/TokenERC721.sol",
      ecosytem: "evm",
      href: "/contracts/new/pre-built/token/nft-collection",
    }),
    vote: buildContractForContractMap("vote", {
      title: "Vote",
      description: "On-chain ERC20-based voting",
      sourceUrl:
        "https://raw.githubusercontent.com/thirdweb-dev/contracts/v3.1.3/contracts/vote/VoteERC20.sol",
      ecosytem: "evm",
      href: "/contracts/new/pre-built/governance/vote",
    }),
    pack: buildContractForContractMap("pack", {
      title: "Pack",
      description:
        "Bundle ERC721/ERC1155/ERC20 into a single token, with lootbox mechanics",
      erc: "ERC1155",
      sourceUrl:
        "https://raw.githubusercontent.com/thirdweb-dev/contracts/v3.1.3/contracts/pack/Pack.sol",
      ecosytem: "evm",
      href: "/contracts/new/pre-built/token/pack",
    }),
    custom: buildContractForContractMap("custom", {
      title: "NOT IMPLEMENTED",
      description: "NOT IMPLEMENTED",
      sourceUrl: "NOT IMPLEMENTED",
      ecosytem: "evm",
      href: "/contracts",
    }),
  };

interface ContractDeployMap {
  drop: BuiltinContractDetails[];
  token: BuiltinContractDetails[];
  marketplace: BuiltinContractDetails[];
  governance: BuiltinContractDetails[];
}

export const TYPE_CONTRACT_MAP: ContractDeployMap = {
  drop: [
    BuiltinContractMap["nft-drop"],
    BuiltinContractMap["edition-drop"],
    BuiltinContractMap["token-drop"],
    BuiltinContractMap["signature-drop"],
  ],
  token: [
    BuiltinContractMap["token"],
    BuiltinContractMap["nft-collection"],
    BuiltinContractMap["edition"],
    BuiltinContractMap["multiwrap"],
    BuiltinContractMap["pack"],
  ],
  marketplace: [BuiltinContractMap["marketplace"]],
  governance: [BuiltinContractMap["vote"], BuiltinContractMap["split"]],
};

export interface GasPrice {
  deployContract: number;
  setClaimPhase?: number;
  batchUpload?: number;
  mint?: number;
  claim?: number;
  claim5?: number;
  distributeFunds?: number;
}

export const GasEstimatorMap: Record<ContractType, GasPrice> = {
  "signature-drop": {
    deployContract: 800735,
    setClaimPhase: 143139,
    batchUpload: 169832,
    claim: 174604,
    claim5: 182572,
  },
  "nft-drop": {
    deployContract: 785405,
    setClaimPhase: 187999,
    batchUpload: 169832,
    claim: 277449,
    claim5: 745113,
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
  multiwrap: "Multiwrap" as const,

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
  minter: "Determine who can mint / create new tokens on this contract.",
  pauser:
    "Determine who can pause (and unpause) all external calls made to this contract's contract.",
  transfer: "Determine who can transfer tokens on this contract.",
  lister: "Determine who can create new listings on this contract.",
  asset: "Determine which assets can be used on this contract.",
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
