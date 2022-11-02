import { BigNumber, CallOverrides, utils } from "ethers";
import { z } from "zod";

export const BigNumberSchema = z
  .union([
    z.string(),
    z.number(),
    z.bigint(),
    z.custom<BigNumber>((data) => {
      return BigNumber.isBigNumber(data);
    }),
  ])
  .transform((arg) => BigNumber.from(arg));

export const BigNumberishSchema = BigNumberSchema.transform((arg) =>
  arg.toString(),
);

export const BigNumberTransformSchema = z
  .union([
    z.bigint(),
    z.custom<BigNumber>((data) => {
      return BigNumber.isBigNumber(data);
    }),
  ])
  .transform((arg) => {
    return BigNumber.from(arg).toString();
  });

export const AddressSchema = z.string().refine(
  (arg) => utils.isAddress(arg),
  (out) => {
    return {
      message: `${out} is not a valid address`,
    };
  },
);

export const RawDateSchema = z.date().transform((i) => {
  return BigNumber.from(Math.floor(i.getTime() / 1000));
});

/**
 * Default to now
 */
export const StartDateSchema = RawDateSchema.default(new Date(0));

/**
 * Default to 10 years from now
 */
export const EndDateSchema = RawDateSchema.default(
  new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
);

export const CallOverrideSchema: z.ZodType<CallOverrides> = z
  .object({
    gasLimit: BigNumberishSchema.optional(),
    gasPrice: BigNumberishSchema.optional(),
    maxFeePerGas: BigNumberishSchema.optional(),
    maxPriorityFeePerGas: BigNumberishSchema.optional(),
    nonce: BigNumberishSchema.optional(),
    value: BigNumberishSchema.optional(),
    blockTag: z.union([z.string(), z.number()]).optional(),
    from: AddressSchema.optional(),
    type: z.number().optional(),
  })
  .strict();
