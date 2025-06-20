import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { getAllProposals } from "../__generated__/Vote/read/getAllProposals.js";
import { state } from "../__generated__/Vote/read/state.js";
import { ProposalState } from "../types.js";
import {
  getProposalVoteCounts,
  type ProposalVoteInfo,
} from "./getProposalVoteCounts.js";

/**
 * @extension VOTE
 */
export type ProposalItem = {
  /**
   * ID of the proposal
   */
  proposalId: bigint;
  /**
   * The wallet address of the proposer
   */
  proposer: string;
  /**
   * Description of the proposal
   */
  description: string;
  /**
   * The block number at which the proposal is open for voting
   */
  startBlock: bigint;
  /**
   * The block number where the proposal concludes its voting phase
   */
  endBlock: bigint;
  /**
   * The current state of the proposal,  represented in number
   */
  state: number;
  /**
   * The current state of the proposal, represented in a user-friendly string
   * Example: "pending" | "active" | "canceled"
   */
  stateLabel: string | undefined;
  /**
   * The current vote info. See type [`ProposalVoteInfo`](https://portal.thirdweb.com/references/typescript/v5/ProposalItem) for more context
   */
  votes: ProposalVoteInfo;
  /**
   * The array of containing info about the set of actions that will be executed onchain,
   * should the proposal pass
   */
  executions: Array<{
    toAddress: string | undefined;
    nativeTokenValue: bigint | undefined;
    transactionData: Hex | undefined;
  }>;
};

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
export async function getAll(
  options: BaseTransactionOptions,
): Promise<ProposalItem[]> {
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
      description: data.description,
      endBlock: data.endBlock,
      executions: data.targets.map((_, index) => ({
        nativeTokenValue: data.values[index],
        toAddress: data.targets[index],
        transactionData: data.calldatas[index],
      })),
      proposalId: data.proposalId,
      proposer: data.proposer,
      startBlock: data.startBlock,
      state: state,
      stateLabel: ProposalState[state],
      votes: votes,
    };
  });
}
