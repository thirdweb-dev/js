import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { proposalExists } from "./proposalExists.js";

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
  const { proposalId, contract } = options;
  const exists = await proposalExists(options);
  if (!exists) {
    throw new Error(`Proposal ID: ${proposalId} does not exists`);
  }
  const [
    { getAllProposals },
    { keccak256 },
    { stringToBytes },
    { execute },
    { simulateTransaction },
  ] = await Promise.all([
    import("../__generated__/Vote/read/getAllProposals.js"),
    import("../../../utils/hashing/keccak256.js"),
    import("../../../utils/encoding/to-bytes.js"),
    import("../__generated__/Vote/write/execute.js"),
    import("../../../transaction/actions/simulate.js"),
  ]);
  const _proposals = await getAllProposals(options);
  const proposal = _proposals.find((p) => p.proposalId === proposalId);
  if (!proposal) {
    throw new Error(`Could not find proposalId: ${proposalId}`);
  }
  const { targets, values, calldatas, description } = proposal;
  const descriptionHash = keccak256(stringToBytes(description));
  const transaction = execute({
    contract,
    targets,
    values,
    calldatas,
    descriptionHash,
  });
  try {
    await simulateTransaction({ transaction });
    return true;
  } catch {
    return false;
  }
}
