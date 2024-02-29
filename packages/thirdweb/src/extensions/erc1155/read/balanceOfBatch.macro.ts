import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

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
    method: $run$(() =>
      prepareMethod(
        "function balanceOfBatch(address[], uint256[]) returns (uint256[])",
      ),
    ),
    params: [options.owners, options.tokenIds],
  });
}
