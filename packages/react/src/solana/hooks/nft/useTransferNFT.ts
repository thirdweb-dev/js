import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NFTCollection } from "@thirdweb-dev/solana";
import invariant from "tiny-invariant";

export type TransferNFTMutationParams = {
  receiverAddress: string;
  tokenAddress: string;
};

export function useTransferNFT(program: RequiredParam<NFTCollection>) {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ tokenAddress, receiverAddress }: TransferNFTMutationParams) => {
      invariant(program, "program is required");
      return await program.transfer(receiverAddress, tokenAddress);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}
