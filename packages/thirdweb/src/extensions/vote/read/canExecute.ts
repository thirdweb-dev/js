import { simulateTransaction } from "../../../transaction/actions/simulate.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { executeProposal } from "../write/executeProposal.js";

/**
 * Simulate the `execute` method of the Vote contract, to check if you can execute a proposal
 * @extension VOTE
 * @returns boolean - `true` if the proposal is executable, else `false`
 *
 * @example
 * ```ts
 * import { canExecute } from "thirdweb/extensions/vote";
 *
 * const executable = await canExecute({ contract, proposalId });
 * ```
 */
export async function canExecute(
  options: BaseTransactionOptions<{ proposalId: bigint }>,
) {
  try {
    const transaction = await executeProposal(options);
    await simulateTransaction({ transaction });
    return true;
  } catch {
    return false;
  }
}
