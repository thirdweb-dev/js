import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {
  type ExecuteParams,
  execute,
} from "../__generated__/Vote/write/execute.js";
import { proposalExists } from "../read/proposalExists.js";

/**
 * Execute a Proposal
 * @extension VOTE
 * @returns a prepared transaction for the `execute` method
 *
 * @example
 * ```ts
 * import { executeProposal } from "thirdweb/extensions/vote";
 *
 * const transaction = executeProposal({ contract, proposalId });
 * const tx = await sendTransaction({ transaction, account });
 * ```
 */
export function executeProposal(
  options: BaseTransactionOptions<{ proposalId: bigint }>,
) {
  return execute({
    asyncParams: async () => getExecuteParams(options),
    contract: options.contract,
  });
}

/**
 * @internal
 */
async function getExecuteParams(
  options: BaseTransactionOptions<{ proposalId: bigint }>,
): Promise<ExecuteParams> {
  const { proposalId } = options;
  const exists = await proposalExists(options);
  if (!exists) {
    throw new Error(`Proposal ID: ${proposalId} does not exists`);
  }
  const [{ getAllProposals }, { keccak256 }, { stringToBytes }] =
    await Promise.all([
      import("../__generated__/Vote/read/getAllProposals.js"),
      import("../../../utils/hashing/keccak256.js"),
      import("../../../utils/encoding/to-bytes.js"),
      import("../__generated__/Vote/write/execute.js"),
    ]);

  // Sadly there isn't a way to fetch a single proposal so we have to load them all
  const _proposals = await getAllProposals(options);
  const proposal = _proposals.find((p) => p.proposalId === proposalId);
  if (!proposal) {
    throw new Error(`Could not find proposalId: ${proposalId}`);
  }
  const { targets, values, calldatas, description } = proposal;
  const descriptionHash = keccak256(stringToBytes(description));
  return {
    calldatas,
    descriptionHash,
    targets,
    values,
  };
}
