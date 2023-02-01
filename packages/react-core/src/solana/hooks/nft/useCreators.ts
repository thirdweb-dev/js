import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import {
  requiredParamInvariant,
  RequiredParam,
} from "../../../core/query-utils/required-param";
import { useQuery } from "@tanstack/react-query";
import { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";

export function nftCreatorsQuery(
  program: RequiredParam<NFTCollection | NFTDrop>,
) {
  return {
    queryKey: createSOLProgramQueryKey(program, ["creators"] as const),

    queryFn: async () => {
      requiredParamInvariant(program, "program is required");
      return await program.getCreators();
    },
    enabled: !!program,
  };
}

/**
 * Get the creators for an NFT program
 * @param program - The NFT program to get the creators for
 *
 * @example
 * ```jsx
 * import { useProgram, useCreators } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const { program } = useProgram("{{program_address}}");
 *   const { data: creators, isLoading } = useCreators(program);
 *
 *   return (
 *     <pre>{JSON.stringify(creators)}</pre>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useCreators(program: RequiredParam<NFTCollection | NFTDrop>) {
  return useQuery(nftCreatorsQuery(program));
}
