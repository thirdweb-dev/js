import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NFTCollection, NFTMetadataInput } from "@thirdweb-dev/solana";
import invariant from "tiny-invariant";

export function useMintNFT(program: RequiredParam<NFTCollection>) {
  const queryClient = useQueryClient();
  return useMutation(
    async (metadata: NFTMetadataInput) => {
      invariant(program, "program is required");
      return await program.mint(metadata);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}
