import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getActiveClaimConditionId } from "../../__generated__/IDrop/read/getActiveClaimConditionId.js";
import { getClaimConditionById } from "../../__generated__/IDrop/read/getClaimConditionById.js";

/**
 * Retrieves the active claim condition.
 * @param options - The transaction options.
 * @returns A promise that resolves to the active claim condition.
 * @throws An error if the claim condition is unsupported.
 * @extension
 * @example
 * ```ts
 * import { getActiveClaimCondition } from "thirdweb/extensions/erc721";
 * const activeClaimCondition = await getActiveClaimCondition({ contract });
 * ```
 */
export async function getActiveClaimCondition(options: BaseTransactionOptions) {
  const conditionId = await getActiveClaimConditionId(options);

  return getClaimConditionById({ ...options, conditionId });
}
