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
  id: "popular",
  name: "Popular",
  description: "A collection of our most deployed contracts.",
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
} satisfies ExploreCategory;

const NFTS = {
  id: "nft",
  name: "NFT",
  displayName: "NFTs",
  description:
    "NFT Collections, Editions, Drops and everything else NFT-related.",
  contracts: [
    "thirdweb.eth/DropERC721",
    "thirdweb.eth/OpenEditionERC721",
    "thirdweb.eth/TokenERC721",
    "thirdweb.eth/DropERC1155",
    "thirdweb.eth/TokenERC1155",
    "thirdweb.eth/Pack",
    "flairsdk.eth/ERC721CommunityStream",
    "thirdweb.eth/LoyaltyCard",
    "doubledev.eth/ERC4907",
    "thirdweb.eth/Multiwrap",
    "kronickatz.eth/ERC721NESDrop",
  ],
} satisfies ExploreCategory;

const GOVERNANCE = {
  id: "daos-governance",
  name: "DAOs & Governance",
  description: "Create your own DAO, vote on proposals, and manage a treasury.",
  contracts: [
    "thirdweb.eth/VoteERC20",
    "thirdweb.eth/TokenERC20",
    "thirdweb.eth/Split",
  ],
} satisfies ExploreCategory;

const DROPS = {
  id: "drops",
  name: "Drop",
  displayName: "Drops",
  description: "Release NFTs and Tokens based on preset Claim Conditions.",
  contracts: [
    "thirdweb.eth/DropERC721",
    "thirdweb.eth/DropERC1155",
    "thirdweb.eth/DropERC20",
  ],
} satisfies ExploreCategory;

const MARKETS = {
  id: "marketplace",
  name: "Marketplace",
  displayName: "Marketplaces",
  description: "Quickly spin up your own on-chain marketplace for NFTs.",
  contracts: [
    "thirdweb.eth/MarketplaceV3",
    "thirdweb.eth/TokenERC20",
    "thirdweb.eth/Split",
  ],
} satisfies ExploreCategory;

const MODULAR_CONTRACTS = {
  id: "modular-contracts",
  name: "modular",
  displayName: "Modular Contracts",
  description:
    "Collection of highly customizable and upgradeable smart contracts built with the modular contracts framework.",
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
        title: "Modular NFT Drop",
        description: "ERC721 NFTs that anyone can mint.",
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
        title: "Modular NFT Collection",
        description: "ERC721 NFTs that only owners can mint.",
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
        title: "Modular Open Edition",
        description: "ERC721 NFTs with identical metadata.",
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
        title: "Modular Edition Drop",
        description: "ERC1155 NFTs that others can mint.",
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
        title: "Modular Edition",
        description: "ERC1155 NFTs that only owners can mint.",
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
        title: "Modular Token Drop",
        description: "ERC20 Tokens that others can mint.",
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
        title: "Modular Token",
        description: "ERC20 Tokens that only owners can mint.",
      },
    ],
  ],
} satisfies ExploreCategory;

const AIRDROP = {
  id: "airdrop",
  name: "Airdrop",
  displayName: "Airdrops",
  description:
    "Efficiently transfer large numbers of on-chain assets to a large number of recipients.",
  contracts: ["thirdweb.eth/Airdrop"],
} satisfies ExploreCategory;

const GAMING = {
  id: "gaming",
  name: "Gaming",
  displayName: "Gaming",
  description:
    "A collection of contracts that are popular for building play-to-earn and free-to-own web3 games.",
  contracts: [
    "thirdweb.eth/MarketplaceV3",
    "thirdweb.eth/DropERC721",
    "thirdweb.eth/TokenERC20",
    "thirdweb.eth/TokenERC1155",
    "thirdweb.eth/Multiwrap",
    "thirdweb.eth/Pack",
    "thirdweb.eth/NFTStake",
  ],
  showInExplore: false,
} satisfies ExploreCategory;

const LOYALTY = {
  id: "loyalty",
  name: "Loyalty",
  displayName: "Loyalty",
  description:
    "A collection of contracts that are popular for building loyalty programs.",
  contracts: [
    "thirdweb.eth/LoyaltyCard",
    "thirdweb.eth/MarketplaceV3",
    "thirdweb.eth/TokenERC20",
  ],
  showInExplore: false,
} satisfies ExploreCategory;

const COMMERCE = {
  id: "commerce",
  name: "Commerce",
  displayName: "Commerce",
  description:
    "Most popular contracts for building web3 commerce apps. Reward loyal customers and sell NFTs through your storefront.",
  contracts: [
    "thirdweb.eth/TokenERC721",
    "thirdweb.eth/TokenERC1155",
    "thirdweb.eth/TokenERC20",
    "thirdweb.eth/Split",
  ],
  showInExplore: false,
} satisfies ExploreCategory;

const STAKING = {
  id: "staking",
  name: "Staking",
  displayName: "Staking",
  description: "Stake your NFTs or tokens to earn ERC20 tokens in return.",
  contracts: [
    "thirdweb.eth/NFTStake",
    "thirdweb.eth/EditionStake",
    "thirdweb.eth/TokenStake",
  ],
  showInExplore: true,
} satisfies ExploreCategory;

const SMART_WALLET = {
  id: "smart-wallet",
  name: "Account Abstraction",
  displayName: "Account Abstraction",
  description:
    "Account factories that let you spin up Account Abstraction (ERC-4337) wallets for your users. Not sure which factory is right for you?",
  learnMore:
    "https://portal.thirdweb.com/wallets/smart-wallet/get-started#1-deploy-a-smart-wallet-factory-contract",
  contracts: [
    "thirdweb.eth/AccountFactory",
    "thirdweb.eth/ManagedAccountFactory",
    "thirdweb.eth/AccountFactory_0_7",
    "thirdweb.eth/ManagedAccountFactory_0_7",
  ],
  showInExplore: true,
} satisfies ExploreCategory;

const CATEGORIES: Record<string, ExploreCategory> = {
  [POPULAR.id]: POPULAR,
  [MODULAR_CONTRACTS.id]: MODULAR_CONTRACTS,
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
