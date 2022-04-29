import { voteKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";
import { useContractMetadata } from "./useContract";
import { useWeb3 } from "@3rdweb-sdk/react";
import { useSDK, useToken, useVote } from "@thirdweb-dev/react";
import { VoteType } from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";

export function useVoteContractMetadata(contractAddress?: string) {
  return useContractMetadata(useVote(contractAddress));
}

export function useVoteProposalList(contractAddress?: string) {
  const voteContract = useVote(contractAddress);
  return useQueryWithNetwork(
    voteKeys.proposals(contractAddress),
    async () => await voteContract?.getAll(),
    {
      enabled: !!voteContract && !!contractAddress,
    },
  );
}

export function useHasVotedOnProposal(
  proposalId: string,
  contractAddress?: string,
) {
  const { address } = useWeb3();
  const voteContract = useVote(contractAddress);
  return useQueryWithNetwork(
    voteKeys.userHasVotedOnProposal(proposalId, contractAddress, address),
    async () => await voteContract?.hasVoted(proposalId, address),
    {
      enabled: !!voteContract && !!contractAddress,
    },
  );
}

export function useCanExecuteProposal(
  proposalId: string,
  contractAddress?: string,
) {
  const voteContract = useVote(contractAddress);
  return useQueryWithNetwork(
    voteKeys.canExecuteProposal(proposalId, contractAddress),
    async () => await voteContract?.canExecute(proposalId),
    {
      enabled: !!voteContract && !!contractAddress,
    },
  );
}

export function useTokensDelegated(contractAddress?: string) {
  const sdk = useSDK();
  const { address } = useWeb3();
  const voteContract = useVote(contractAddress);
  return useQueryWithNetwork(
    voteKeys.delegation(contractAddress, address),
    async () => {
      invariant(address, "address is required");
      invariant(voteContract, "vote contract is required");

      const metadata = await voteContract?.metadata.get();
      const tokenAddress = metadata?.voting_token_address;
      const tokenContract = sdk?.getToken(tokenAddress);
      const delegation = await tokenContract?.getDelegationOf(address);
      return delegation?.toLowerCase() === address.toLowerCase();
    },
    {
      enabled: !!voteContract && !!address,
    },
  );
}

export function useVoteTokenBalances(
  contractAddress?: string,
  addresses?: string[],
) {
  const { data } = useVoteContractMetadata(contractAddress);
  const tokenContract = useToken((data as any)?.voting_token_address || "");

  return useQueryWithNetwork(
    voteKeys.balances(contractAddress, addresses),
    async () => {
      invariant(data, "contract metadata is required");
      invariant(tokenContract, "voting contract is required");
      invariant(addresses, "addresses are required");

      const balances = addresses.map(async (address) => {
        return {
          address,
          balance: (await tokenContract.balanceOf(address)).displayValue,
        };
      });

      return await Promise.all(balances);
    },
    {
      enabled: !!data && !!contractAddress && !!addresses?.length,
    },
  );
}

export interface IProposalInput {
  description: string;
}

export function useProposalCreateMutation(contractAddress?: string) {
  const voteContract = useVote(contractAddress);
  return useMutationWithInvalidate(
    (proposal: IProposalInput) => {
      invariant(voteContract, "contract is required");
      const { description } = proposal;
      return voteContract.propose(description);
    },
    {
      onSuccess: (_data, _options, _variables, invalidate) => {
        return invalidate([voteKeys.proposals(contractAddress)]);
      },
    },
  );
}

export function useDelegateMutation(contractAddress?: string) {
  const sdk = useSDK();
  const { address } = useWeb3();
  const voteContract = useVote(contractAddress);
  return useMutationWithInvalidate(
    async () => {
      invariant(address, "address is required");
      invariant(contractAddress, "contract address is required");
      invariant(voteContract, "vote contract is required");

      const metadata = await voteContract?.metadata.get();
      const tokenAddress = metadata?.voting_token_address;
      const tokenContract = sdk?.getToken(tokenAddress);
      return tokenContract?.delegateTo(address);
    },
    {
      onSuccess: (_data, _options, _variables, invalidate) => {
        return invalidate([voteKeys.delegation(contractAddress, address)]);
      },
    },
  );
}

interface IVoteCast {
  voteType: VoteType;
  reason?: string;
}

export function useCastVoteMutation(
  proposalId: string,
  contractAddress?: string,
) {
  const { address } = useWeb3();
  const voteContract = useVote(contractAddress);
  return useMutationWithInvalidate(
    async (vote: IVoteCast) => {
      invariant(voteContract, "contract is required");
      invariant(address, "address is required");
      const { voteType, reason } = vote;
      return voteContract.vote(proposalId, voteType, reason);
    },
    {
      onSuccess: (_data, _options, _variables, invalidate) => {
        return invalidate([
          voteKeys.proposals(contractAddress),
          voteKeys.userHasVotedOnProposal(proposalId, contractAddress, address),
          voteKeys.canExecuteProposal(proposalId, contractAddress),
        ]);
      },
    },
  );
}

export function useExecuteProposalMutation(
  proposalId: string,
  contractAddress?: string,
) {
  const voteContract = useVote(contractAddress);
  return useMutationWithInvalidate(
    async () => {
      invariant(voteContract, "contract is required");
      return voteContract.execute(proposalId);
    },
    {
      onSuccess: (_data, _options, _variables, invalidate) => {
        return invalidate([
          voteKeys.proposals(contractAddress),
          voteKeys.canExecuteProposal(proposalId, contractAddress),
        ]);
      },
    },
  );
}
