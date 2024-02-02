import { type TxOpts } from "~thirdweb/transaction/transaction.js";
import { readContract } from "~thirdweb/transaction/actions/read.js";

export type OwnerOfParams = { tokenId: bigint };

/**
 * Retrieves the owner of a specific ERC721 token.
 * @param options - The transaction options.
 * @returns A promise that resolves to the address of the token owner.
 * @example
 * ```ts
 * import { ownerOf } from "thirdweb/extensions/erc721";
 * const owner = await ownerOf({ contract, tokenId: 1n });
 * ```
 */
export function ownerOf(options: TxOpts<OwnerOfParams>): Promise<string> {
  return readContract({
    ...options,
    method:
      "function ownerOf(uint256 tokenId) external view returns (address owner)",
    params: [BigInt(options.tokenId)],
  });
}
