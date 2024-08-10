import type { Vote } from "@thirdweb-dev/sdk";
import { thirdwebClient } from "lib/thirdweb-client";
import { type ThirdwebContract, getContract } from "thirdweb";
import {
  balanceOf,
  decimals,
  delegate,
  delegates,
} from "thirdweb/extensions/erc20";
import {
  type VoteType,
  canExecute,
  castVoteWithReason,
  getAll,
  hasVoted,
  propose,
  token,
} from "thirdweb/extensions/vote";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import invariant from "tiny-invariant";
import type { RequiredParam } from "utils/types";
import { voteKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";

export function useVoteProposalList(contract: ThirdwebContract) {
  return useQueryWithNetwork(
    voteKeys.proposals(contract.address),
    async () => await getAll({ contract }),
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
  contract: ThirdwebContract,
  proposalId: bigint,
) {
  return useQueryWithNetwork(
    voteKeys.canExecuteProposal(String(proposalId), contract.address),
    async () => await canExecute({ contract, proposalId }),
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

export function useVoteTokenBalances(
  contract: ThirdwebContract,
  addresses: string[],
) {
  return useQueryWithNetwork(
    voteKeys.balances(contract.address, addresses),
    async (): Promise<
      Array<{ address: string; balance: bigint; decimals: number }>
    > => {
      invariant(addresses.length, "addresses are required");
      const tokenAddress = await token({ contract });
      if (!tokenAddress) {
        throw new Error("Expected a delegated token address");
      }
      const tokenContract = getContract({
        address: tokenAddress,
        chain: contract.chain,
        client: thirdwebClient,
      });
      const _decimals = await decimals({ contract: tokenContract });
      const balanceData = await Promise.all(
        addresses.map((address) =>
          balanceOf({ contract: tokenContract, address }),
        ),
      );
      const balances = addresses.map((address, index) => {
        const balance = balanceData[index] || 0n;
        return {
          address,
          balance,
          decimals: _decimals,
        };
      });

      return await Promise.all(balances);
    },
    {
      enabled: addresses.length > 0,
    },
  );
}

export interface IProposalInput {
  description: string;
}

/**
 * This hook is a simplified version meant to use on the Dashboard
 * since _currently_ the dashboard only supports creating proposals with descriptions
 *
 * todo: make an extension in the SDK that is more robust and user-friendly ?
 */
export function useProposalCreateMutation(contract: ThirdwebContract) {
  const { mutateAsync } = useSendAndConfirmTransaction();
  return useMutationWithInvalidate(
    async (proposal: IProposalInput) => {
      const { description } = proposal;
      const transaction = propose({
        contract,
        description,
        targets: [contract.address],
        values: [0n],
        calldatas: ["0x"],
      });
      return await mutateAsync(transaction);
    },
    {
      onSuccess: (_data, _options, _variables, invalidate) => {
        return invalidate([voteKeys.proposals(contract.address)]);
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
  contract: ThirdwebContract,
  proposalId: bigint,
) {
  const address = useActiveAccount()?.address;
  const contractAddress = contract.address;
  const { mutateAsync } = useSendAndConfirmTransaction();
  return useMutationWithInvalidate(
    async (voteItem: IVoteCast) => {
      invariant(contract, "contract is required");
      invariant(address, "address is required");
      const { voteType, reason } = voteItem;
      const transaction = castVoteWithReason({
        contract,
        proposalId,
        support: voteType,
        reason: reason ?? "",
      });
      return await mutateAsync(transaction);
    },
    {
      onSuccess: (_data, _options, _variables, invalidate) => {
        return invalidate([
          voteKeys.proposals(contractAddress),
          voteKeys.userHasVotedOnProposal(
            String(proposalId),
            contractAddress,
            address,
          ),
          voteKeys.canExecuteProposal(String(proposalId), contractAddress),
        ]);
      },
    },
  );
}

/**
 * This hook is a simplified version for the Dashboard
 * It doesn't pass any extra info to the execute function
 */
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
