import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import {
  requiredParamInvariant,
  RequiredParam,
} from "../../../core/query-utils/required-param";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";

export type TransferNFTMutationParams = {
  receiverAddress: string;
  tokenAddress: string;
};

/**
 * Transfer NFTs from the connected wallet to another wallet
 * @param program - The NFT program instance to transfer NFTs on
 *
 * @example
 * ```jsx
 * import { useProgram, useTransferNFT } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const { program } = useProgram("{{program_address}}");
 *   const { mutateAsync: transfer, isLoading, error } = useTransferNFT(program);
 *
 *   return (
 *     <button
 *       onClick={() => transfer({
 *         receiverAddress: "{{wallet_address}}",
 *         tokenAddress: "..."
 *       })}
 *     >
 *       Transfer
 *     </button>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useTransferNFT(
  program: RequiredParam<NFTCollection | NFTDrop>,
) {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ tokenAddress, receiverAddress }: TransferNFTMutationParams) => {
      requiredParamInvariant(program, "program is required");
      return await program.transfer(receiverAddress, tokenAddress);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}
