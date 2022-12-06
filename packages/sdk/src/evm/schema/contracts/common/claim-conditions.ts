import {
  AmountSchema,
  BytesLikeSchema,
  QuantitySchema,
} from "../../../../core/schema/shared";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/currency";
import {
  BigNumberishSchema,
  BigNumberSchema,
  StartDateSchema,
} from "../../shared";
import { CurrencyValueSchema } from "./currency";
import { SnapshotInputSchema } from "./snapshots";
import { BigNumber, BigNumberish, utils } from "ethers";
import { z } from "zod";

/**
 * @internal
 */
export const ClaimConditionMetadataSchema = z
  .object({
    name: z.string().optional(),
  })
  .catchall(z.unknown());

/**
 * @internal
 */
export const ClaimConditionInputSchema = z.object({
  startTime: StartDateSchema,
  currencyAddress: z.string().default(NATIVE_TOKEN_ADDRESS),
  price: AmountSchema.default(0),
  maxClaimableSupply: QuantitySchema,
  maxClaimablePerWallet: QuantitySchema,
  waitInSeconds: BigNumberishSchema.default(0),
  merkleRootHash: BytesLikeSchema.default(utils.hexZeroPad([0], 32)),
  snapshot: z.optional(SnapshotInputSchema).nullable(),
  metadata: ClaimConditionMetadataSchema.optional(),
});

/**
 * @internal
 */
export const ClaimConditionInputArray = z.array(ClaimConditionInputSchema);

/**
 * @internal
 */
export const PartialClaimConditionInputSchema =
  ClaimConditionInputSchema.partial();

/**
 * @internal
 */
export const ClaimConditionOutputSchema = ClaimConditionInputSchema.extend({
  availableSupply: QuantitySchema,
  currentMintSupply: QuantitySchema,
  currencyMetadata: CurrencyValueSchema.default({
    value: BigNumber.from("0"),
    displayValue: "0",
    symbol: "",
    decimals: 18,
    name: "",
  }),
  price: BigNumberSchema,
  waitInSeconds: BigNumberSchema,
  startTime: BigNumberSchema.transform((n) => new Date(n.toNumber() * 1000)),
  snapshot: SnapshotInputSchema.optional().nullable(),
});

export type AbstractClaimConditionContractStruct = {
  startTimestamp: BigNumberish;
  maxClaimableSupply: BigNumberish;
  supplyClaimed: BigNumberish;
  maxClaimablePerWallet: BigNumberish;
  merkleRoot: string;
  pricePerToken: BigNumberish;
  currency: string;
  waitTimeInSecondsBetweenClaims?: BigNumberish; // only in legacy claim conditions
  metadata?: string; // only for new claim conditions
};
