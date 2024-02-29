import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
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
    method: [
  "0x5ab063e8",
  [
    {
      "type": "uint256"
    }
  ],
  [
    {
      "type": "uint256"
    }
  ]
],
    params: [options.tokenId],
  });
}
