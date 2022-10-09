import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useQuery } from "@tanstack/react-query";
import { Token } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function tokenSupplyQuery(program: RequiredParam<Token>) {
  return {
    queryKey: createSOLProgramQueryKey(program, ["totalSupply"] as const),
    queryFn: async () => {
      invariant(program, "program is required");

      return await program.totalSupply();
    },
    enabled: !!program,
  };
}

/**
 * Get the total circulating supply of a token
 * @param program - The token program to get the supply of
 *
 * @example
 * ```jsx
 * import { useProgram, useMintToken } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const program = useProgram("{{program_address}}");
 *   const { data: totalSupply, isLoading } = useTokenSupply(program);
 *
 *   return (
 *     <p>{totalSupply}</p>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useTokenSupply(program: RequiredParam<Token>) {
  return useQuery(tokenSupplyQuery(program));
}
