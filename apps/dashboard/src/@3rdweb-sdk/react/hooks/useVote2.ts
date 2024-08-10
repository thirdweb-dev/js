import { useContract, useContractMetadata } from "@thirdweb-dev/react";
import type { Vote, VoteType } from "@thirdweb-dev/sdk";
import { thirdwebClient } from "lib/thirdweb-client";
import { type ThirdwebContract, getContract } from "thirdweb";
import { delegate, delegates } from "thirdweb/extensions/erc20";
import { hasVoted, token } from "thirdweb/extensions/vote";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import invariant from "tiny-invariant";
import type { RequiredParam } from "utils/types";
import { voteKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";

export function useVoteProposalList(contract?: Vote) {
  return useQueryWithNetwork(
    voteKeys.proposals(contract?.getAddress()),
    async () => await contract?.getAll(),
    {
      enabled: !!contract,
    },
  );
}

export function useHasVotedOnProposal(
  contract: ThirdwebContract,
  proposalId: bigint,
) {
  const userAddress = useActiveAccount()?.address;
  return useQueryWithNetwork(
    voteKeys.userHasVotedOnProposal(
      String(proposalId),
      contract.address,
      userAddress,
    ),
    async () => {
      invariant(userAddress, "address is required");
      return await hasVoted({ contract, proposalId, account: userAddress });
    },
    {
      enabled: !!contract,
    },
  );
}

export function useCanExecuteProposal(
  contract: RequiredParam<Vote>,
  proposalId: string,
) {
  return useQueryWithNetwork(
    voteKeys.canExecuteProposal(proposalId, contract?.getAddress()),
    async () => await contract?.canExecute(proposalId),
    {
      enabled: !!contract,
    },
  );
}

export function useTokensDelegated(contract: ThirdwebContract) {
  const userAddress = useActiveAccount()?.address;

  return useQueryWithNetwork(
    voteKeys.delegation(contract.address, userAddress),
    async () => {
      invariant(userAddress, "wallet address is required");
      const tokenAddress = await token({ contract });
      if (!tokenAddress) {
        throw new Error("Expected a delegated token address");
      }
      const tokenContract = getContract({
        address: tokenAddress,
        chain: contract.chain,
        client: thirdwebClient,
      });
      const delegatedAddress = await delegates({
        contract: tokenContract,
        account: userAddress,
      });
      return delegatedAddress?.toLowerCase() === userAddress.toLowerCase();
    },
    {
      enabled: !!contract && !!userAddress,
    },
  );
}

export function useVoteTokenBalances(contract?: Vote, addresses?: string[]) {
  const { data } = useContractMetadata(contract);
  const tokenContract = useContract(
    data?.voting_token_address,
    "token",
  ).contract;

  return useQueryWithNetwork(
    voteKeys.balances(contract?.getAddress(), addresses),
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
      enabled: !!data && !!contract && !!addresses?.length,
    },
  );
}

export interface IProposalInput {
  description: string;
}

export function useProposalCreateMutation(contractAddress?: string) {
  const voteContract = useContract(contractAddress, "vote").contract;
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

export function useDelegateMutation(contract: ThirdwebContract) {
  const userAddress = useActiveAccount()?.address;
  const { mutateAsync } = useSendAndConfirmTransaction();
  return useMutationWithInvalidate(
    async () => {
      invariant(userAddress, "address is required");
      const tokenAddress = await token({ contract });
      if (!tokenAddress) {
        throw new Error("Expected a delegated token address");
      }
      const transaction = delegate({ contract, delegatee: userAddress });
      return await mutateAsync(transaction);
    },
    {
      onSuccess: (_data, _options, _variables, invalidate) => {
        return invalidate([voteKeys.delegation(contract.address, userAddress)]);
      },
    },
  );
}

interface IVoteCast {
  voteType: VoteType;
  reason?: string;
}

export function useCastVoteMutation(
  contract: RequiredParam<Vote>,
  proposalId: string,
) {
  const address = useActiveAccount()?.address;
  const contractAddress = contract?.getAddress();

  return useMutationWithInvalidate(
    async (vote: IVoteCast) => {
      invariant(contract, "contract is required");
      invariant(address, "address is required");
      const { voteType, reason } = vote;
      return contract.vote(proposalId, voteType, reason);
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
  contract: RequiredParam<Vote>,
  proposalId: string,
) {
  const contractAddress = contract?.getAddress();

  return useMutationWithInvalidate(
    async () => {
      invariant(contract, "contract is required");
      return contract.execute(proposalId);
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
