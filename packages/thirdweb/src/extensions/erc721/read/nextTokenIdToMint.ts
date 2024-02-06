import { readContract } from "../../../transaction/actions/read.js";
import type { TxOpts } from "../../../transaction/transaction.js";

/**
 * Retrieves the next token ID to be minted in an ERC721 contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the next token ID as a bigint.
 * @extension ERC721
 * @example
 * ```ts
 * import { nextTokenIdToMint } from "thirdweb/extensions/erc721";
 * const nextTokenId = await nextTokenIdToMint({ contract });
 * ```
 */
export function nextTokenIdToMint(options: TxOpts): Promise<bigint> {
  return readContract({
    ...options,
    method: "function nextTokenIdToMint() view returns (uint256)",
  });
}
