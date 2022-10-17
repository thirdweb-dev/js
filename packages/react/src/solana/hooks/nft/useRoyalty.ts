import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useQuery } from "@tanstack/react-query";
import { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function nftRoyaltyQuery(
  program: RequiredParam<NFTCollection | NFTDrop>,
) {
  return {
    queryKey: createSOLProgramQueryKey(program, ["royalty"] as const),

    queryFn: async () => {
      invariant(program, "program is required");
      return await program.getRoyalty();
    },
    enabled: !!program,
  };
}

/**
 * Get the royalty for an NFT program
 * @param program - The NFT program to get the royalty for
 *
 * @example
 * ```jsx
 * import { useProgram, useRoyalty } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const { program } = useProgram("{{program_address}}");
 *   const { data: royalty, isLoading } = useRoyalty(program);
 *
 *   return (
 *     <p>{royalty}</p>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useRoyalty(program: RequiredParam<NFTCollection | NFTDrop>) {
  return useQuery(nftRoyaltyQuery(program));
}
