import {
  readContract,
  type BaseTransactionOptions,
} from "../../../transaction/index.js";

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
export async function getActiveClaimConditionId(
  options: BaseTransactionOptions,
) {
  return readContract({
    ...options,
    method: "function getActiveClaimConditionId() returns (uint256)",
  });
}
