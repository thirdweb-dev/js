import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * Represents the parameters for retrieving the token URI.
 */
export type TokenUriParams = { tokenId: bigint };

/**
 * Retrieves the URI associated with a specific ERC721 token.
 * @param options - The transaction options.
 * @returns A Promise that resolves to the token URI.
 * @extension ERC721
 * @example
 * ```ts
 * import { tokenURI } from "thirdweb/extensions/erc721";
 * const uri = await tokenURI({ contract, tokenId: 1n });
 * ```
 */
export function tokenURI(
  options: BaseTransactionOptions<TokenUriParams>,
): Promise<string> {
  return readContract({
    ...options,
    method: [
  "0xc87b56dd",
  [
    {
      "type": "uint256"
    }
  ],
  [
    {
      "type": "string"
    }
  ]
],
    params: [options.tokenId],
  });
}
