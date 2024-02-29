import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
/**
 * Retrieves the active claim condition ID.
 * @param options - The transaction options.
 * @returns A promise that resolves to the active claim condition ID.
 * @extension
 * @example
 * ```ts
 * import { getActiveClaimConditionId } from "thirdweb/extensions/erc721";
 * const activeClaimConditionId = await getActiveClaimConditionId({ contract });
 * ```
 */
export async function getActiveClaimConditionId(
  options: BaseTransactionOptions,
) {
  return readContract({
    ...options,
    method: [
  "0xc68907de",
  [],
  [
    {
      "type": "uint256"
    }
  ]
],
  });
}
