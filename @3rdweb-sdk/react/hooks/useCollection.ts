import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { getAllQueryKey } from "./useGetAll";
import {
  Edition,
  EditionMetadata,
  EditionMetadataInput,
} from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";

export interface EditionMetadataWithOwner extends EditionMetadata {
  owner: string | undefined;
}
// ----------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------

type Input = EditionMetadataInput["metadata"] & {
  supply: EditionMetadataInput["supply"];
};

export function useCollectionCreateAndMintMutation(contract?: Edition) {
  return useMutationWithInvalidate(
    async (metadataWithSupply: Input) => {
      invariant(contract, "contract is required");

      const { supply, ...metadata } = metadataWithSupply;

      return await contract.mint({ metadata, supply });
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([getAllQueryKey(contract)]);
      },
    },
  );
}
