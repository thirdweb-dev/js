import { CallOverrides } from "ethers";
import { z } from "zod";
import { AddressOrEnsSchema } from "./AddressOrEnsSchema";
import { BigNumberishSchema } from "./BigNumberSchema";

export const CallOverrideSchema: z.ZodType<CallOverrides> =
  /* @__PURE__ */ (() =>
    z
      .object({
        gasLimit: BigNumberishSchema.optional(),
        gasPrice: BigNumberishSchema.optional(),
        maxFeePerGas: BigNumberishSchema.optional(),
        maxPriorityFeePerGas: BigNumberishSchema.optional(),
        nonce: BigNumberishSchema.optional(),
        value: BigNumberishSchema.optional(),
        blockTag: z.union([z.string(), z.number()]).optional(),
        from: AddressOrEnsSchema.optional(),
        type: z.number().optional(),
      })
      .strict())();
