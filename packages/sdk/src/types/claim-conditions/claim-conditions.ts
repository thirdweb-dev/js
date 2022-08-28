import {
  SnapshotInfoSchema,
  SnapshotInputSchema,
  SnapshotSchema,
} from "../../schema/contracts/common/snapshots";
import { z } from "zod";
import {
  ClaimConditionInputSchema,
  ClaimConditionOutputSchema,
  PartialClaimConditionInputSchema,
} from "../../schema/contracts/common/claim-conditions";
import { BigNumber, BigNumberish, BytesLike, CallOverrides } from "ethers";

/**
 * Represents a claim condition fetched from the SDK
 * @public
 */
export type ClaimCondition = z.output<typeof ClaimConditionOutputSchema>;

/**
 * @public
 */
export type SnapshotInfo = z.output<typeof SnapshotInfoSchema>;

/**
 * @public
 */
export type Snapshot = z.output<typeof SnapshotSchema>;

/**
 * Input model to pass a snapshot of addresses + amount claimable for a claim condition
 * @public
 */
export type SnapshotInput = z.input<typeof SnapshotInputSchema>;

/**
 * Input model to create a claim condition with optional snapshot of wallets
 * @public
 */
export type ClaimConditionInput = z.input<
  typeof PartialClaimConditionInputSchema
>;

/**
 * @public
 */
export type FilledConditionInput = z.output<typeof ClaimConditionInputSchema>;

/**
 * @public
 */
export type ClaimVerification = {
  overrides: CallOverrides;
  proofs: BytesLike[];
  maxQuantityPerTransaction: BigNumber;
  price: BigNumber;
  currencyAddress: string;
};

export type ClaimConditionsForToken = {
  tokenId: BigNumberish;
  claimConditions: ClaimConditionInput[];
};
