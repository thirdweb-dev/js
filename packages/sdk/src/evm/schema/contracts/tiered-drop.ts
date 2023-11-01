import { BasisPointsSchema } from "../../../core/schema/shared";
import { BigNumberSchema } from "../shared/BigNumberSchema";
import { AddressOrEnsSchema } from "../shared/AddressOrEnsSchema";
import { constants } from "ethers";
import { z } from "zod";
import { BaseSignaturePayloadInput } from "./common/signature";

/**
 * @internal
 */
export const TieredDropPayloadSchema = /* @__PURE__ */ (() =>
  BaseSignaturePayloadInput.extend({
    tierPriority: z.array(z.string()),
    royaltyRecipient: AddressOrEnsSchema.default(constants.AddressZero),
    royaltyBps: BasisPointsSchema.default(0),
    quantity: BigNumberSchema.default(1),
  }))();

/**
 * @public
 */
export type TieredDropPayloadInput = z.input<typeof TieredDropPayloadSchema>;

/**
 * @internal
 */
export type TieredDropPayloadOutput = z.output<typeof TieredDropPayloadSchema>;

/**
 * @internal
 */
export type TieredDropPayloadWithSignature = {
  payload: TieredDropPayloadOutput;
  signature: string;
};

export const GenericRequest = [
  {
    name: "validityStartTimestamp",
    type: "uint128",
  },
  {
    name: "validityEndTimestamp",
    type: "uint128",
  },
  {
    name: "uid",
    type: "bytes32",
  },
  {
    name: "data",
    type: "bytes",
  },
];
