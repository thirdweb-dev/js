import {
  EvmNetworkToChainId,
  type Network,
  PaymentPayloadSchema,
  PaymentRequirementsSchema,
  SettleResponseSchema,
  SupportedPaymentKindsResponseSchema,
  VerifyResponseSchema,
} from "x402/types";
import { z } from "zod";

const FacilitatorNetworkSchema = z.string();

export type FacilitatorNetwork = z.infer<typeof FacilitatorNetworkSchema>;

export const RequestedPaymentPayloadSchema = PaymentPayloadSchema.extend({
  network: FacilitatorNetworkSchema,
});

export type RequestedPaymentPayload = z.infer<
  typeof RequestedPaymentPayloadSchema
>;

const RequestedPaymentRequirementsSchema = PaymentRequirementsSchema.extend({
  network: FacilitatorNetworkSchema,
});

export type RequestedPaymentRequirements = z.infer<
  typeof RequestedPaymentRequirementsSchema
>;

const FacilitatorSettleResponseSchema = SettleResponseSchema.extend({
  network: FacilitatorNetworkSchema,
  errorMessage: z.string().optional(),
});
export type FacilitatorSettleResponse = z.infer<
  typeof FacilitatorSettleResponseSchema
>;

const FacilitatorVerifyResponseSchema = VerifyResponseSchema.extend({
  errorMessage: z.string().optional(),
});

export type FacilitatorVerifyResponse = z.infer<
  typeof FacilitatorVerifyResponseSchema
>;

export const SupportedSignatureTypeSchema = z.enum([
  "TransferWithAuthorization",
  "Permit",
]);

export const FacilitatorSupportedAssetSchema = z.object({
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
        x402Version: z.literal(1),
        scheme: z.literal("exact"),
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

export function networkToChainId(network: string): number {
  if (network.startsWith("eip155:")) {
    const chainId = parseInt(network.split(":")[1] ?? "0");
    if (!Number.isNaN(chainId) && chainId > 0) {
      return chainId;
    } else {
      throw new Error(`Invalid network: ${network}`);
    }
  }
  // attempt to parse it as just an integer
  const maybeChainId = parseInt(network);
  if (!Number.isNaN(maybeChainId) && maybeChainId > 0) {
    return maybeChainId;
  }
  const mappedChainId = EvmNetworkToChainId.get(network as Network);
  if (!mappedChainId) {
    throw new Error(`Invalid network: ${network}`);
  }
  // TODO (402): support solana networks
  if (mappedChainId === 101 || mappedChainId === 103) {
    throw new Error("Solana networks not supported yet.");
  }
  return mappedChainId;
}
