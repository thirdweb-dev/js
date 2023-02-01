import { createSOLProgramQueryKey } from "../../../../core/query-utils/query-key";
import { RequiredParam } from "../../../../core/query-utils/required-param";
import { useQuery } from "@tanstack/react-query";
import type { NFTDrop } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function claimConditionsQuery(program: RequiredParam<NFTDrop>) {
  return {
    queryKey: createSOLProgramQueryKey(program, ["claimConditions"] as const),

    queryFn: async () => {
      invariant(program, "program is required");

      return await program.claimConditions.get();
    },
    enabled: !!program,
  };
}

/**
 * Get the current claim conditions on an NFT Drop
 * @param program - The NFT Drop program to get the claim conditions for
 *
 * @example
 * ```jsx
 * import { useProgram, useClaimConditions } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const { program } = useProgram("{{program_address}}");
 *   const { data: claimConditions, isLoading } = useClaimConditions(program);
 *
 *   return (
 *     <p>{claimConditions?.price.displayValue}</p>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useClaimConditions(program: RequiredParam<NFTDrop>) {
  return useQuery(claimConditionsQuery(program));
}
