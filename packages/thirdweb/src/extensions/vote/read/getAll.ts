import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getAllProposals } from "../__generated__/Vote/read/getAllProposals.js";
import { state } from "../__generated__/Vote/read/state.js";
import { getProposalVoteCounts } from "./getProposalVoteCounts.js";

/**
 * Get all proposals from a Vote contract with some extra info attached for each proposal (current state and votes)
 * @extension VOTE
 * @returns An array containing proposals data
 *
 * @example
 * ```ts
 * import { getAll } from "thirdweb/extension/getAll";
 *
 * const allProposals = await getAll({ contract });
 * ```
 */
export async function getAll(options: BaseTransactionOptions) {
  const _proposals = await getAllProposals(options);
  const _extraData = await Promise.all(
    _proposals.map((proposal) => {
      const params = {
        contract: options.contract,
        proposalId: proposal.proposalId,
      };
      return Promise.all([state(params), getProposalVoteCounts(params)]);
    }),
  );
  return _extraData.map(([state, votes], index) => {
    const data = _proposals[index];
    // We know `data` SHOULD exist but adding the error-throw below to make typescript happy
    if (!data) {
      throw new Error(`Proposal not found for index: ${index}`);
    }
    return {
      proposalId: data.proposalId,
      proposer: data.proposer,
      description: data.description,
      startBlock: data.startBlock,
      endBlock: data.endBlock,
      state: state,
      votes: votes,
      executions: data.targets.map((_, index) => ({
        toAddress: data.targets[index],
        nativeTokenValue: data.values[index],
        transactionData: data.calldatas[index],
      })),
    };
  });
}
