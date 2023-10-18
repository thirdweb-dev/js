import type { ContractType } from "@thirdweb-dev/sdk";
import { constants } from "ethers";

export const networkKeys = {
  all: ["network"] as const,
  chain: (chainId?: number) => [...networkKeys.all, chainId] as const,
  multiChainRegistry: ["multi-chain-registry"] as const,
};

export const accountKeys = {
  all: ["account"] as const,
  wallet: (walletAddress: string) =>
    [...accountKeys.all, walletAddress] as const,
  me: (walletAddress: string) =>
    [...accountKeys.wallet(walletAddress), "me"] as const,
  usage: (walletAddress: string) =>
    [...accountKeys.wallet(walletAddress), "usage"] as const,
  walletStats: (walletAddress: string, clientId: string) =>
    [...accountKeys.wallet(walletAddress), "wallets", clientId] as const,
};

export const apiKeys = {
  all: ["api"] as const,
  wallet: (walletAddress: string) => [...apiKeys.all, walletAddress] as const,
  keys: (walletAddress: string) =>
    [...apiKeys.wallet(walletAddress), "keys"] as const,
  key: (id: string, walletAddress: string) =>
    [...apiKeys.keys(walletAddress), id] as const,
};

export const authorizedWallets = {
  all: ["authorizedWallets"] as const,
  wallet: (walletAddress: string) =>
    [...authorizedWallets.all, walletAddress] as const,
  authorizedWallets: (walletAddress: string) =>
    [...authorizedWallets.wallet(walletAddress), "authorizedWallets"] as const,
};

export const embeddedWalletsKeys = {
  all: ["embeddedWallets"] as const,
  wallet: (walletAddress: string) =>
    [...embeddedWalletsKeys.all, walletAddress] as const,
  embeddedWallets: (walletAddress: string, clientId: string | undefined) =>
    [...embeddedWalletsKeys.wallet(walletAddress), clientId] as const,
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

export const walletKeys = {
  all: ["balance"] as const,
  balances: (walletAddress: string) =>
    [...splitsKeys.all, walletAddress] as const,
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
