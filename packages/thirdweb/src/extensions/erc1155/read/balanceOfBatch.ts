import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * Represents the parameters for the balanceOfBatch function.
 */
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
    method: [
  "0x4e1273f4",
  [
    {
      "type": "address[]"
    },
    {
      "type": "uint256[]"
    }
  ],
  [
    {
      "type": "uint256[]"
    }
  ]
],
    params: [options.owners, options.tokenIds],
  });
}
