import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * Represents the parameters for retrieving the URI of a token.
 */
export type TokenUriParams = { tokenId: bigint };

/**
 * Retrieves the URI associated with a specific ERC1155 token.
 * @param options - The transaction options.
 * @returns A Promise that resolves to the token URI.
 * @extension ERC1155
 * @example
 * ```ts
 * import { uri } from "thirdweb/extensions/erc155";
 * const tokenUri = await uri({ contract, tokenId: 1n });
 * ```
 */
export function uri(
  options: BaseTransactionOptions<TokenUriParams>,
): Promise<string> {
  return readContract({
    ...options,
    method: [
  "0x0e89341c",
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
