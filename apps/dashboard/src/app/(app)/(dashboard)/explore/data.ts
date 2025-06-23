type PublishedContractID = `${string}/${string}`;

export interface ExploreCategory {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  learnMore?: string;
  contracts:
    | Array<PublishedContractID>
    | Array<
        [
          PublishedContractID,
          Array<PublishedContractID>,
          { title: string; description: string },
        ]
      >;
  showInExplore?: boolean;
  isBeta?: boolean;
}

const POPULAR = {
  contracts: [
    "thirdweb.eth/DropERC721",
    "thirdweb.eth/MarketplaceV3",
    "thirdweb.eth/AccountFactory",
    "0xaF3202F6bAEbA50d37e0d4B0b870455EDF198D7c/BurnMintERC677",
    "thirdweb.eth/DropERC1155",
    "thirdweb.eth/TokenERC20",
    "thirdweb.eth/NFTStake",
    "unlock-protocol.eth/PublicLock",
  ],
  description: "A collection of our most deployed contracts.",
  id: "popular",
  name: "Popular",
} satisfies ExploreCategory;

const NFTS = {
  contracts: [
    "thirdweb.eth/DropERC721",
    "thirdweb.eth/OpenEditionERC721",
    "thirdweb.eth/TokenERC721",
    "thirdweb.eth/DropERC1155",
    "thirdweb.eth/TokenERC1155",
    "flairsdk.eth/ERC721CommunityStream",
    "thirdweb.eth/LoyaltyCard",
    "doubledev.eth/ERC4907",
    "thirdweb.eth/Multiwrap",
    "kronickatz.eth/ERC721NESDrop",
  ],
  description:
    "NFT Collections, Editions, Drops and everything else NFT-related.",
  displayName: "NFTs",
  id: "nft",
  name: "NFT",
} satisfies ExploreCategory;

const GOVERNANCE = {
  contracts: [
    "thirdweb.eth/VoteERC20",
    "thirdweb.eth/TokenERC20",
    "thirdweb.eth/Split",
  ],
  description: "Create your own DAO, vote on proposals, and manage a treasury.",
  id: "daos-governance",
  name: "DAOs & Governance",
} satisfies ExploreCategory;

const DROPS = {
  contracts: [
    "thirdweb.eth/DropERC721",
    "thirdweb.eth/DropERC1155",
    "thirdweb.eth/DropERC20",
  ],
  description: "Release NFTs and Tokens based on preset Claim Conditions.",
  displayName: "Drops",
  id: "drops",
  name: "Drop",
} satisfies ExploreCategory;

const MARKETS = {
  contracts: [
    "thirdweb.eth/MarketplaceV3",
    "thirdweb.eth/TokenERC20",
    "thirdweb.eth/Split",
  ],
  description: "Quickly spin up your own on-chain marketplace for NFTs.",
  displayName: "Marketplaces",
  id: "marketplace",
  name: "Marketplace",
} satisfies ExploreCategory;

const MODULAR_CONTRACTS = {
  contracts: [
    // erc721 drop
    [
      "thirdweb.eth/ERC721CoreInitializable",
      [
        "deployer.thirdweb.eth/ClaimableERC721",
        "deployer.thirdweb.eth/BatchMetadataERC721",
        "deployer.thirdweb.eth/RoyaltyERC721",
      ],
      {
        description: "ERC721 NFTs that anyone can mint.",
        title: "Modular NFT Drop",
      },
    ],
    // erc721 token
    [
      "thirdweb.eth/ERC721CoreInitializable",
      [
        "deployer.thirdweb.eth/MintableERC721",
        "deployer.thirdweb.eth/BatchMetadataERC721",
        "deployer.thirdweb.eth/TransferableERC721",
      ],
      {
        description: "ERC721 NFTs that only owners can mint.",
        title: "Modular NFT Collection",
      },
    ],
    // open edition 721
    [
      "thirdweb.eth/ERC721CoreInitializable",
      [
        "deployer.thirdweb.eth/ClaimableERC721",
        "deployer.thirdweb.eth/OpenEditionMetadataERC721",
        "deployer.thirdweb.eth/RoyaltyERC721",
      ],
      {
        description: "ERC721 NFTs with identical metadata.",
        title: "Modular Open Edition",
      },
    ],
    // erc1155 drop
    [
      "thirdweb.eth/ERC1155CoreInitializable",
      [
        "deployer.thirdweb.eth/ClaimableERC1155",
        "deployer.thirdweb.eth/BatchMetadataERC1155",
        "deployer.thirdweb.eth/RoyaltyERC1155",
        "deployer.thirdweb.eth/SequentialTokenIdERC1155",
      ],
      {
        description: "ERC1155 NFTs that others can mint.",
        title: "Modular Edition Drop",
      },
    ],
    // erc1155 token
    [
      "thirdweb.eth/ERC1155CoreInitializable",
      [
        "deployer.thirdweb.eth/MintableERC1155",
        "deployer.thirdweb.eth/BatchMetadataERC1155",
        "deployer.thirdweb.eth/TransferableERC1155",
        "deployer.thirdweb.eth/SequentialTokenIdERC1155",
      ],
      {
        description: "ERC1155 NFTs that only owners can mint.",
        title: "Modular Edition",
      },
    ],
    // erc20 drop
    [
      "thirdweb.eth/ERC20CoreInitializable",
      [
        "deployer.thirdweb.eth/ClaimableERC20",
        "deployer.thirdweb.eth/TransferableERC20",
      ],
      {
        description: "ERC20 Tokens that others can mint.",
        title: "Modular Token Drop",
      },
    ],
    // erc20 token
    [
      "thirdweb.eth/ERC20CoreInitializable",
      [
        "deployer.thirdweb.eth/MintableERC20",
        "deployer.thirdweb.eth/TransferableERC20",
      ],
      {
        description: "ERC20 Tokens that only owners can mint.",
        title: "Modular Token",
      },
    ],
  ],
  description:
    "Collection of highly customizable and upgradeable smart contracts built with the modular contracts framework.",
  displayName: "Modular Contracts",
  id: "modular-contracts",
  name: "modular",
} satisfies ExploreCategory;

const SUPERCHAIN = {
  contracts: [
    // erc20 token + superchain
    [
      "thirdweb.eth/ERC20CoreInitializable",
      [
        "deployer.thirdweb.eth/MintableERC20",
        "deployer.thirdweb.eth/TransferableERC20",
        "deployer.thirdweb.eth/SuperChainInterop",
      ],
      {
        description: "ERC20 Tokens that only owners can mint.",
        title: "Modular Superchain Token",
      },
    ],
    // erc20 drop + superchain
    [
      "thirdweb.eth/ERC20CoreInitializable",
      [
        "deployer.thirdweb.eth/ClaimableERC20",
        "deployer.thirdweb.eth/TransferableERC20",
        "deployer.thirdweb.eth/SuperChainInterop",
      ],
      {
        description: "ERC20 Tokens that others can mint.",
        title: "Modular Superchain Token Drop",
      },
    ],
  ],
  description: "Modular contracts with OP Superchain support",
  displayName: "Modular Superchain Contracts",
  id: "modular-superchain-contracts",
  isBeta: true,
  name: "Modular Superchain Contracts",
  showInExplore: true,
} satisfies ExploreCategory;

const AIRDROP = {
  contracts: ["thirdweb.eth/Airdrop"],
  description:
    "Efficiently transfer large numbers of on-chain assets to a large number of recipients.",
  displayName: "Airdrops",
  id: "airdrop",
  name: "Airdrop",
} satisfies ExploreCategory;

const GAMING = {
  contracts: [
    "thirdweb.eth/MarketplaceV3",
    "thirdweb.eth/DropERC721",
    "thirdweb.eth/TokenERC20",
    "thirdweb.eth/TokenERC1155",
    "thirdweb.eth/Multiwrap",
    "thirdweb.eth/NFTStake",
  ],
  description:
    "A collection of contracts that are popular for building play-to-earn and free-to-own web3 games.",
  displayName: "Gaming",
  id: "gaming",
  name: "Gaming",
  showInExplore: false,
} satisfies ExploreCategory;

const LOYALTY = {
  contracts: [
    "thirdweb.eth/LoyaltyCard",
    "thirdweb.eth/MarketplaceV3",
    "thirdweb.eth/TokenERC20",
  ],
  description:
    "A collection of contracts that are popular for building loyalty programs.",
  displayName: "Loyalty",
  id: "loyalty",
  name: "Loyalty",
  showInExplore: false,
} satisfies ExploreCategory;

const COMMERCE = {
  contracts: [
    "thirdweb.eth/TokenERC721",
    "thirdweb.eth/TokenERC1155",
    "thirdweb.eth/TokenERC20",
    "thirdweb.eth/Split",
  ],
  description:
    "Most popular contracts for building web3 commerce apps. Reward loyal customers and sell NFTs through your storefront.",
  displayName: "Commerce",
  id: "commerce",
  name: "Commerce",
  showInExplore: false,
} satisfies ExploreCategory;

const STAKING = {
  contracts: [
    "thirdweb.eth/NFTStake",
    "thirdweb.eth/EditionStake",
    "thirdweb.eth/TokenStake",
  ],
  description: "Stake your NFTs or tokens to earn ERC20 tokens in return.",
  displayName: "Staking",
  id: "staking",
  name: "Staking",
  showInExplore: true,
} satisfies ExploreCategory;

const SMART_WALLET = {
  contracts: [
    "thirdweb.eth/AccountFactory",
    "thirdweb.eth/ManagedAccountFactory",
    "thirdweb.eth/AccountFactory_0_7",
    "thirdweb.eth/ManagedAccountFactory_0_7",
  ],
  description:
    "Account factories that let you spin up Account Abstraction (ERC-4337) wallets for your users. Not sure which factory is right for you?",
  displayName: "Account Abstraction",
  id: "smart-wallet",
  learnMore:
    "https://portal.thirdweb.com/wallets/smart-wallet/get-started#1-deploy-a-smart-wallet-factory-contract",
  name: "Account Abstraction",
  showInExplore: true,
} satisfies ExploreCategory;

const CATEGORIES: Record<string, ExploreCategory> = {
  [POPULAR.id]: POPULAR,
  [MODULAR_CONTRACTS.id]: MODULAR_CONTRACTS,
  [SUPERCHAIN.id]: SUPERCHAIN,
  [NFTS.id]: NFTS,
  [MARKETS.id]: MARKETS,
  [DROPS.id]: DROPS,
  [SMART_WALLET.id]: SMART_WALLET,
  [AIRDROP.id]: AIRDROP,
  [GAMING.id]: GAMING,
  [LOYALTY.id]: LOYALTY,
  [COMMERCE.id]: COMMERCE,
  [STAKING.id]: STAKING,
  [GOVERNANCE.id]: GOVERNANCE,
};

export function getCategory(id: string) {
  if (isExploreCategory(id)) {
    return CATEGORIES[id];
  }
  return null;
}

type ExploreCategoryName = keyof typeof CATEGORIES;

function isExploreCategory(category: string): category is ExploreCategoryName {
  return category in CATEGORIES;
}

export const EXPLORE_PAGE_DATA = Object.values(CATEGORIES).filter((v) =>
  "showInExplore" in v ? v.showInExplore !== false : true,
);
