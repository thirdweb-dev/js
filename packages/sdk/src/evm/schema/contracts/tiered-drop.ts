import { BasisPointsSchema, BigNumberSchema } from "../shared";
import { BaseSignaturePayloadInput } from "./common";
import { constants } from "ethers";
import { z } from "zod";

/**
 * @internal
 */
export const TieredDropPayloadInput = BaseSignaturePayloadInput.extend({
  tierPriority: z.array(z.string()),
  royaltyRecipient: z.string().default(constants.AddressZero),
  royaltyBps: BasisPointsSchema.default(0),
  quantity: BigNumberSchema.default(1),
});

/**
 * @public
 */
export type TieredDropPayload = z.infer<typeof TieredDropPayloadInput>;

/**
 * @internal
 */
export type TieredDropPayloadWithSignature = {
  payload: TieredDropPayload;
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
