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
 * Note: the count is displayed in "wei"
 * @extension VOTE
 * @example
 * ```ts
 * import { getProposalVoteCounts } from "thirdweb/extensions/vote";
 *
 * const data = await getProposalVoteCounts({ contract, proposalId });
 *
 * // Example result
 * {
 *   for: 12000000000000000000n, // 12 tokens (with a decimals of 18) were used to vote "for"
 *   against: 7000000000000000000n, // 7 tokens (with a decimals of 18) were used to vote "against"
 *   abstain: 0n, // no user has voted abstain on this proposal
 * }
 * ```
 */
export async function getProposalVoteCounts(
  options: BaseTransactionOptions<ProposalVotesParams>,
): Promise<ProposalVoteInfo> {
  const votes = await proposalVotes(options);
  return {
    abstain: votes[2],
    against: votes[0],
    for: votes[1],
  };
}
