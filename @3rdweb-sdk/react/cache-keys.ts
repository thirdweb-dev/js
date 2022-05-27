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
  SignatureDrop,
  SmartContract,
  Split,
  Token,
  TokenDrop,
  Vote,
} from "@thirdweb-dev/sdk";
import { constants } from "ethers";
import { SUPPORTED_CHAIN_ID } from "utils/network";

export const networkKeys = {
  all: ["network"] as const,
  chain: (chainId?: SUPPORTED_CHAIN_ID) =>
    [...networkKeys.all, chainId] as const,
};

export const dashboardKeys = {
  all: ["dashboard"] as const,
  lists: () => [...dashboardKeys.all, "list"] as const,
  list: (address = constants.AddressZero) =>
    [...dashboardKeys.lists(), address] as const,
};
export const editionKeys = {
  all: ["edition"] as const,
  lists: () => [...editionKeys.all, "list"] as const,
  list: (address = constants.AddressZero) =>
    [...editionKeys.lists(), address] as const,
  listWithActor: (address = constants.AddressZero, actingAddress = "") =>
    [...editionKeys.list(address), { actingAddress }] as const,
};

export const NFTDropKeys = {
  all: ["nft-drop"] as const,
  lists: () => [...NFTDropKeys.all, "list"] as const,
  list: (address = constants.AddressZero) =>
    [...NFTDropKeys.lists(), address] as const,
  details: () => [...NFTDropKeys.all, "detail"] as const,
  detail: (address = constants.AddressZero) =>
    [...NFTDropKeys.details(), address] as const,
  batchesToReveal: (address = constants.AddressZero) =>
    [...NFTDropKeys.details(), address, "batchesToReveal"] as const,
  supply: (address = constants.AddressZero) =>
    [...NFTDropKeys.detail(address), "supply"] as const,
  activeClaimCondition: (address = constants.AddressZero) =>
    [...NFTDropKeys.detail(address), "activeClaimCondition"] as const,
  claimPhases: (address = constants.AddressZero) =>
    [...NFTDropKeys.detail(address), "claimPhases"] as const,
  balanceOf: (
    address = constants.AddressZero,
    userAddress = constants.AddressZero,
  ) =>
    [
      ...NFTDropKeys.detail(address),
      "balanceOf",
      { address: userAddress },
    ] as const,
};

export const editionDropKeys = {
  all: ["edition-drop"] as const,
  lists: () => [...editionDropKeys.all, "list"] as const,
  list: (address = constants.AddressZero) =>
    [...editionDropKeys.lists(), address] as const,
  details: () => [...editionDropKeys.all, "detail"] as const,
  detail: (address = constants.AddressZero) =>
    [...editionDropKeys.details(), address] as const,
  activeClaimCondition: (address = constants.AddressZero, tokenId = "-1") =>
    [
      ...editionDropKeys.detail(address),
      "activeClaimCondition",
      { tokenId },
    ] as const,
  claimPhases: (address = constants.AddressZero, tokenId = "-1") =>
    [...editionDropKeys.detail(address), "claimPhases", { tokenId }] as const,
  owned: (
    address = constants.AddressZero,
    ownerAddress = constants.AddressZero,
  ) => [...editionDropKeys.detail(address), "owned", { ownerAddress }] as const,
  balanceOf: (
    address = constants.AddressZero,
    userAddress = constants.AddressZero,
    tokenId = "-1",
  ) =>
    [
      ...editionDropKeys.detail(address),
      "balanceOf",
      { address: userAddress, tokenId },
    ] as const,
};

export const contractKeys = {
  all: ["contract"] as const,
  lists: () => [...contractKeys.all, "list"] as const,
  list: (address = constants.AddressZero) =>
    [...contractKeys.lists(), address] as const,
  listWithFilters: (
    address = constants.AddressZero,
    filters?: ContractType[],
  ) => [...contractKeys.list(address), { filters }] as const,
  details: () => [...contractKeys.all, "detail"] as const,
  detail: (address: string = constants.AddressZero) =>
    [...contractKeys.details(), address] as const,
};

export const contractRoleKeys = {
  all: ["contract_roles"] as const,
  lists: () => [...contractRoleKeys.all, "list"] as const,
  list: (address = constants.AddressZero) =>
    [...contractRoleKeys.lists(), address] as const,

  details: () => [...contractRoleKeys.all, "detail"] as const,
  detail: (address: string = constants.AddressZero, role: Role) =>
    [...contractRoleKeys.details(), address, { role }] as const,
};

export const nftCollectionKeys = {
  all: ["nft-collection"] as const,
  lists: () => [...nftCollectionKeys.all, "list"] as const,
  list: (address = constants.AddressZero, queryParams?: QueryAllParams) =>
    queryParams
      ? ([...nftCollectionKeys.lists(), address, queryParams] as const)
      : ([...nftCollectionKeys.lists()] as const),
};

export const packKeys = {
  all: ["pack"] as const,
  lists: () => [...packKeys.all, "list"] as const,
  list: (address = constants.AddressZero) =>
    [...packKeys.lists(), address] as const,
  details: () => [...packKeys.all, "detail"] as const,
  detail: (address: string = constants.AddressZero) =>
    [...packKeys.details(), address] as const,
  rewards: (address: string = constants.AddressZero, tokenId = "-1") =>
    [...packKeys.detail(address), "rewards", tokenId] as const,
  linkBalance: (address: string = constants.AddressZero) => [
    ...packKeys.detail(address),
    "linkBalance",
  ],
  balanceOf: (
    address = constants.AddressZero,
    userAddress = constants.AddressZero,
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
  decimals: (address: string = constants.AddressZero) =>
    [...tokenKeys.details(), "decimals", address] as const,
  detail: (
    address: string = constants.AddressZero,
    walletAddress: string = constants.AddressZero,
  ) => [...tokenKeys.details(), address, { walletAddress }] as const,
  balanceOf: (
    address: string = constants.AddressZero,
    walletAddress: string = constants.AddressZero,
  ) =>
    [...tokenKeys.details(), address, "balanceOf", { walletAddress }] as const,
  // hack
  list: (
    address: string = constants.AddressZero,
    walletAddress: string = constants.AddressZero,
  ) => tokenKeys.detail(address, walletAddress),
};

export const tokenDropKeys = {
  all: ["tokenDrop"] as const,
  details: () => [...tokenDropKeys.all, "detail"] as const,
  decimals: (address: string = constants.AddressZero) =>
    [...tokenDropKeys.details(), "decimals", address] as const,
  detail: (
    address: string = constants.AddressZero,
    walletAddress: string = constants.AddressZero,
  ) => [...tokenDropKeys.details(), address, { walletAddress }] as const,
  activeClaimCondition: (address = constants.AddressZero) =>
    [...tokenDropKeys.detail(address), "activeClaimCondition"] as const,
  claimPhases: (address = constants.AddressZero) =>
    [...tokenDropKeys.detail(address), "claimPhases"] as const,
  balanceOf: (
    address: string = constants.AddressZero,
    walletAddress: string = constants.AddressZero,
  ) =>
    [
      ...tokenDropKeys.details(),
      address,
      "balanceOf",
      { walletAddress },
    ] as const,
  // hack
  list: (
    address: string = constants.AddressZero,
    walletAddress: string = constants.AddressZero,
  ) => tokenDropKeys.detail(address, walletAddress),
};

export const marketplaceKeys = {
  all: ["marketplace"] as const,
  lists: () => [...marketplaceKeys.all, "list"] as const,
  list: (address = constants.AddressZero) =>
    [...marketplaceKeys.lists(), address] as const,
  detail: (address = constants.AddressZero) =>
    [...marketplaceKeys.all, address] as const,
  isRestricted: (address = constants.AddressZero) =>
    [...marketplaceKeys.detail(address), "isOpen"] as const,
};

export const splitsKeys = {
  all: ["splits"] as const,
  lists: () => [...splitsKeys.all, "list"] as const,
  list: (address = constants.AddressZero) =>
    [...splitsKeys.lists(), address] as const,
  detail: (address = constants.AddressZero) =>
    [...splitsKeys.all, address] as const,
  currencies: (address = constants.AddressZero) =>
    [...splitsKeys.detail(address), "currencies"] as const,
  balances: (address = constants.AddressZero) =>
    [...splitsKeys.detail(address), "balances"] as const,
};

export const voteKeys = {
  all: ["vote"] as const,
  detail: (address = constants.AddressZero) =>
    [...voteKeys.all, address] as const,
  proposals: (address = constants.AddressZero) =>
    [...voteKeys.detail(address), "proposals"] as const,
  proposal: (proposalId = "-1", address = constants.AddressZero) =>
    [...voteKeys.proposals(address), proposalId] as const,
  balances: (address = constants.AddressZero, addresses = [] as string[]) =>
    [...voteKeys.detail(address), "balances", { addresses }] as const,
  delegations: (address = constants.AddressZero) =>
    [...voteKeys.detail(address), "delegations"] as const,
  delegation: (
    address = constants.AddressZero,
    userAddress = constants.AddressZero,
  ) => [...voteKeys.delegations(address), userAddress] as const,
  userHasVotedOnProposal: (
    proposalId = "-1",
    address = constants.AddressZero,
    userAddress = constants.AddressZero,
  ) =>
    [
      ...voteKeys.proposal(proposalId, address),
      "hasVotedOnProposal",
      userAddress,
    ] as const,
  canExecuteProposal: (proposalId = "-1", address = constants.AddressZero) =>
    [...voteKeys.proposal(proposalId, address), "canExecute"] as const,
};

export const recipientKeys = {
  all: ["recipient"] as const,
  detail: (address = constants.AddressZero) =>
    [...recipientKeys.all, address] as const,
  token: (address = constants.AddressZero, tokenId = "-1") =>
    [...recipientKeys.detail(address), tokenId] as const,
};

export const royaltyKeys = {
  all: ["royalty"] as const,
  detail: (address = constants.AddressZero) =>
    [...royaltyKeys.all, address] as const,
  token: (address = constants.AddressZero, tokenId = "-1") =>
    [...royaltyKeys.detail(address), tokenId] as const,
};

export const platformFeeKeys = {
  all: ["platformFee"] as const,
  detail: (address = constants.AddressZero) =>
    [...platformFeeKeys.all, address] as const,
};

// NFTs owned by wallet for wrapping
export const assetKeys = {
  all: ["assets"] as const,
  detail: (userAddress = constants.AddressZero) =>
    [...assetKeys.all, userAddress] as const,
};

// Tokens owned by wallet for wrapping
export const tokenAssetKeys = {
  all: ["tokenAssets"] as const,
  detail: (userAddress = constants.AddressZero) =>
    [...tokenAssetKeys.all, userAddress] as const,
};

// Link balance
export const linkBalanceKeys = {
  all: ["linkBalance"] as const,
  detail: (userAddress = constants.AddressZero) =>
    [...linkBalanceKeys.all, userAddress] as const,
};

export const CacheKeyMap: Record<ContractType, any> = {
  [NFTCollection.contractType]: nftCollectionKeys,
  [Edition.contractType]: editionKeys,
  [Token.contractType]: tokenKeys,
  [NFTDrop.contractType]: NFTDropKeys,
  [EditionDrop.contractType]: editionDropKeys,
  [Vote.contractType]: voteKeys,
  [Marketplace.contractType]: marketplaceKeys,
  [Pack.contractType]: packKeys,
  [Split.contractType]: splitsKeys,
  [TokenDrop.contractType]: tokenDropKeys,
  [SmartContract.contractType]: {},
  [SignatureDrop.contractType]: {},
};
