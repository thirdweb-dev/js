import { CacheKeyMap, NFTDropKeys, SignatureDropKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";
import { useContractMetadata } from "./useContract";
import { getAllQueryKey, getTotalCountQueryKey } from "./useGetAll";
import { useContractTypeOfContract, useWeb3 } from "@3rdweb-sdk/react";
import { useNFTDrop } from "@thirdweb-dev/react";
import {
  EditionDrop,
  NFTDrop,
  NFTMetadataInput,
  SignatureDrop,
  UploadProgressEvent,
} from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import invariant from "tiny-invariant";
import { parseAttributes } from "utils/parseAttributes";

export function useNFTDropContractMetadata(contractAddress?: string) {
  return useContractMetadata(useNFTDrop(contractAddress));
}
export function useNFTDropSupply(contractAddress?: string) {
  const dropContract = useNFTDrop(contractAddress);
  return useQueryWithNetwork(
    NFTDropKeys.supply(contractAddress),
    async () => {
      return {
        totalSupply:
          ((await dropContract?.totalClaimedSupply()) || BigNumber.from(0))
            .add(
              (await dropContract?.totalUnclaimedSupply()) || BigNumber.from(0),
            )
            ?.toNumber() || 0,
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

export function useNFTDropActiveClaimCondition(contractAddress?: string) {
  const dropContract = useNFTDrop(contractAddress);
  return useQueryWithNetwork(
    NFTDropKeys.activeClaimCondition(contractAddress),
    async () => {
      return await dropContract?.claimConditions.getActive();
    },
    {
      enabled: !!dropContract && !!contractAddress,
    },
  );
}

export function useNFTDropBalance(contractAddress?: string) {
  const dropContract = useNFTDrop(contractAddress);
  const { address } = useWeb3();
  return useQueryWithNetwork(
    NFTDropKeys.balanceOf(contractAddress, address),
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
    NFTDropKeys.batchesToReveal(contractAddress),
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

export function useNFTDropMintMutation(contract?: NFTDrop | SignatureDrop) {
  const contractType = useContractTypeOfContract(contract);
  return useMutationWithInvalidate(
    async (data: NFTMetadataInput) => {
      invariant(contract, "contract is required");
      return await contract.createBatch([parseAttributes(data)]);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        // this should not be possible, but we need to catch it in case it does
        // if we don't know we just invalidate everything.
        if (!contractType) {
          return invalidate(
            Object.keys(CacheKeyMap)
              .map((key) => {
                const cacheKeys = CacheKeyMap[key as keyof typeof CacheKeyMap];
                if ("list" in cacheKeys) {
                  return cacheKeys.list(contract?.getAddress());
                }
                return undefined as never;
              })
              .filter((fn) => !!fn),
          );
        }

        return invalidate([
          getAllQueryKey(contract),
          getTotalCountQueryKey(contract),
          CacheKeyMap[contractType].supply(contract?.getAddress()),
        ]);
      },
    },
  );
}

interface UploadWithProgress {
  metadata: NFTMetadataInput[];
  onProgress: (event: UploadProgressEvent) => void;
}

export function useDropBatchMint(
  contract?: NFTDrop | EditionDrop | SignatureDrop,
) {
  const contractType = useContractTypeOfContract(contract);
  return useMutationWithInvalidate(
    async (data: UploadWithProgress) => {
      invariant(contract, "contract is required");
      const { metadata, onProgress } = data;
      return await contract.createBatch(metadata, { onProgress });
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        // this should not be possible, but we need to catch it in case it does
        // if we don't know we just invalidate everything.
        if (!contractType) {
          return invalidate(
            Object.keys(CacheKeyMap)
              .map((key) => {
                const cacheKeys = CacheKeyMap[key as keyof typeof CacheKeyMap];
                if ("list" in cacheKeys) {
                  return cacheKeys.list(contract?.getAddress());
                }
                return undefined as never;
              })
              .filter((fn) => !!fn),
          );
        }

        return invalidate([
          getAllQueryKey(contract),
          getTotalCountQueryKey(contract),
          CacheKeyMap[contractType].supply(contract?.getAddress()),
        ]);
      },
    },
  );
}

export function useNFTDropResetClaimEligibilityMutation(
  contract?: NFTDrop | SignatureDrop,
) {
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

interface DelayedRevealInput {
  placeholder: NFTMetadataInput;
  metadatas: NFTMetadataInput[];
  password: string;
  onProgress: (event: UploadProgressEvent) => void;
}

export function useNFTDropDelayedRevealBatchMint(contract?: NFTDrop) {
  return useMutationWithInvalidate(
    async (data: DelayedRevealInput) => {
      invariant(contract, "contract is required");
      return await contract.revealer.createDelayedRevealBatch(
        data.placeholder,
        data.metadatas,
        data.password,
        { onProgress: data.onProgress },
      );
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          getAllQueryKey(contract),
          getTotalCountQueryKey(contract),
          NFTDropKeys.supply(contract?.getAddress()),
          NFTDropKeys.batchesToReveal(contract?.getAddress()),
          SignatureDropKeys.supply(contract?.getAddress()),
          SignatureDropKeys.batchesToReveal(contract?.getAddress()),
        ]);
      },
    },
  );
}

interface RevealInput {
  batchId: BigNumber;
  password: string;
}

export function useNFTDropRevealMutation(contract?: NFTDrop | SignatureDrop) {
  const contractType = useContractTypeOfContract(contract);
  return useMutationWithInvalidate(
    async (data: RevealInput) => {
      invariant(contract, "contract is required");

      return await contract.revealer.reveal(data.batchId, data.password);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        // this should not be possible, but we need to catch it in case it does
        // if we don't know we just invalidate everything.
        if (!contractType) {
          return invalidate(
            Object.keys(CacheKeyMap)
              .map((key) => {
                const cacheKeys = CacheKeyMap[key as keyof typeof CacheKeyMap];
                if ("list" in cacheKeys) {
                  return cacheKeys.list(contract?.getAddress());
                }
                return undefined as never;
              })
              .filter((fn) => !!fn),
          );
        }

        return invalidate([
          getAllQueryKey(contract),
          CacheKeyMap[contractType].detail(contract?.getAddress()),
          CacheKeyMap[contractType].batchesToReveal(contract?.getAddress()),
        ]);
      },
    },
  );
}
