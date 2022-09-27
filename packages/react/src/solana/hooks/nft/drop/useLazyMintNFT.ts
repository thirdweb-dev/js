import { createSOLProgramQueryKey } from "../../../../core/query-utils/query-key";
import { RequiredParam } from "../../../../core/types/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NFTDrop, NFTMetadataInput } from "@thirdweb-dev/solana";
import invariant from "tiny-invariant";

export function useLazyMintNFT(program: RequiredParam<NFTDrop>) {
  const queryClient = useQueryClient();
  return useMutation(
    async (metadata: NFTMetadataInput[]) => {
      invariant(program, "program is required");
      return await program.lazyMint(metadata);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}
