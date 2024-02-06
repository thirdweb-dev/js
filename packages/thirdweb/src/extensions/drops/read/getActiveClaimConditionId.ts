import { readContract } from "../../../transaction/actions/read.js";
import type { TxOpts } from "../../../transaction/transaction.js";

/**
 * Retrieves the active claim condition ID.
 * @param options - The transaction options.
 * @returns A promise that resolves to the active claim condition ID.
 * @extension
 * @example
 * ```ts
 * import { getActiveClaimConditionId } from "thirdweb/extensions/drops";
 * const activeClaimConditionId = await getActiveClaimConditionId({ contract });
 * ```
 */
export async function getActiveClaimConditionId(options: TxOpts) {
  return readContract({
    ...options,
    method: "function getActiveClaimConditionId() returns (uint256)",
  });
}
