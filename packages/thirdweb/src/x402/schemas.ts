import {
  EvmNetworkToChainId,
  type ExactEvmPayload,
  type Network,
  PaymentPayloadSchema,
  PaymentRequirementsSchema,
  SettleResponseSchema,
  SupportedPaymentKindsResponseSchema,
  VerifyResponseSchema,
} from "x402/types";
import { z } from "zod";
import type { Chain } from "../chains/types.js";
import { PaymentSchemeSchema } from "./types.js";

const FacilitatorNetworkSchema = z.string();

export type FacilitatorNetwork = z.infer<typeof FacilitatorNetworkSchema>;

const RequestedPaymentPayloadSchema = PaymentPayloadSchema.extend({
  network: FacilitatorNetworkSchema,
  scheme: PaymentSchemeSchema,
});

export type RequestedPaymentPayload = z.infer<
  typeof RequestedPaymentPayloadSchema
> & {
  /** x402 v2: the payment requirement accepted by the client, as sent by the server */
  accepted?: Record<string, unknown>;
  /** x402 v2: the resource being paid for */
  resource?: Record<string, unknown>;
};
export type UnsignedPaymentPayload = Omit<
  RequestedPaymentPayload,
  "payload"
> & {
  payload: Omit<ExactEvmPayload, "signature"> & { signature: undefined };
};

const RequestedPaymentRequirementsSchema = PaymentRequirementsSchema.extend({
  network: FacilitatorNetworkSchema,
  scheme: PaymentSchemeSchema,
});

export type RequestedPaymentRequirements = z.infer<
  typeof RequestedPaymentRequirementsSchema
>;

const MAX_UINT256 = 2n ** 256n - 1n;
const ATOMIC_AMOUNT_REGEX = /^\d{1,78}$/;

/**
 * Returns true if the value is a base-10 integer string that fits in a uint256.
 * @internal
 */
export function isAtomicAmount(value: unknown): value is string {
  return (
    typeof value === "string" &&
    ATOMIC_AMOUNT_REGEX.test(value) &&
    BigInt(value) <= MAX_UINT256
  );
}

/**
 * Reads an amount field and returns it in canonical form (no leading zeros).
 */
function readAtomicAmount(
  requirement: Record<string, unknown>,
  field: "amount" | "maxAmountRequired",
): string | undefined {
  const value = requirement[field];
  if (value === undefined) {
    return undefined;
  }
  if (!isAtomicAmount(value)) {
    throw new Error(
      `Invalid payment requirements: ${field} must be an integer string in base units`,
    );
  }
  return BigInt(value).toString();
}

/**
 * Payment requirements normalised from a server 402 response.
 * @internal
 */
type NormalizedPaymentRequirements = {
  /** The normalised requirement */
  requirements: RequestedPaymentRequirements;
  /** The requirement exactly as sent by the server */
  raw: Record<string, unknown>;
};

/**
 * Extracts the top-level resource object of a 402 payment required response, if any.
 */
function getPaymentRequiredResource(
  paymentRequired: unknown,
): Record<string, unknown> | undefined {
  if (!isRecord(paymentRequired)) {
    return undefined;
  }
  const resource = paymentRequired.resource;
  if (isRecord(resource) && typeof resource.url === "string") {
    return resource;
  }
  return undefined;
}

/**
 * Normalises a payment requirement from a 402 response (x402 v1, v2, or v2 envelopes with v1 requirements).
 *
 * @param requirement - The raw payment requirement
 * @param context - Fallback values for fields that v2 moves out of the requirement
 * @returns The normalised requirement and the raw requirement
 * @throws If the amount is missing, malformed, or ambiguous, or the requirement is otherwise invalid
 * @internal
 */
export function normalizePaymentRequirements(
  requirement: unknown,
  context: { resourceUrl?: string } = {},
): NormalizedPaymentRequirements {
  if (!isRecord(requirement)) {
    throw new Error("Invalid payment requirements: expected an object");
  }

  const amount = readAtomicAmount(requirement, "amount");
  const maxAmountRequired = readAtomicAmount(requirement, "maxAmountRequired");
  if (
    amount !== undefined &&
    maxAmountRequired !== undefined &&
    amount !== maxAmountRequired
  ) {
    throw new Error(
      `Invalid payment requirements: amount (${amount}) and maxAmountRequired (${maxAmountRequired}) do not match`,
    );
  }
  const normalizedAmount = amount ?? maxAmountRequired;
  if (normalizedAmount === undefined) {
    throw new Error(
      "Invalid payment requirements: missing amount or maxAmountRequired",
    );
  }

  const requirements = RequestedPaymentRequirementsSchema.parse({
    ...requirement,
    maxAmountRequired: normalizedAmount,
    resource:
      typeof requirement.resource === "string"
        ? requirement.resource
        : context.resourceUrl,
    description:
      typeof requirement.description === "string"
        ? requirement.description
        : "",
    mimeType:
      typeof requirement.mimeType === "string" ? requirement.mimeType : "",
  });

  return { requirements, raw: requirement };
}

/**
 * Parses a decoded 402 payment required object (PAYMENT-REQUIRED header or JSON body).
 * Every entry of `accepts` is normalised with {@link normalizePaymentRequirements}.
 *
 * @param paymentRequired - The decoded payment required object
 * @param requestUrl - The URL of the request, used when the response carries no resource URL
 * @returns The x402 version, error, top-level resource, resolved resource URL and normalised requirements
 * @throws If the object has no accepts array or any requirement is invalid
 * @internal
 */
export function parsePaymentRequired(
  paymentRequired: unknown,
  requestUrl?: string,
): {
  x402Version: number | undefined;
  error: string | undefined;
  resource: Record<string, unknown> | undefined;
  resourceUrl: string | undefined;
  accepts: NormalizedPaymentRequirements[];
} {
  const data = isRecord(paymentRequired) ? paymentRequired : {};
  const error = typeof data.error === "string" ? data.error : undefined;
  if (!Array.isArray(data.accepts)) {
    throw new Error(
      `402 response has no usable x402 payment requirements. ${error ?? ""}`,
    );
  }
  const resource = getPaymentRequiredResource(data);
  const resourceUrl =
    typeof resource?.url === "string" ? resource.url : requestUrl;
  return {
    x402Version:
      typeof data.x402Version === "number" ? data.x402Version : undefined,
    error,
    resource,
    resourceUrl,
    accepts: data.accepts.map((requirement) =>
      normalizePaymentRequirements(requirement, { resourceUrl }),
    ),
  };
}

/**
 * Parses the payment requirements of a 402 response for display only, skipping invalid entries.
 *
 * @param paymentRequired - The decoded payment required object
 * @param requestUrl - The URL of the request, used when the response carries no resource URL
 * @returns The normalised requirements that passed validation
 * @internal
 */
export function parsePaymentRequirementsForDisplay(
  paymentRequired: unknown,
  requestUrl?: string,
): RequestedPaymentRequirements[] {
  if (!isRecord(paymentRequired) || !Array.isArray(paymentRequired.accepts)) {
    return [];
  }
  const resource = getPaymentRequiredResource(paymentRequired);
  const resourceUrl =
    typeof resource?.url === "string" ? resource.url : requestUrl;
  return paymentRequired.accepts.flatMap((requirement) => {
    try {
      return [
        normalizePaymentRequirements(requirement, { resourceUrl }).requirements,
      ];
    } catch {
      return [];
    }
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const FacilitatorSettleResponseSchema = SettleResponseSchema.extend({
  network: FacilitatorNetworkSchema,
  errorMessage: z.string().optional(),
  fundWalletLink: z.string().optional(),
  allowance: z.string().optional(),
  balance: z.string().optional(),
});
export type FacilitatorSettleResponse = z.infer<
  typeof FacilitatorSettleResponseSchema
>;

const FacilitatorVerifyResponseSchema = VerifyResponseSchema.extend({
  errorMessage: z.string().optional(),
  fundWalletLink: z.string().optional(),
  allowance: z.string().optional(),
  balance: z.string().optional(),
});

export type FacilitatorVerifyResponse = z.infer<
  typeof FacilitatorVerifyResponseSchema
>;

export const SupportedSignatureTypeSchema = z.enum([
  "TransferWithAuthorization",
  "Permit",
]);

const FacilitatorSupportedAssetSchema = z.object({
  address: z.string(),
  decimals: z.number(),
  eip712: z.object({
    name: z.string(),
    version: z.string(),
    primaryType: SupportedSignatureTypeSchema,
  }),
});

const FacilitatorSupportedResponseSchema =
  SupportedPaymentKindsResponseSchema.extend({
    kinds: z.array(
      z.object({
        x402Version: z.union([z.literal(1), z.literal(2)]),
        scheme: PaymentSchemeSchema,
        network: FacilitatorNetworkSchema,
        extra: z
          .object({
            defaultAsset: FacilitatorSupportedAssetSchema.optional(),
            supportedAssets: z
              .array(FacilitatorSupportedAssetSchema)
              .optional(),
          })
          .optional(),
      }),
    ),
  }).describe("Supported payment kinds for this facilitator");

export type FacilitatorSupportedResponse = z.infer<
  typeof FacilitatorSupportedResponseSchema
>;

function isEvmChain(caip2ChainId: Caip2ChainId): boolean {
  return caip2ChainId.startsWith("eip155:");
}

/**
 * Extract numeric chain ID from CAIP-2 EVM chain (e.g., "eip155:1" -> 1)
 */
export function extractEvmChainId(caip2ChainId: Caip2ChainId): number | null {
  if (!isEvmChain(caip2ChainId)) {
    return null;
  }
  const parts = caip2ChainId.split(":");
  const chainId = Number(parts[1]);
  return Number.isNaN(chainId) ? null : chainId;
}

/**
 * CAIP-2 compliant blockchain identifier
 * @see https://chainagnostic.org/CAIPs/caip-2
 */
const Caip2ChainIdSchema = z
  .union([z.string(), z.number().int().positive()])
  .transform((value, ctx) => {
    // Handle proper CAIP-2 format (already valid)
    if (typeof value === "string" && value.includes(":")) {
      const [namespace, reference] = value.split(":");

      // Solana mainnet/devnet aliases
      if (namespace === "solana" && reference === "mainnet") {
        return "solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ" as const;
      }
      if (namespace === "solana" && reference === "devnet") {
        return "solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K" as const;
      }

      // Validate CAIP-2 format
      const namespaceRegex = /^[-a-z0-9]{3,8}$/;
      const referenceRegex = /^[-_a-zA-Z0-9]{1,32}$/;

      if (!namespaceRegex.test(namespace ?? "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid CAIP-2 namespace: ${namespace}. Must match [-a-z0-9]{3,8}`,
        });
        return z.NEVER;
      }

      if (!referenceRegex.test(reference ?? "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid CAIP-2 reference: ${reference}. Must match [-_a-zA-Z0-9]{1,32}`,
        });
        return z.NEVER;
      }

      return value as `${string}:${string}`;
    }

    // Handle number (EVM chain ID fallback)
    if (typeof value === "number") {
      return `eip155:${value}` as const;
    }

    // Handle string number (EVM chain ID fallback)
    const numValue = Number(value);
    if (!Number.isNaN(numValue) && Number.isInteger(numValue) && numValue > 0) {
      return `eip155:${numValue}` as const;
    }

    const mappedChainId = EvmNetworkToChainId.get(value as Network);
    if (mappedChainId) {
      return `eip155:${mappedChainId}` as const;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid chain ID: ${value}. Must be a CAIP-2 identifier (e.g., "eip155:1", "solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ"), a numeric chain ID for EVM, or "solana:mainnet"/"solana:devnet"`,
    });
    return z.NEVER;
  })
  .describe(
    "CAIP-2 blockchain identifier (e.g., 'eip155:1' for Ethereum, 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ' for Solana mainnet). Also accepts numeric EVM chain IDs (e.g., 1, 137) or aliases ('solana:mainnet', 'solana:devnet') for backward compatibility.",
  );

type Caip2ChainId = z.output<typeof Caip2ChainIdSchema>;

export function networkToCaip2ChainId(network: string | Chain): Caip2ChainId {
  if (typeof network === "object") {
    return `eip155:${network.id}` as const;
  }
  return Caip2ChainIdSchema.parse(network);
}
