import { BasisPointsSchema } from "../../../core/schema/shared";
import { BigNumberSchema } from "../shared";
import { BaseSignaturePayloadInput } from "./common";
import { constants } from "ethers";
import { z } from "zod";

/**
 * @internal
 */
export const TieredDropPayloadSchema = BaseSignaturePayloadInput.extend({
  tierPriority: z.array(z.string()),
  royaltyRecipient: z.string().default(constants.AddressZero),
  royaltyBps: BasisPointsSchema.default(0),
  quantity: BigNumberSchema.default(1),
});

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
