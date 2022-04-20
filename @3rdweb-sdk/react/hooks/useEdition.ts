import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { getAllQueryKey } from "./useGetAll";
import {
  Edition,
  EditionMetadata,
  EditionMetadataInput,
} from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";
import { parseAttributes } from "utils/parseAttributes";

export interface EditionMetadataWithOwner extends EditionMetadata {
  owner: string | undefined;
}
// ----------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------

export type EditionMutationInput = EditionMetadataInput["metadata"] & {
  supply: EditionMetadataInput["supply"];
};

export function useEditionCreateAndMintMutation(contract?: Edition) {
  return useMutationWithInvalidate(
    async (metadataWithSupply: EditionMutationInput) => {
      invariant(contract, "contract is required");

      const { supply, ...metadata } = metadataWithSupply;

      return await contract.mint({
        metadata: parseAttributes(metadata),
        supply,
      });
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([getAllQueryKey(contract)]);
      },
    },
  );
}
