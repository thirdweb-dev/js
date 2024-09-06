import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { ClaimCondition } from "../../../../utils/extensions/drops/types.js";
import * as MultiActiveId from "../../__generated__/IDropERC20/read/getActiveClaimConditionId.js";
import * as MultiById from "../../__generated__/IDropERC20/read/getClaimConditionById.js";

/**
 * Retrieves the active claim condition.
 * @param options - The transaction options.
 * @returns A promise that resolves to the active claim condition.
 * @throws An error if the claim condition is unsupported.
 * @extension ERC20
 * @example
 * ```ts
 * import { getActiveClaimCondition } from "thirdweb/extensions/erc20";
 * const activeClaimCondition = await getActiveClaimCondition({ contract });
 * ```
 */
export async function getActiveClaimCondition(
  options: BaseTransactionOptions,
): Promise<ClaimCondition> {
  try {
    const conditionId = await MultiActiveId.getActiveClaimConditionId(options);
    return MultiById.getClaimConditionById({ ...options, conditionId });
  } catch {
    throw new Error("Claim condition not found");
  }
}

export function isGetActiveClaimConditionSupported(
  availableSelectors: string[],
) {
  return (
    MultiActiveId.isGetActiveClaimConditionIdSupported(availableSelectors) &&
    MultiById.isGetClaimConditionByIdSupported(availableSelectors)
  );
}
