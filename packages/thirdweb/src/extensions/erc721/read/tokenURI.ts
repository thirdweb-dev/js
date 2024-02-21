import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

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
    method: "function tokenURI(uint256 tokenId) returns (string memory)",
    params: [options.tokenId],
  });
}
