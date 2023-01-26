import { createSOLProgramQueryKey } from "../../../../core/query-utils/query-key";
import {
  requiredParamInvariant,
  RequiredParam,
} from "../../../../core/query-utils/required-param";
import { useQuery } from "@tanstack/react-query";
import type { NFTDrop } from "@thirdweb-dev/sdk/solana";

export function dropTotalClaimedSupplyQuery(program: RequiredParam<NFTDrop>) {
  return {
    queryKey: createSOLProgramQueryKey(program, [
      "totalClaimedSupply",
    ] as const),

    queryFn: async () => {
      requiredParamInvariant(program, "program is required");

      return await program.totalClaimedSupply();
    },
    enabled: !!program,
  };
}

/**
 * Get the total claimed supply of NFTs on an NFT Drop
 * @param program - The NFT Drop program to get the claimed supply on
 *
 * @example
 * ```jsx
 * import { useProgram, useDropTotalClaimedSupply } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const { program } = useProgram("{{program_address}}");
 *   const { data: claimedSupply, isLoading } = useDropTotalClaimedSupply(program);
 *
 *   return (
 *     <p>{claimedSupply}</p>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useDropTotalClaimedSupply(program: RequiredParam<NFTDrop>) {
  return useQuery(dropTotalClaimedSupplyQuery(program));
}
