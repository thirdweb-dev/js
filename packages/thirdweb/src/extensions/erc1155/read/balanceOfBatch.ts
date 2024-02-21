import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

export type BalanceOfBatchParams = {
  owners: readonly string[];
  tokenIds: readonly bigint[];
};

/**
 * Retrieves the next token ID to be minted in an ERC1155 contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the next token ID as a bigint.
 * @extension ERC1155
 * @example
 * ```ts
 * import { nextTokenIdToMint } from "thirdweb/extensions/erc1155";
 * const nextTokenId = await nextTokenIdToMint({ contract, owners, tokenIds });
 * ```
 */
export function balanceOfBatch(
  options: BaseTransactionOptions<BalanceOfBatchParams>,
): Promise<readonly bigint[]> {
  return readContract({
    ...options,
    method:
      "function balanceOfBatch(owners address[], tokenIds uint256[]) view returns (uint256[])",
    params: [options.owners, options.tokenIds],
  });
}
