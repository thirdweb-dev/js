import type { Abi } from "thirdweb/utils";
import { isAddress } from "thirdweb/utils";
import { z } from "zod";

const inputAbi = z.object({
  inputs: z
    .array(
      z.object({
        indexed: z.boolean().optional(),
        name: z.string(),
        type: z.string(),
      }),
    )
    .optional(),
  name: z.string().optional(),
  outputs: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
      }),
    )
    .optional(),
  type: z.string(),
});

export const webhookFormSchema = z
  .object({
    abi: z.string().optional(),
    addresses: z
      .string()
      .optional()
      .refine(
        (val: string | undefined) => {
          if (val === undefined || val.trim() === "") {
            return true;
          }
          return val
            .split(/[,\s]+/)
            .filter(Boolean)
            .every((a: string) => isAddress(a.trim()));
        },
        {
          message: "Enter valid addresses (comma-separated)",
        },
      ),
    chainIds: z
      .array(z.string())
      .min(1, { message: "Select at least one chain" }),
    eventTypes: z.array(z.string()).optional(),
    filterType: z.enum(["event", "transaction"]),
    fromAddresses: z
      .string()
      .optional()
      .refine(
        (val: string | undefined) => {
          if (val === undefined || val.trim() === "") {
            return true;
          }
          return val
            .split(/[,\s]+/)
            .filter(Boolean)
            .every((a: string) => isAddress(a.trim()));
        },
        {
          message: "Enter valid addresses (comma-separated)",
        },
      ),
    inputAbi: z.array(inputAbi).optional(),
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(100, { message: "Name must be at most 100 characters long" }),
    params: z.record(z.unknown()).optional(),
    secret: z.string().optional(),
    sigHash: z.union([z.string(), z.array(z.string())]).optional(),
    sigHashAbi: z.string().optional(),
    toAddresses: z
      .string()
      .optional()
      .refine(
        (val: string | undefined) => {
          if (val === undefined || val.trim() === "") {
            return true;
          }
          return val
            .split(/[,\s]+/)
            .filter(Boolean)
            .every((a: string) => isAddress(a.trim()));
        },
        {
          message: "Enter valid addresses (comma-separated) or leave empty",
        },
      ),
    webhookUrl: z.string().url({ message: "Must be a valid URL" }),
  })
  .refine(
    (data: {
      filterType: "event" | "transaction";
      addresses?: string;
      fromAddresses?: string;
    }) => {
      if (data.filterType === "event") {
        return data.addresses && data.addresses.trim() !== "";
      }
      return true;
    },
    {
      message: "Contract address is required for event webhooks",
      path: ["addresses"],
    },
  )
  .refine(
    (data: {
      filterType: "event" | "transaction";
      addresses?: string;
      fromAddresses?: string;
    }) => {
      if (data.filterType === "transaction") {
        return data.fromAddresses && data.fromAddresses.trim() !== "";
      }
      return true;
    },
    {
      message: "From address is required for transaction webhooks",
      path: ["fromAddresses"],
    },
  );

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
