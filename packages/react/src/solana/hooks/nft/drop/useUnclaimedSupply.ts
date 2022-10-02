import { createSOLProgramQueryKey } from "../../../../core/query-utils/query-key";
import { RequiredParam } from "../../../../core/types/shared";
import { useQuery } from "@tanstack/react-query";
import type { NFTDrop } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function dropUnclaimedSupplyQuery(program: RequiredParam<NFTDrop>) {
  return {
    queryKey: createSOLProgramQueryKey(program, [
      "totalUnclaimedSupply",
    ] as const),

    queryFn: async () => {
      invariant(program, "program is required");

      return await program.totalUnclaimedSupply();
    },
    enabled: !!program,
  };
}

/**
 * Get the total unclaimed supply of NFTs on an NFT Drop
 * @param program - The NFT Drop program to get the unclaimed supply on
 *
 * @example
 * ```jsx
 * import { useProgram, useDropTotalUnclaimedSupply } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const program = useProgram("{{program_address}}");
 *   const { data: unclaimedSupply, isLoading } = useDropTotalUnclaimedSupply(program);
 *
 *   return (
 *     <p>{unclaimedSupply}</p>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useDropUnclaimedSupply(program: RequiredParam<NFTDrop>) {
  return useQuery(dropUnclaimedSupplyQuery(program));
}
