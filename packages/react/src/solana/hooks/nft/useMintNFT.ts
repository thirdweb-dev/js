import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { MintNFTParams } from "../../../evm/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NFTCollection, NFTMetadataInput } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function useMintNFT(program: RequiredParam<NFTCollection>) {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: MintNFTParams) => {
      invariant(program, "program is required");
      // TODO fix this once consolidated
      return await program.mintTo(data.to, data.metadata as NFTMetadataInput);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}
