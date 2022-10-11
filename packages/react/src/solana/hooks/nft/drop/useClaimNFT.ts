import { createSOLProgramQueryKey } from "../../../../core/query-utils/query-key";
import { RequiredParam } from "../../../../core/types/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NFTDrop } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";
import { ClaimNFTParams } from "../../../types";

/**
 * Claim NFTs from an NFT Drop program
 * @param program - The NFT Drop program instance to claim from
 *
 * @example
 * ```jsx
 * import { useProgram, useClaimNFT } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const program = useProgram("{{program_address}}");
 *   const { mutateAsync: claim, isLoading, error } = useClaimNFT(program);
 *
 *   return (
 *     <button onClick={() => claim(1)}>
 *       Claim
 *     </button>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useClaimNFT(program: RequiredParam<NFTDrop>) {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: ClaimNFTParams) => {
      invariant(program, "program is required");
      return await program.claimTo(data.to, data.amount);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}
