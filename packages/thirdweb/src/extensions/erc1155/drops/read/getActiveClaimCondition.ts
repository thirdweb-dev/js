import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { ClaimCondition } from "../../../../utils/extensions/drops/types.js";
import {
  type GetActiveClaimConditionIdParams,
  getActiveClaimConditionId,
} from "../../__generated__/IDrop1155/read/getActiveClaimConditionId.js";
import { getClaimConditionById } from "../../__generated__/IDrop1155/read/getClaimConditionById.js";

export type GetActiveClaimConditionParams = GetActiveClaimConditionIdParams;
/**
 * Retrieves the active claim condition.
 * @param options - The transaction options.
 * @returns A promise that resolves to the active claim condition.
 * @throws An error if the claim condition is unsupported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getActiveClaimCondition } from "thirdweb/extensions/erc1155";
 * const activeClaimCondition = await getActiveClaimCondition({ contract, tokenId });
 * ```
 */
export async function getActiveClaimCondition(
  options: BaseTransactionOptions<GetActiveClaimConditionParams>,
): Promise<ClaimCondition> {
  try {
    const conditionId = await getActiveClaimConditionId(options);
    return getClaimConditionById({ ...options, conditionId });
  } catch {
    throw new Error("Claim condition not found");
  }
}
