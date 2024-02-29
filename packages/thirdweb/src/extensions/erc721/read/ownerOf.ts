import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * Represents the parameters for the `ownerOf` function.
 */
export type OwnerOfParams = { tokenId: bigint };

/**
 * Retrieves the owner of a specific ERC721 token.
 * @param options - The transaction options.
 * @returns A promise that resolves to the address of the token owner.
 * @extension ERC721
 * @example
 * ```ts
 * import { ownerOf } from "thirdweb/extensions/erc721";
 * const owner = await ownerOf({ contract, tokenId: 1n });
 * ```
 */
export function ownerOf(
  options: BaseTransactionOptions<OwnerOfParams>,
): Promise<string> {
  return readContract({
    ...options,
    method: [
  "0x6352211e",
  [
    {
      "type": "uint256"
    }
  ],
  [
    {
      "type": "address"
    }
  ]
],
    params: [BigInt(options.tokenId)],
  });
}
