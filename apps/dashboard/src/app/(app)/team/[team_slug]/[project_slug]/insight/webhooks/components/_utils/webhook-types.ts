import type { Abi } from "thirdweb/utils";
import { z } from "zod";
import { isValidAddress } from "./abi-utils";

// Form schema definition
export const webhookFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long and max 100" })
    .max(100, {
      message: "Name must be at least 3 characters long and max 100",
    })
    .nonempty({ message: "Name is required" }),
  webhookUrl: z.string().url({ message: "Must be a valid URL" }),
  filterType: z.enum(["event", "transaction"]),
  chainIds: z
    .array(z.string())
    .min(1, { message: "Select at least one chain" }),
  addresses: z
    .string()
    .nonempty({ message: "Addresses is required" })
    .refine((val) => val.split(",").every(isValidAddress), {
      message: "Enter a valid address",
    }),
  fromAddresses: z
    .string()
    .optional()
    .refine((val) => !val || val.split(",").every(isValidAddress), {
      message: "Enter a valid address",
    }),
  toAddresses: z
    .string()
    .nonempty({ message: "To address is required" })
    .refine((val) => val.split(",").every(isValidAddress), {
      message: "Enter a valid address",
    }),
  sigHash: z.string().optional(),
  sigHashAbi: z.string().optional(),
  abi: z.string().optional(),
  abiData: z.array(z.any()).optional(),
  secret: z.string().optional(),
  eventTypes: z.array(z.string()).optional(),
  params: z.any().optional(),
  timeout: z.number().optional(),
  maxRetries: z.number().optional(),
});

export interface WebhookFormValues extends z.infer<typeof webhookFormSchema> {
  sigHashAbi?: string;
}

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
