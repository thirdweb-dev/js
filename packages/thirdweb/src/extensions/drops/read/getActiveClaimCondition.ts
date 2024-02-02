import type { TxOpts } from "~thirdweb/transaction/transaction.js";
import { getClaimConditionById } from "./claimConditioById.js";
import { claimCondition } from "./claimCondition.js";
import { getActiveClaimConditionId } from "./getActiveClaimConditionId.js";

/**
 * Retrieves the active claim condition.
 * @param options - The transaction options.
 * @returns A promise that resolves to the active claim condition.
 * @throws An error if the claim condition is unsupported.
 * @example
 * ```ts
 * import { getActiveClaimCondition } from "thirdweb/extensions/drops";
 * const activeClaimCondition = await getActiveClaimCondition({ contract });
 * ```
 */
export async function getActiveClaimCondition(options: TxOpts) {
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
