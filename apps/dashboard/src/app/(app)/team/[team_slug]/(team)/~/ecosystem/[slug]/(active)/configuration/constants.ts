import { isAddress, isHex } from "thirdweb/utils";
import z from "zod";

const isDomainRegex =
  /^(?:\*|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*(?:\*(?:\.[a-z0-9][a-z0-9-]{0,61}[a-z0-9](?:\.[a-z0-9][a-z0-9-]{0,61}[a-z0-9])*)?)|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]|localhost(?::\d{1,5})?)$/;

// Define schemas for the different operation types
const allowedTransactionSchema = z.object({
  chainId: z.number().refine(
    (data) => {
      if (data !== undefined) {
        return data > 0;
      }
      return true;
    },
    {
      message: "Invalid chain ID",
    },
  ),
  contractAddress: z
    .string()
    .optional()
    .transform((data) => (data?.length === 0 ? undefined : data))
    .refine(
      (data) => {
        if (data) {
          return isAddress(data);
        }
        return true;
      },
      {
        message: "Invalid contract address",
      },
    ),
  maxValue: z
    .string()
    .optional()
    .transform((data) => (data?.length === 0 ? undefined : data))
    .refine(
      (data) => {
        if (data) {
          return BigInt(data) >= 0;
        }
        return true;
      },
      {
        message: "Invalid max value",
      },
    ),
  selector: z
    .string()
    .optional()
    .transform((data) => (data?.length === 0 ? undefined : data))
    .refine(
      (data) => {
        if (data) {
          return isHex(data) && data.length === 10; // 0x + 4 bytes for the selector (8 chars)
        }
        return true;
      },
      {
        message: "Invalid function selector",
      },
    ),
});

const allowedTypedDataSchema = z
  .object({
    chainId: z
      .number()
      .optional()
      .refine(
        (data) => {
          if (data !== undefined) {
            return data > 0;
          }
          return true;
        },
        {
          message: "Invalid chain ID",
        },
      ),
    domain: z.string().refine((data) => data.length > 0, {
      message: "Domain is required",
    }),
    primaryType: z.string().optional(),
    verifyingContract: z
      .string()
      .optional()
      .transform((data) => (data?.length === 0 ? undefined : data))
      .refine(
        (data) => {
          if (data) {
            return isAddress(data);
          }
          return true;
        },
        {
          message: "Invalid verifying contract address",
        },
      ),
  })
  .transform((data) => {
    return {
      ...data,
      primaryType:
        data.primaryType && data.primaryType.length > 0
          ? data.primaryType
          : undefined,
      verifyingContract:
        data.verifyingContract && data.verifyingContract.length > 0
          ? data.verifyingContract
          : undefined,
    };
  });

const personalSignRestrictionSchema = z.discriminatedUnion("messageType", [
  z.object({
    allowedTransactions: z
      .array(allowedTransactionSchema)
      .optional()
      .transform((data) => (data?.length === 0 ? undefined : data)),
    messageType: z.literal("userOp"),
  }),
  z.object({
    message: z.string().optional(),
    messageType: z.literal("other"),
  }),
]);

const allowedOperationsSchema = z.discriminatedUnion("signMethod", [
  z.object({
    allowedTransactions: z
      .array(allowedTransactionSchema)
      .optional()
      .transform((data) => (data?.length === 0 ? undefined : data)),
    signMethod: z.literal("eth_signTransaction"),
  }),
  z.object({
    allowedTypedData: z
      .array(allowedTypedDataSchema)
      .optional()
      .transform((data) => (data?.length === 0 ? undefined : data)),
    signMethod: z.literal("eth_signTypedData_v4"),
  }),
  z.object({
    allowedPersonalSigns: z
      .array(personalSignRestrictionSchema)
      .optional()
      .transform((data) => (data?.length === 0 ? undefined : data)),
    signMethod: z.literal("personal_sign"),
  }),
]);

export const partnerFormSchema = z
  .object({
    accessControl: z
      .object({
        allowedOperations: z
          .array(allowedOperationsSchema)
          .optional()
          .transform((data) => (data?.length === 0 ? undefined : data)),
        serverVerifier: z
          .object({
            headers: z
              .array(
                z.object({
                  key: z.string(),
                  value: z.string(),
                }),
              )
              .optional(),
            url: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    accessControlEnabled: z.boolean().default(false), // This is rejoined to return a string (and later split again) since react-hook-form's typings can't handle different input vs output types
    allowedOperationsEnabled: z.boolean().default(false),
    bundleIds: z
      .string()
      .trim()
      .transform((s) =>
        s
          .split(/,| /)
          .filter((d) => d.length > 0)
          .join(","),
      ),
    domains: z
      .string()
      .trim()
      .transform((s) => s.split(/,| /).filter((d) => d.length > 0))
      .refine((domains) => domains.every((d) => isDomainRegex.test(d)), {
        message: "Invalid domain format", // This error message CANNOT be within the array iteration, or the FormMessage won't be able to find it in the form state
      })
      .transform((s) => s.join(",")),
    name: z
      .string()
      .trim()
      .min(3, {
        message: "Name must be at least 3 characters",
      })
      .refine((name) => /^[a-zA-Z0-9 ]*$/.test(name), {
        message: "Name can only contain letters, numbers and spaces",
      }),
    serverVerifierEnabled: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // If serverVerifier is enabled, validate the URL
      if (data.accessControlEnabled && data.serverVerifierEnabled) {
        return (
          data.accessControl?.serverVerifier?.url &&
          data.accessControl.serverVerifier.url.trim() !== ""
        );
      }
      // Otherwise, no validation needed
      return true;
    },
    {
      message:
        "Server Verifier URL is required when Server Verifier is enabled",
      path: ["accessControl", "serverVerifier", "url"],
    },
  )
  .refine(
    (data) => {
      // If serverVerifier is enabled, validate the URL format
      if (
        data.accessControlEnabled &&
        data.serverVerifierEnabled &&
        data.accessControl?.serverVerifier?.url
      ) {
        try {
          new URL(data.accessControl.serverVerifier.url);
          return true;
        } catch {
          return false;
        }
      }
      // Otherwise, no validation needed
      return true;
    },
    {
      message: "Please enter a valid URL",
      path: ["accessControl", "serverVerifier", "url"],
    },
  );
