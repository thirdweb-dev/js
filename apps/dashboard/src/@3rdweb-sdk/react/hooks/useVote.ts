import { thirdwebClient } from "@/constants/client";
import { type ThirdwebContract, getContract, toTokens } from "thirdweb";
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
  executeProposal,
  getAll,
  hasVoted,
  propose,
  token,
} from "thirdweb/extensions/vote";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import invariant from "tiny-invariant";
import { voteKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";

export function useVoteProposalList(contract?: ThirdwebContract) {
  return useQueryWithNetwork(
    voteKeys.proposals(contract?.address || ""),
    async () => {
      invariant(contract, "contract is required");
      return await getAll({ contract });
    },
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
      proposalId.toString(),
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
    voteKeys.canExecuteProposal(proposalId.toString(), contract.address),
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
      Array<{ address: string; balance: string; decimals: number }>
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
          balance: toTokens(balance, _decimals),
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
      const tokenContract = getContract({
        address: tokenAddress,
        chain: contract.chain,
        client: thirdwebClient,
      });
      const transaction = delegate({
        contract: tokenContract,
        delegatee: userAddress,
      });
      return await mutateAsync(transaction);
    },
    {
      onSuccess: (_data, _options, _variables, invalidate) => {
        return invalidate([voteKeys.delegation(contract.address, userAddress)]);
      },
    },
  );
}

/**
 * Get the decimals of the voting erc20 token
 */
export function useVotingTokenDecimals(contract: ThirdwebContract) {
  return useMutationWithInvalidate(async () => {
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
    return _decimals;
  });
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
            proposalId.toString(),
            contractAddress,
            address,
          ),
          voteKeys.canExecuteProposal(proposalId.toString(), contractAddress),
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
  contract: ThirdwebContract,
  proposalId: bigint,
) {
  const contractAddress = contract.address;
  const mutation = useSendAndConfirmTransaction();
  return useMutationWithInvalidate(
    async () => {
      const transaction = executeProposal({ contract, proposalId });
      return await mutation.mutateAsync(transaction);
    },
    {
      onSuccess: (_data, _options, _variables, invalidate) => {
        return invalidate([
          voteKeys.proposals(contractAddress),
          voteKeys.canExecuteProposal(proposalId.toString(), contractAddress),
        ]);
      },
    },
  );
}
