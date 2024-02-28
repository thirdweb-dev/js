import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getClaimConditionById } from "./claimConditionById.js";
import { claimCondition } from "./claimCondition.js";
import { getActiveClaimConditionId } from "./getActiveClaimConditionId.js";

export type GetActiveClaimConditionParams = { tokenId: bigint };

/**
 * Retrieves the active claim condition.
 * @param options - The transaction options.
 * @returns A promise that resolves to the active claim condition.
 * @throws An error if the claim condition is unsupported.
 * @extension
 * @example
 * ```ts
 * import { getActiveClaimCondition } from "thirdweb/extensions/erc1155";
 * const activeClaimCondition = await getActiveClaimCondition({ contract, tokenId });
 * ```
 */
export async function getActiveClaimCondition(
  options: BaseTransactionOptions<GetActiveClaimConditionParams>,
) {
  const [cc, cId] = await Promise.allSettled([
    claimCondition(options),
    getActiveClaimConditionId(options),
  ]);
  // if we have the claimcondition immediately -> return it
  if (cc.status === "fulfilled") {
    return cc.value;
  }
  // otherwise we need to get the claimcondition by id
  if (cId.status === "fulfilled") {
    return getClaimConditionById({ ...options, conditionId: cId.value });
  }
  // otherwise we have an "unsupported" error
  // TODO: potentially support more types?
  throw new Error("Unsupported claim condition");
}
