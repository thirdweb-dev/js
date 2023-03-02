import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import {
  requiredParamInvariant,
  RequiredParam,
} from "../../../core/query-utils/required-param";
import { useQuery } from "@tanstack/react-query";
import type { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";

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
      requiredParamInvariant(program, "program is required");
      requiredParamInvariant(tokenAddress, "tokenAddress is required");
      return await program.get(tokenAddress);
    },
    enabled: !!program && !!tokenAddress,
  };
}

/**
 * Get the metadata for a minted NFT
 * @param program - The NFT program to get NFT metadata from
 * @param tokenAddress - The mint address of the NFT to get the metadata of *
 * @example
 * ```jsx
 * import { useProgram, useNFT } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const { program } = useProgram("{{program_address}}");
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
