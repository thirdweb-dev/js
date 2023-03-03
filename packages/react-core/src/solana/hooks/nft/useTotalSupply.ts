import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import {
  requiredParamInvariant,
  RequiredParam,
} from "../../../core/query-utils/required-param";
import { useQuery } from "@tanstack/react-query";
import type { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";

export function nftTotalSupplyQuery(
  program: RequiredParam<NFTCollection | NFTDrop>,
) {
  return {
    queryKey: createSOLProgramQueryKey(program, ["supply"] as const),

    queryFn: async () => {
      requiredParamInvariant(program, "program is required");
      return program.totalSupply();
    },
    enabled: !!program,
  };
}

/**
 * Get the total supply of NFTs on the program
 * @param program - The NFT program to get the total supply of
 *
 * @example
 * ```jsx
 * import { useProgram, useTotalSupply } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const { program } = useProgram("{{program_address}}");
 *   const { data: supply, isLoading } = useTotalSupply(program);
 *
 *   return (
 *     <pre>{JSON.stringify(supply)}</pre>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useTotalSupply(
  program: RequiredParam<NFTCollection | NFTDrop>,
) {
  return useQuery(nftTotalSupplyQuery(program));
}
