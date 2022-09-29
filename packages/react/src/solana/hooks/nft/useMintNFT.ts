import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { MintNFTParams } from "../../../evm/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NFTCollection } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function useMintNFT(program: RequiredParam<NFTCollection>) {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: MintNFTParams) => {
      invariant(program, "program is required");
      return await program.mintTo(data.to, data.metadata);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}
