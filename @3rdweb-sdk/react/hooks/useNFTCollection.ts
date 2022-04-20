import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { useContractMetadata } from "./useContract";
import { getAllQueryKey, getTotalCountQueryKey } from "./useGetAll";
import { useNFTCollection } from "@thirdweb-dev/react";
import { NFTCollection, NFTMetadataInput } from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";
import { parseAttributes } from "utils/parseAttributes";

export function useNFTContractMetadata(contractAddress?: string) {
  return useContractMetadata(useNFTCollection(contractAddress));
}
// ----------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------

export function useNFTCollectionMintMutation(contract?: NFTCollection) {
  return useMutationWithInvalidate(
    async (data: NFTMetadataInput) => {
      invariant(contract, "contract is required");

      return await contract.mint(parseAttributes(data));
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          getAllQueryKey(contract),
          getTotalCountQueryKey(contract),
        ]);
      },
    },
  );
}
