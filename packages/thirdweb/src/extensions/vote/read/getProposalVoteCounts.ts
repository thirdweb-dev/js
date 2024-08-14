import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {
  type ProposalVotesParams,
  proposalVotes,
} from "../__generated__/Vote/read/proposalVotes.js";
import type { VoteType } from "../types.js";

// @internal
export type ProposalVoteInfo = { [K in keyof typeof VoteType]: bigint };

/**
 * Get the info about Against, For and Abstain votes of a proposal
 * @param options
 * @returns the object containing the info about Against, For and Abstain votes of a proposal
 * @extension VOTE
 * @example
 * ```ts
 * import { getProposalVoteCounts } from "thirdweb/extensions/vote";
 *
 * const data = await getProposalVoteCounts({ contract, proposalId });
 *
 * // Example result
 * {
 *   against: 12, // 12 users voted against the proposal
 *   for: 104, // 104 users support the proposal
 *   abstain: 3, // 3 users voted abstain on this proposal
 * }
 * ```
 */
export async function getProposalVoteCounts(
  options: BaseTransactionOptions<ProposalVotesParams>,
): Promise<ProposalVoteInfo> {
  const votes = await proposalVotes(options);
  return {
    against: votes[0],
    for: votes[1],
    abstain: votes[2],
  };
}
