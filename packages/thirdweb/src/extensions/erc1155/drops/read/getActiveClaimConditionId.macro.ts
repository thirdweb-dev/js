import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

/**
 * Parameters for getting the active claim condition ID.
 */
export type GetActiveClaimConditionIdParams = { tokenId: bigint };

/**
 * Retrieves the active claim condition ID.
 * @param options - The transaction options.
 * @returns A promise that resolves to the active claim condition ID.
 * @extension
 * @example
 * ```ts
 * import { getActiveClaimConditionId } from "thirdweb/extensions/erc1155";
 * const activeClaimConditionId = await getActiveClaimConditionId({ contract, tokenId });
 * ```
 */
export async function getActiveClaimConditionId(
  options: BaseTransactionOptions<GetActiveClaimConditionIdParams>,
) {
  return readContract({
    ...options,
    method: $run$(() =>
      prepareMethod(
        "function getActiveClaimConditionId(uint256) returns (uint256)",
      ),
    ),
    params: [options.tokenId],
  });
}
