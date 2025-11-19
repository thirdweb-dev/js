type PublishedContractID = `${string}/${string}`;

export interface ExploreCategory {
  name: string;
  displayName?: string;
  description: string | undefined;
  learnMore?: string;
  contracts: Array<
    | PublishedContractID
    | [
        PublishedContractID,
        Array<PublishedContractID>,
        { title: string; description: string },
      ]
  >;
  isBeta?: boolean;
}

export const NFTS = {
  contracts: [
    "thirdweb.eth/LoyaltyCard",
    "doubledev.eth/ERC4907",
    "kronickatz.eth/ERC721NESDrop",
  ],
  description:
    "NFT Collections, Editions, Drops and everything else NFT-related.",
  displayName: "NFTs",
  name: "NFT",
} satisfies ExploreCategory;

export const GOVERNANCE = {
  contracts: ["thirdweb.eth/VoteERC20", "thirdweb.eth/Split"],
  description: "Create your own DAO, vote on proposals, and manage a treasury.",
  name: "DAOs & Governance",
} satisfies ExploreCategory;

export const MARKETS = {
  contracts: ["thirdweb.eth/MarketplaceV3", "thirdweb.eth/Split"],
  description: "Quickly spin up your own on-chain marketplace for NFTs.",
  displayName: "Marketplaces",
  name: "Marketplace",
} satisfies ExploreCategory;

export const AIRDROP = {
  contracts: ["thirdweb.eth/Airdrop"],
  description:
    "Efficiently transfer large numbers of on-chain assets to a large number of recipients.",
  displayName: "Airdrops",
  name: "Airdrop",
} satisfies ExploreCategory;

export const STAKING = {
  contracts: [
    "thirdweb.eth/NFTStake",
    "thirdweb.eth/EditionStake",
    "thirdweb.eth/TokenStake",
  ],
  description: "Stake your NFTs or tokens to earn ERC20 tokens in return.",
  displayName: "Staking",
  name: "Staking",
} satisfies ExploreCategory;

export const SMART_WALLET = {
  contracts: [
    "thirdweb.eth/AccountFactory",
    "thirdweb.eth/ManagedAccountFactory",
    "thirdweb.eth/AccountFactory_0_7",
    "thirdweb.eth/ManagedAccountFactory_0_7",
  ],
  description:
    "Account factories that let you spin up Account Abstraction (ERC-4337) wallets for your users. Not sure which factory is right for you?",
  displayName: "Account Abstraction",
  learnMore:
    "https://portal.thirdweb.com/wallets/smart-wallet/get-started#1-deploy-a-smart-wallet-factory-contract",
  name: "Account Abstraction",
} satisfies ExploreCategory;

export const STYLUS = {
  contracts: [
    "0x6453a486d52e0EB6E79Ec4491038E2522a926936/StylusAirdropERC1155",
    "0x6453a486d52e0EB6E79Ec4491038E2522a926936/StylusAirdropERC721",
    "0x6453a486d52e0EB6E79Ec4491038E2522a926936/StylusAirdropERC20",
    // erc721 token
    [
      "thirdweb.eth/ERC721CoreInitializable",
      [
        "0x6453a486d52e0eb6e79ec4491038e2522a926936/StylusMintableERC721",
        "deployer.thirdweb.eth/BatchMetadataERC721",
        "0x6453a486d52e0eb6e79ec4491038e2522a926936/StylusTransferableERC721",
      ],
      {
        description: "ERC721 NFTs that only owners can mint.",
        title: "Modular NFT Collection",
      },
    ],
    // erc1155 token
    [
      "thirdweb.eth/ERC1155CoreInitializable",
      [
        "0x6453a486d52e0eb6e79ec4491038e2522a926936/StylusMintableERC1155",
        "deployer.thirdweb.eth/BatchMetadataERC1155",
        "0x6453a486d52e0eb6e79ec4491038e2522a926936/StylusTransferableERC1155",
        "deployer.thirdweb.eth/SequentialTokenIdERC1155",
      ],
      {
        description: "ERC1155 NFTs that only owners can mint.",
        title: "Modular Edition",
      },
    ],
    // erc20 token
    [
      "thirdweb.eth/ERC20CoreInitializable",
      [
        "0x6453a486d52e0eb6e79ec4491038e2522a926936/StylusMintableERC20",
        "0x6453a486d52e0eb6e79ec4491038e2522a926936/StylusTransferableERC20",
      ],
      {
        description: "ERC20 Tokens that only owners can mint.",
        title: "Modular Token",
      },
    ],
  ],
  description: undefined,
  displayName: "Arbitrum Stylus",
  name: "Stylus",
  isBeta: true,
} satisfies ExploreCategory;
