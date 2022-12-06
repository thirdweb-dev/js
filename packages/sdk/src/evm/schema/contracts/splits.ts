import { BasisPointsSchema } from "../../../core/schema/shared";
import { AddressSchema } from "../shared";
import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonTrustedForwarderSchema,
} from "./common";
import { z } from "zod";

const SplitRecipientInputSchema = z.object({
  address: AddressSchema,
  sharesBps: BasisPointsSchema.gt(0, "Shares must be greater than 0"),
});

const SplitRecipientOuputSchema = SplitRecipientInputSchema.extend({
  address: AddressSchema,
  sharesBps: BasisPointsSchema,
});

export const SplitsContractInput = CommonContractSchema.extend({
  recipients: z
    .array(SplitRecipientInputSchema)
    .default([])
    .superRefine((val, context) => {
      const addressMap: Record<string, boolean> = {};
      let totalShares = 0;
      for (let index = 0; index < val.length; index++) {
        const entry = val[index];
        if (addressMap[entry.address]) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate address.`,
            path: [index, `address`],
          });
        }
        addressMap[entry.address] = true;
        totalShares += entry.sharesBps;
        if (totalShares > 10000) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Total shares cannot go over 100%.`,
            path: [index, `sharesBps`],
          });
        }
      }
      if (totalShares !== 10000) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Total shares need to add up to 100%. Total shares are currently ${
            totalShares / 100
          }%`,
          path: [],
        });
      }
    }),
});

export const SplitsContractOutput = CommonContractOutputSchema.extend({
  recipients: z.array(SplitRecipientOuputSchema),
});

export const SplitsContractDeploy = SplitsContractInput.merge(
  SplitsContractInput,
).merge(CommonTrustedForwarderSchema);

export const SplitsContractSchema = {
  deploy: SplitsContractDeploy,
  output: SplitsContractOutput,
  input: SplitsContractInput,
};
