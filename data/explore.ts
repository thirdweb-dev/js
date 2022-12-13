import type { QueryClient } from "@tanstack/query-core";
import { publishedContractQuery } from "components/explore/contract-card";

export type PublishedContractID = `${string}/${string}`;

export interface ExploreCategory {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  learnMore?: string;
  contracts: Readonly<PublishedContractID[]>;
}

const POPULAR = {
  id: "popular",
  name: "Popular",
  description: "A collection of our most deployed contracts.",
  contracts: [
    "thirdweb.eth/DropERC721",
    "thirdweb.eth/Marketplace",
    "unlock-protocol.eth/PublicLock",
    "thirdweb.eth/DropERC1155",
    "thirdweb.eth/SignatureDrop",
    "thirdweb.eth/TokenERC20",
  ],
} as const;

const NFTS = {
  id: "nft",
  name: "NFT",
  displayName: "NFTs",
  description:
    "NFT Collections, Editions, Drops and everything else NFT-related.",
  contracts: [
    "thirdweb.eth/Multiwrap",
    "doubledev.eth/ERC4907",
    "thirdweb.eth/TokenERC721",
    "thirdweb.eth/TokenERC1155",
    "flairsdk.eth/ERC721CommunityStream",
    "thirdweb.eth/Pack",
    "unlock-protocol.eth/PublicLock",
    "thirdweb.eth/DropERC721",
    "thirdweb.eth/DropERC1155",
    "thirdweb.eth/SignatureDrop",
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
    "thirdweb.eth/SignatureDrop",
    "thirdweb.eth/DropERC20",
  ],
} as const;

const MARKETS = {
  id: "marketplace",
  name: "Marketplace",
  displayName: "Marketplaces",
  description: "Quickly spin up your own on-chain marketplace for NFTs.",
  contracts: [
    "thirdweb.eth/Marketplace",
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
  ],
} as const;

const CATEGORIES = {
  [POPULAR.id]: POPULAR,
  [NFTS.id]: NFTS,
  [MARKETS.id]: MARKETS,
  [DROPS.id]: DROPS,
  [GOVERNANCE.id]: GOVERNANCE,
  [AIRDROP.id]: AIRDROP,
} as const;

export function getCategory(id: string): ExploreCategory | null {
  if (isExploreCategory(id)) {
    return CATEGORIES[id];
  }
  return null;
}

export function isExploreCategory(
  category: string,
): category is keyof typeof CATEGORIES {
  return category in CATEGORIES;
}

export type ExploreCategoryName = keyof typeof CATEGORIES;

export const EXPLORE_PAGE_DATA = Object.values(CATEGORIES);

export const ALL_CATEGORIES = Object.values(CATEGORIES).map((v) => v.id);

export function prefetchCategory(
  category: ExploreCategory,
  queryClient: QueryClient,
) {
  return Promise.all(
    category.contracts.map((contract) =>
      queryClient.fetchQuery(
        publishedContractQuery(`${contract}/latest`, queryClient),
      ),
    ),
  );
}

export function getAllExploreReleases() {
  const all = EXPLORE_PAGE_DATA.flatMap((category) => category.contracts);
  return [...new Set(all)];
}

export function getAllExplorePublishers() {
  return [
    ...new Set(
      getAllExploreReleases().map((contract) => contract.split("/")[0]),
    ),
  ];
}
