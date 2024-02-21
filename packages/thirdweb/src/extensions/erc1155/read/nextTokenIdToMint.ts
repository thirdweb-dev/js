import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

/**
 * Retrieves the next token ID to be minted in an ERC1155 contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the next token ID as a bigint.
 * @extension ERC1155
 * @example
 * ```ts
 * import { nextTokenIdToMint } from "thirdweb/extensions/erc1155";
 * const nextTokenId = await nextTokenIdToMint({ contract });
 * ```
 */
export function nextTokenIdToMint(
  options: BaseTransactionOptions,
): Promise<bigint> {
  return readContract({
    ...options,
    method: "function nextTokenIdToMint() view returns (uint256)",
  });
}
