import { createSOLProgramQueryKey } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { MintNFTParams } from "../../../evm/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NFTCollection } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

/**
 * Mint NFTs on your NFT program
 * @param program - The NFT program to mint NFTs to
 *
 * @example
 * ```jsx
 * import { useProgram, useMintNFT } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const { program } = useProgram("{{program_address}}");
 *   const { mutateAsync: mint, isLoading, error } = useMintNFT(program);
 *
 *   function mintNFT() {
 *     const metadata = { name: "First NFT", description: "This is a cool NFT!" };
 *     mint({ to: "{{wallet_address}}", metadata });
 *   }
 *
 *   return (
 *     <button onClick={() => mintNFT()}>
 *       Mint
 *     </button>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useMintNFT(program: RequiredParam<NFTCollection>) {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: MintNFTParams) => {
      invariant(program, "program is required");
      return await program.mintTo(data.to, data.metadata);
    },
    {
      onSettled: () =>
        queryClient.invalidateQueries(createSOLProgramQueryKey(program)),
    },
  );
}
