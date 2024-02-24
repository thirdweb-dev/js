import type { QueryClient } from "@tanstack/react-query";
import { publishedContractQuery } from "components/explore/contract-card";

export type PublishedContractID = `${string}/${string}`;

export interface ExploreCategory {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  learnMore?: string;
  contracts: Readonly<PublishedContractID[]>;
  showInExplore?: boolean;
}

const POPULAR = {
  id: "popular",
  name: "Popular",
  description: "A collection of our most deployed contracts.",
  contracts: [
    "thirdweb.eth/DropERC721",
    "thirdweb.eth/MarketplaceV3",
    "thirdweb.eth/AccountFactory",
    "thirdweb.eth/DropERC1155",
    "thirdweb.eth/TokenERC20",
    "thirdweb.eth/NFTStake",
    "unlock-protocol.eth/PublicLock",
  ],
} as const;
const NFTS = {
  id: "nft",
  name: "NFT",
  displayName: "NFTs",
  description:
    "NFT Collections, Editions, Drops and everything else NFT-related.",
  contracts: [
    "thirdweb.eth/LoyaltyCard",
    "doubledev.eth/ERC4907",
    "thirdweb.eth/TokenERC721",
    "thirdweb.eth/TokenERC1155",
    "thirdweb.eth/Pack",
    "thirdweb.eth/OpenEditionERC721",
    "flairsdk.eth/ERC721CommunityStream",
    "thirdweb.eth/DropERC721",
    "thirdweb.eth/DropERC1155",
    "thirdweb.eth/Multiwrap",
    "kronickatz.eth/ERC721NESDrop",
  ],
} as const;

const GOVERNANCE = {
  id: "daos-governance",
  name: "DAOs & Governance",
  description: "Create your own DAO, vote on proposals, and manage a treasury.",
  contracts: [
    "thirdweb.eth/VoteERC20",
    "thirdweb.eth/TokenERC20",
    "thirdweb.eth/Split",
  ],
} as const;

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
} as const;

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
} as const;

const AIRDROP = {
  id: "airdrop",
  name: "Airdrop",
  displayName: "Airdrops",
  description:
    "Efficiently transfer large numbers of on-chain assets to a large number of recipients.",
  contracts: [
    "thirdweb.eth/AirdropERC20",
    "thirdweb.eth/AirdropERC721",
    "thirdweb.eth/AirdropERC1155",
    "thirdweb.eth/AirdropERC20Claimable",
    "thirdweb.eth/AirdropERC721Claimable",
    "thirdweb.eth/AirdropERC1155Claimable",
  ],
} as const;

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
} as const;

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
} as const;

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
} as const;

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
} as const;

const SMART_WALLET = {
  id: "smart-wallet",
  name: "Smart Wallet",
  displayName: "Smart Wallet",
  description:
    "Smart wallet factories that let you spin up Account Abstraction (ERC-4337) wallets for your users. Not sure which factory is right for you?",
  learnMore:
    "https://portal.thirdweb.com/wallets/smart-wallet/get-started#1-deploy-a-smart-wallet-factory-contract",
  contracts: [
    "thirdweb.eth/AccountFactory",
    "thirdweb.eth/ManagedAccountFactory",
  ],
  showInExplore: true,
} as const;

const CATEGORIES = {
  [POPULAR.id]: POPULAR,
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
} as const;

export function getCategory(id: string): ExploreCategory | null {
  if (isExploreCategory(id)) {
    return CATEGORIES[id];
  }
  return null;
}

export type ExploreCategoryName = keyof typeof CATEGORIES;

export function isExploreCategory(
  category: string,
): category is ExploreCategoryName {
  return category in CATEGORIES;
}

export const EXPLORE_PAGE_DATA = Object.values(CATEGORIES).filter(
  (v) => (v as ExploreCategory).showInExplore !== false,
);

export const ALL_CATEGORIES = Object.values(CATEGORIES).map((v) => v.id);

export function prefetchCategory(
  category: ExploreCategory,
  queryClient: QueryClient,
) {
  return Promise.allSettled(
    category.contracts.map((contract) =>
      queryClient.fetchQuery(
        publishedContractQuery(`${contract}/latest`, queryClient),
      ),
    ),
  );
}

export function getAllExplorePublishedContracts() {
  const all = EXPLORE_PAGE_DATA.flatMap((category) => category.contracts);
  return [...new Set(all)];
}

export function getAllExplorePublishers() {
  return [
    ...new Set(
      getAllExplorePublishedContracts().map(
        (contract) => contract.split("/")[0],
      ),
    ),
  ];
}
