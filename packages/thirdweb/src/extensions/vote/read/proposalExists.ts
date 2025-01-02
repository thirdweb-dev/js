import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { type StateParams, state } from "../__generated__/Vote/read/state.js";

/**
 * Check if a proposal exists based on a given proposalId
 * @returns `true` if the proposal exists, else `false`
 * @extension VOTE
 *
 * @example
 * ```ts
 * import { proposalExists } from "thirdweb/extensions/vote";
 *
 * // Check if the proposal with proposalId `4` exists
 * const exists = await proposalExists({ contract, proposalId: 4n }); // either `true` or `false`
 * ```
 */
export async function proposalExists(
  options: BaseTransactionOptions<StateParams>,
) {
  try {
    await state(options);
    return true;
  } catch {
    // If it throws an error then the proposal(id) doesn't exist
    return false;
  }
}
