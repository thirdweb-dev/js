import { createSOLProgramQueryKey } from "../../../../core/query-utils/query-key";
import { RequiredParam } from "../../../../core/types/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NFTDrop, NFTDropConditionsInput } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

/**
 * Set Claim Conditions to an NFT Drop program
 * @param program - The NFT Drop program to set claim conditions for
 *
 * @example
 * ```jsx
 * import { useProgram, useSetClaimConditions } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const program = useProgram("{{program_address}}");
 *   const { mutateAsync: setClaimConditions, isLoading, error } = useSetClaimConditions(program);
 *
 *   return (
 *     <button onClick={() => setClaimConditions(metadata)}>
 *       Set Claim Conditions
 *     </button>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useSetClaimConditions(program: RequiredParam<NFTDrop>) {
  const queryClient = useQueryClient();
  return useMutation(
    async (metadata: NFTDropConditionsInput) => {
      invariant(program, "program is required");
      return await program.claimConditions.set(metadata)
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}
