import { isAddress } from "thirdweb/utils";
import type { Abi } from "thirdweb/utils";
import { z } from "zod";

const inputAbi = z.object({
  type: z.string(),
  name: z.string().optional(),
  inputs: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        indexed: z.boolean().optional(),
      }),
    )
    .optional(),
  outputs: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
      }),
    )
    .optional(),
});

export const webhookFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must be at most 100 characters long" }),
  webhookUrl: z.string().url({ message: "Must be a valid URL" }),
  filterType: z.enum(["event", "transaction"]),
  chainIds: z
    .array(z.string())
    .min(1, { message: "Select at least one chain" }),
  addresses: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val.trim() === "") {
          return true;
        }
        return val
          .split(/[\,\s]+/)
          .filter(Boolean)
          .every((a) => isAddress(a.trim()));
      },
      {
        message: "Enter valid addresses (comma-separated) or leave empty",
      },
    ),
  fromAddresses: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val.trim() === "") {
          return true;
        }
        return val
          .split(/[\,\s]+/)
          .filter(Boolean)
          .every((a) => isAddress(a.trim()));
      },
      {
        message: "Enter valid addresses (comma-separated) or leave empty",
      },
    ),
  toAddresses: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val.trim() === "") {
          return true;
        }
        return val
          .split(/[\,\s]+/)
          .filter(Boolean)
          .every((a) => isAddress(a.trim()));
      },
      {
        message: "Enter valid addresses (comma-separated) or leave empty",
      },
    ),
  sigHash: z.string().optional(),
  sigHashAbi: z.string().optional(),
  abi: z.string().optional(),
  inputAbi: z.array(inputAbi).optional(),
  secret: z.string().optional(),
  eventTypes: z.array(z.string()).optional(),
  params: z.record(z.unknown()).optional(),
});

export type WebhookFormValues = z.infer<typeof webhookFormSchema>;

export interface EventSignature {
  name: string;
  signature: string;
  abi?: string;
}

export interface FunctionSignature {
  name: string;
  signature: string;
  abi?: string;
}

export interface AbiData {
  fetchedAt: string;
  status: string;
  abi: Abi;
  events?: string[];
  functions?: string[];
  name?: string;
}

export type WebhookFormStep = "basicInfo" | "filterDetails" | "review";

export const WebhookFormSteps = {
  BasicInfo: "basicInfo" as WebhookFormStep,
  FilterDetails: "filterDetails" as WebhookFormStep,
  Review: "review" as WebhookFormStep,
} as const;
