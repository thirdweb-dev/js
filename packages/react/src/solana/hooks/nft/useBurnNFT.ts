import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

/**
 * Burn an NFT owned by the connected wallet
 * @param program - The NFT program instance to burn NFTs on
 *
 * @example
 * ```jsx
 * import { useProgram, useBurnNFT } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const program = useProgram("{{program_address}}");
 *   const { mutateAsync: burn, isLoading, error } = useBurnNFT(program);
 *
 *   return (
 *     <button
 *       onClick={() => burn("...")}
 *     >
 *       Burn
 *     </button>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useBurnNFT(program: RequiredParam<NFTCollection | NFTDrop>) {
  const queryClient = useQueryClient();
  return useMutation(
    async (nftAddress: string) => {
      invariant(program, "program is required");
      return await program.burn(nftAddress);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}
