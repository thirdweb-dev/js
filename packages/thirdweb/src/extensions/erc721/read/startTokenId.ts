import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

/**
 * Retrieves the starting token ID for the ERC721 contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the starting token ID as a bigint.
 * @extension ERC721
 * @example
 * ```ts
 * import { startTokenId } from "thirdweb/extensions/erc721";
 * const startTokenId = await startTokenId({ contract });
 * ```
 */
export function startTokenId(options: BaseTransactionOptions): Promise<bigint> {
  return readContract({
    ...options,
    method: "function startTokenId() view returns (uint256)",
  });
}
