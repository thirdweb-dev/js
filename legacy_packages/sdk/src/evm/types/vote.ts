import { ProposalState } from "../enums/vote/ProposalState";
import { VoteType } from "../enums/vote/Vote";
import { Currency } from "./currency";
import { BigNumber, BigNumberish, BytesLike } from "ethers";

export interface VoteSettings {
  votingDelay: string;
  votingPeriod: string;
  votingTokenAddress: string;
  votingTokenMetadata: Currency;
  votingQuorumFraction: string;
  proposalTokenThreshold: string;
}

export interface ProposalVote {
  type: VoteType;
  label: string;
  count: BigNumber;
}

export interface ProposalExecutable {
  /**
   * The address of the contract that the proposal will execute a transaction on.
   * If the proposal is sending a token to a wallet, this address should be the address
   * of the wallet that will be receiving the tokens.
   */
  toAddress: string;

  /**
   * The amount of a native token that may be sent if a proposal is executing a token transfer.
   */
  nativeTokenValue: BigNumberish;

  /**
   * The transaction payload that will be executed if the proposal is approved.
   */
  transactionData: BytesLike;
}

export interface Proposal {
  /**
   * The unique identifier of the proposal.
   */
  proposalId: BigNumber;

  /**
   * The address of the wallet that created the proposal.
   */
  proposer: string;

  /**
   * The description of the proposal.
   */
  description: string;

  startBlock: BigNumber;
  endBlock: BigNumber;

  /**
   * The current state of the proposal.
   */
  state: ProposalState;

  /**
   * All votes that have been cast on the proposal.
   */
  votes: ProposalVote[];

  /**
   * All executions that have been proposed for the proposal.
   */
  executions: ProposalExecutable[];
}
