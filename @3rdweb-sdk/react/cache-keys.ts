import { AddressZero } from "@ethersproject/constants";
import {
  ContractType,
  Edition,
  EditionDrop,
  Marketplace,
  NFTCollection,
  NFTDrop,
  Pack,
  QueryAllParams,
  Role,
  Split,
  Token,
  TokenDrop,
  Vote,
} from "@thirdweb-dev/sdk";
import { SUPPORTED_CHAIN_ID } from "utils/network";

export const networkKeys = {
  all: ["network"] as const,
  chain: (chainId?: SUPPORTED_CHAIN_ID) =>
    [...networkKeys.all, chainId] as const,
};

export const dashboardKeys = {
  all: ["dashboard"] as const,
  lists: () => [...dashboardKeys.all, "list"] as const,
  list: (address = AddressZero) => [...dashboardKeys.lists(), address] as const,
};
export const bundleKeys = {
  all: ["bundle"] as const,
  lists: () => [...bundleKeys.all, "list"] as const,
  list: (address = AddressZero) => [...bundleKeys.lists(), address] as const,
  listWithActor: (address = AddressZero, actingAddress = "") =>
    [...bundleKeys.list(address), { actingAddress }] as const,
};

export const dropKeys = {
  all: ["drop"] as const,
  lists: () => [...dropKeys.all, "list"] as const,
  list: (address = AddressZero) => [...dropKeys.lists(), address] as const,
  details: () => [...dropKeys.all, "detail"] as const,
  detail: (address = AddressZero) => [...dropKeys.details(), address] as const,
  batchesToReveal: (address = AddressZero) =>
    [...dropKeys.details(), address, "batchesToReveal"] as const,
  supply: (address = AddressZero) =>
    [...dropKeys.detail(address), "supply"] as const,
  activeClaimCondition: (address = AddressZero) =>
    [...dropKeys.detail(address), "activeClaimCondition"] as const,
  claimPhases: (address = AddressZero) =>
    [...dropKeys.detail(address), "claimPhases"] as const,
  balanceOf: (address = AddressZero, userAddress = AddressZero) =>
    [
      ...dropKeys.detail(address),
      "balanceOf",
      { address: userAddress },
    ] as const,
};

export const bundleDropKeys = {
  all: ["bundle-drop"] as const,
  lists: () => [...dropKeys.all, "list"] as const,
  list: (address = AddressZero) => [...dropKeys.lists(), address] as const,
  details: () => [...dropKeys.all, "detail"] as const,
  detail: (address = AddressZero) => [...dropKeys.details(), address] as const,
  activeClaimCondition: (address = AddressZero, tokenId = "-1") =>
    [...dropKeys.detail(address), "activeClaimCondition", { tokenId }] as const,
  claimPhases: (address = AddressZero, tokenId = "-1") =>
    [...dropKeys.detail(address), "claimPhases", { tokenId }] as const,
  owned: (address = AddressZero, ownerAddress = AddressZero) =>
    [...dropKeys.detail(address), "owned", { ownerAddress }] as const,
  balanceOf: (
    address = AddressZero,
    userAddress = AddressZero,
    tokenId = "-1",
  ) =>
    [
      ...dropKeys.detail(address),
      "balanceOf",
      { address: userAddress, tokenId },
    ] as const,
};

export const contractKeys = {
  all: ["contract"] as const,
  lists: () => [...contractKeys.all, "list"] as const,
  list: (address = AddressZero) => [...contractKeys.lists(), address] as const,
  listWithFilters: (address = AddressZero, filters?: ContractType[]) =>
    [...contractKeys.list(address), { filters }] as const,
  details: () => [...contractKeys.all, "detail"] as const,
  detail: (address: string = AddressZero) =>
    [...contractKeys.details(), address] as const,
};

export const contractRoleKeys = {
  all: ["contract_roles"] as const,
  lists: () => [...contractRoleKeys.all, "list"] as const,
  list: (address = AddressZero) =>
    [...contractRoleKeys.lists(), address] as const,

  details: () => [...contractRoleKeys.all, "detail"] as const,
  detail: (address: string = AddressZero, role: Role) =>
    [...contractRoleKeys.details(), address, { role }] as const,
};

export const nftCollectionKeys = {
  all: ["nft_collection"] as const,
  lists: () => [...nftCollectionKeys.all, "list"] as const,
  list: (address = AddressZero, queryParams?: QueryAllParams) =>
    queryParams
      ? ([...nftCollectionKeys.lists(), address, queryParams] as const)
      : ([...nftCollectionKeys.lists()] as const),
};

export const packKeys = {
  all: ["pack"] as const,
  lists: () => [...packKeys.all, "list"] as const,
  list: (address = AddressZero) => [...packKeys.lists(), address] as const,
  details: () => [...packKeys.all, "detail"] as const,
  detail: (address: string = AddressZero) =>
    [...packKeys.details(), address] as const,
  rewards: (address: string = AddressZero, tokenId = "-1") =>
    [...packKeys.detail(address), "rewards", tokenId] as const,
  linkBalance: (address: string = AddressZero) => [
    ...packKeys.detail(address),
    "linkBalance",
  ],
  balanceOf: (
    address = AddressZero,
    userAddress = AddressZero,
    tokenId = "-1",
  ) =>
    [
      ...packKeys.detail(address),
      "balanceOf",
      { address: userAddress, tokenId },
    ] as const,
};

export const tokenKeys = {
  all: ["token"] as const,
  details: () => [...tokenKeys.all, "detail"] as const,
  decimals: (address: string = AddressZero) =>
    [...tokenKeys.details(), "decimals", address] as const,
  detail: (
    address: string = AddressZero,
    walletAddress: string = AddressZero,
  ) => [...tokenKeys.details(), address, { walletAddress }] as const,
  balanceOf: (
    address: string = AddressZero,
    walletAddress: string = AddressZero,
  ) =>
    [...tokenKeys.details(), address, "balanceOf", { walletAddress }] as const,
  // hack
  list: (address: string = AddressZero, walletAddress: string = AddressZero) =>
    tokenKeys.detail(address, walletAddress),
};

export const marketplaceKeys = {
  all: ["marketplace"] as const,
  lists: () => [...marketplaceKeys.all, "list"] as const,
  list: (address = AddressZero) =>
    [...marketplaceKeys.lists(), address] as const,
  detail: (address = AddressZero) => [...marketplaceKeys.all, address] as const,
  isRestricted: (address = AddressZero) =>
    [...marketplaceKeys.detail(address), "isOpen"] as const,
};

export const splitsKeys = {
  all: ["splits"] as const,
  lists: () => [...splitsKeys.all, "list"] as const,
  list: (address = AddressZero) => [...splitsKeys.lists(), address] as const,
  detail: (address = AddressZero) => [...splitsKeys.all, address] as const,
  currencies: (address = AddressZero) =>
    [...splitsKeys.detail(address), "currencies"] as const,
  balances: (address = AddressZero) =>
    [...splitsKeys.detail(address), "balances"] as const,
};

export const voteKeys = {
  all: ["vote"] as const,
  detail: (address = AddressZero) => [...voteKeys.all, address] as const,
  proposals: (address = AddressZero) =>
    [...voteKeys.detail(address), "proposals"] as const,
  proposal: (proposalId = "-1", address = AddressZero) =>
    [...voteKeys.proposals(address), proposalId] as const,
  balances: (address = AddressZero, addresses = [] as string[]) =>
    [...voteKeys.detail(address), "balances", { addresses }] as const,
  delegations: (address = AddressZero) =>
    [...voteKeys.detail(address), "delegations"] as const,
  delegation: (address = AddressZero, userAddress = AddressZero) =>
    [...voteKeys.delegations(address), userAddress] as const,
  userHasVotedOnProposal: (
    proposalId = "-1",
    address = AddressZero,
    userAddress = AddressZero,
  ) =>
    [
      ...voteKeys.proposal(proposalId, address),
      "hasVotedOnProposal",
      userAddress,
    ] as const,
  canExecuteProposal: (proposalId = "-1", address = AddressZero) =>
    [...voteKeys.proposal(proposalId, address), "canExecute"] as const,
};

export const recipientKeys = {
  all: ["recipient"] as const,
  detail: (address = AddressZero) => [...recipientKeys.all, address] as const,
  token: (address = AddressZero, tokenId = "-1") =>
    [...recipientKeys.detail(address), tokenId] as const,
};

export const royaltyKeys = {
  all: ["royalty"] as const,
  detail: (address = AddressZero) => [...royaltyKeys.all, address] as const,
  token: (address = AddressZero, tokenId = "-1") =>
    [...royaltyKeys.detail(address), tokenId] as const,
};

// NFTs owned by wallet for wrapping
export const assetKeys = {
  all: ["assets"] as const,
  detail: (userAddress = AddressZero) =>
    [...assetKeys.all, userAddress] as const,
};

// Tokens owned by wallet for wrapping
export const tokenAssetKeys = {
  all: ["tokenAssets"] as const,
  detail: (userAddress = AddressZero) =>
    [...tokenAssetKeys.all, userAddress] as const,
};

// Link balance
export const linkBalanceKeys = {
  all: ["linkBalance"] as const,
  detail: (userAddress = AddressZero) =>
    [...linkBalanceKeys.all, userAddress] as const,
};

export const CacheKeyMap: Record<ContractType, any> = {
  [NFTCollection.contractType]: nftCollectionKeys,
  [Edition.contractType]: bundleKeys,
  [Token.contractType]: tokenKeys,
  [NFTDrop.contractType]: dropKeys,
  [EditionDrop.contractType]: bundleDropKeys,
  [Vote.contractType]: voteKeys,
  [Marketplace.contractType]: marketplaceKeys,
  [Pack.contractType]: packKeys,
  [Split.contractType]: splitsKeys,
  [TokenDrop.contractType]: {},
};
