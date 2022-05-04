import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { getAllQueryKey } from "./useGetAll";
import { useAddress } from "@thirdweb-dev/react";
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
  const address = useAddress();
  return useMutationWithInvalidate(
    async (metadataWithSupply: EditionMutationInput) => {
      invariant(
        contract?.mint?.to,
        "contract does not support minting or is not initialized",
      );
      invariant(address, "address is not defined");

      const { supply, ...metadata } = metadataWithSupply;

      return await contract.mint.to(address, {
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
