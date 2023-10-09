import { voteKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";
import {
  RequiredParam,
  useAddress,
  useContract,
  useContractMetadata,
  useSDK,
} from "@thirdweb-dev/react";
import type { Vote, VoteType } from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";

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
  contract: RequiredParam<Vote>,
  proposalId: string,
) {
  const address = useAddress();
  return useQueryWithNetwork(
    voteKeys.userHasVotedOnProposal(
      proposalId,
      contract?.getAddress(),
      address,
    ),
    async () => await contract?.hasVoted(proposalId, address),
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

export function useTokensDelegated(contract?: Vote) {
  const sdk = useSDK();
  const address = useAddress();

  return useQueryWithNetwork(
    voteKeys.delegation(contract?.getAddress(), address),
    async () => {
      invariant(address, "address is required");
      invariant(contract, "vote contract is required");

      const metadata = await contract?.metadata.get();
      const tokenAddress = metadata?.voting_token_address;
      const tokenContract = await sdk?.getToken(tokenAddress);
      const delegation = await tokenContract?.getDelegationOf(address);
      return delegation?.toLowerCase() === address.toLowerCase();
    },
    {
      enabled: !!contract && !!address,
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

export function useDelegateMutation(contract?: Vote) {
  const sdk = useSDK();
  const address = useAddress();

  const contractAddress = contract?.getAddress();

  return useMutationWithInvalidate(
    async () => {
      invariant(address, "address is required");
      invariant(contractAddress, "contract address is required");
      invariant(contract, "vote contract is required");

      const metadata = await contract?.metadata.get();
      const tokenAddress = metadata?.voting_token_address;
      const tokenContract = await sdk?.getToken(tokenAddress);
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
  contract: RequiredParam<Vote>,
  proposalId: string,
) {
  const address = useAddress();
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
