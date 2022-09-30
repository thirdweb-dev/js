import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useQuery } from "@tanstack/react-query";
import type { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function nftGetOneQuery(
  program: RequiredParam<NFTCollection | NFTDrop>,
  tokenAddress: RequiredParam<string>,
) {
  return {
    queryKey: createSOLProgramQueryKey(program, [
      "get",
      { tokenAddress },
    ] as const),

    queryFn: async () => {
      invariant(program, "program is required");
      invariant(tokenAddress, "tokenAddress is required");
      return await program.get(tokenAddress);
    },
    enabled: !!program && !!tokenAddress,
  };
}

/**
 * Get the metadata for a minted NFT
 * @param program - The NFT program to get NFT metadata from
 * @param - tokenAdress - The mint address of the NFT to get the metadata of
 *
 * @example
 * ```jsx
 * import { useProgram, useNFT } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const program = useProgram("{{program_address}}");
 *   const { data: metadata, isLoading } = useNFT(program, mintAddress);
 *
 *   return (
 *     <pre>{JSON.stringify(metadata)}</pre>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useNFT(
  program: RequiredParam<NFTCollection | NFTDrop>,
  tokenAddress: RequiredParam<string>,
) {
  return useQuery(nftGetOneQuery(program, tokenAddress));
}
