import {
  readContract,
  type BaseTransactionOptions,
} from "../../../transaction/index.js";

export type TokenUriParams = { tokenId: bigint };

/**
 * Retrieves the URI associated with a specific ERC1155 token.
 * @param options - The transaction options.
 * @returns A Promise that resolves to the token URI.
 * @extension ERC1155
 * @example
 * ```ts
 * import { tokenURI } from "thirdweb/extensions/erc155";
 * const uri = await tokenURI({ contract, tokenId: 1n });
 * ```
 */
export function tokenURI(
  options: BaseTransactionOptions<TokenUriParams>,
): Promise<string> {
  return readContract({
    ...options,
    method:
      "function tokenURI(uint256 tokenId) external view returns (string memory)",
    params: [options.tokenId],
  });
}
