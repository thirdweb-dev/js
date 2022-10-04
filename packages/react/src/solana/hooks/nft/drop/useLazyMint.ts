import { createSOLProgramQueryKey } from "../../../../core/query-utils/query-key";
import { RequiredParam } from "../../../../core/types/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NFTMetadataInput, UploadProgressEvent } from "@thirdweb-dev/sdk";
import type { NFTDrop } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

/**
 * Lazy mint NFTs on an NFT Drop program
 * @param program - The NFT Drop program instance to lazy mint on
 *
 * @example
 * ```jsx
 * import { useProgram, useLazyMintNFT } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const program = useProgram("{{program_address}}");
 *   const { mutateAsync: lazyMint, isLoading, error } = useLazyMintNFT(program);
 *
 *   return (
 *     <button onClick={() => lazyMint({ name: "My NFT", description: "..." })}>
 *       Claim
 *     </button>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useLazyMint(
  program: RequiredParam<NFTDrop>,
  onProgress?: (progress: UploadProgressEvent) => void,
) {
  const queryClient = useQueryClient();
  return useMutation(
    async (metadata: NFTMetadataInput[]) => {
      invariant(program, "program is required");
      let options;
      if (onProgress) {
        options = {
          onProgress,
        };
      }
      return await program.lazyMint(metadata, options);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}
