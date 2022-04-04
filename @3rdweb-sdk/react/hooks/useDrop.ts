import { dropKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";
import { useContractMetadata } from "./useContract";
import { getAllQueryKey, getTotalCountQueryKey } from "./useGetAll";
import { useWeb3 } from "@3rdweb-sdk/react";
import { useNFTDrop } from "@thirdweb-dev/react";
import {
  ClaimConditionInput,
  NFTDrop,
  NFTMetadataInput,
} from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import invariant from "tiny-invariant";

export function useDropContractMetadata(contractAddress?: string) {
  return useContractMetadata(useNFTDrop(contractAddress));
}
export function useDropSupply(contractAddress?: string) {
  const dropContract = useNFTDrop(contractAddress);
  return useQueryWithNetwork(
    dropKeys.supply(contractAddress),
    async () => {
      return {
        totalSupply: (await dropContract?.totalSupply())?.toNumber() || 0,
        totalClaimedSupply:
          (await dropContract?.totalClaimedSupply())?.toNumber() || 0,
        totalUnclaimedSupply:
          (await dropContract?.totalUnclaimedSupply())?.toNumber() || 0,
      };
    },
    {
      enabled: !!dropContract && !!contractAddress,
    },
  );
}

export function useDropActiveClaimCondition(contractAddress?: string) {
  const dropContract = useNFTDrop(contractAddress);
  return useQueryWithNetwork(
    dropKeys.activeClaimCondition(contractAddress),
    async () => {
      return await dropContract?.claimConditions.getActive();
    },
    {
      enabled: !!dropContract && !!contractAddress,
    },
  );
}

export function useDropBalance(contractAddress?: string) {
  const dropContract = useNFTDrop(contractAddress);
  const { address } = useWeb3();
  return useQueryWithNetwork(
    dropKeys.balanceOf(contractAddress, address),
    async () => {
      return await dropContract?.balanceOf(address || "");
    },
    {
      enabled: !!dropContract && !!contractAddress && !!address,
    },
  );
}

export function useBatchesToReveal(contractAddress?: string) {
  const dropContract = useNFTDrop(contractAddress);
  const { address } = useWeb3();
  return useQueryWithNetwork(
    dropKeys.batchesToReveal(contractAddress),
    async () => {
      return await dropContract?.revealer.getBatchesToReveal();
    },
    {
      enabled: !!dropContract && !!contractAddress && !!address,
    },
  );
}

// ----------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------

export function useDropMintMutation(contract?: NFTDrop) {
  return useMutationWithInvalidate(
    async (data: NFTMetadataInput) => {
      invariant(contract, "contract is required");
      return await contract.createBatch([data]);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          getAllQueryKey(contract),
          getTotalCountQueryKey(contract),
          dropKeys.supply(contract?.getAddress()),
        ]);
      },
    },
  );
}

export function useDropBatchMint(contract?: NFTDrop) {
  return useMutationWithInvalidate(
    async (data: NFTMetadataInput[]) => {
      invariant(contract, "contract is required");
      return await contract.createBatch(data);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          getAllQueryKey(contract),
          getTotalCountQueryKey(contract),
          dropKeys.supply(contract?.getAddress()),
        ]);
      },
    },
  );
}

export function useDropResetClaimEligibilityMutation(contract?: NFTDrop) {
  return useMutationWithInvalidate(async () => {
    invariant(contract, "contract is required");
    const claimConditions = await contract.claimConditions.getAll();

    const cleaned = claimConditions.map((c) => ({
      ...c,
      price: c.currencyMetadata.displayValue,
      maxQuantity: c.maxQuantity.toString(),
      quantityLimitPerTransaction: c.quantityLimitPerTransaction.toString(),
    }));

    return await contract.claimConditions.set(cleaned, true);
  });
}

export function useDropClaimConditionMutation(contract?: NFTDrop) {
  return useMutationWithInvalidate(
    async (data: ClaimConditionInput[]) => {
      invariant(contract, "contract is required");
      return await contract.claimConditions.set(data);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          dropKeys.activeClaimCondition(contract?.getAddress()),
        ]);
      },
    },
  );
}

interface DelayedRevealInput {
  placeholder: NFTMetadataInput;
  metadatas: NFTMetadataInput[];
  password: string;
}

export function useDropDelayedRevealBatchMint(contract?: NFTDrop) {
  return useMutationWithInvalidate(
    async (data: DelayedRevealInput) => {
      invariant(contract, "contract is required");
      return await contract.revealer.createDelayedRevealBatch(
        data.placeholder,
        data.metadatas,
        data.password,
      );
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          getAllQueryKey(contract),
          getTotalCountQueryKey(contract),
          dropKeys.supply(contract?.getAddress()),
          dropKeys.batchesToReveal(contract?.getAddress()),
        ]);
      },
    },
  );
}

interface RevealInput {
  batchId: BigNumber;
  password: string;
}

export function useRevealMutation(contract?: NFTDrop) {
  return useMutationWithInvalidate(
    async (data: RevealInput) => {
      invariant(contract, "contract is required");

      return await contract.revealer.reveal(data.batchId, data.password);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          getAllQueryKey(contract),
          dropKeys.detail(contract?.getAddress()),
          dropKeys.batchesToReveal(contract?.getAddress()),
        ]);
      },
    },
  );
}
