import {
  EvmNetworkToChainId,
  type ExactEvmPayload,
  type Network,
  PaymentPayloadSchema,
  PaymentRequirementsSchema,
  SettleResponseSchema,
} from "x402/types";
import { z } from "zod";
import type { Chain } from "../chains/types.js";

const FacilitatorNetworkSchema = z.union([
  z.literal("base-sepolia"),
  z.literal("base"),
  z.literal("avalanche-fuji"),
  z.literal("avalanche"),
  z.literal("iotex"),
  z.literal("solana-devnet"),
  z.literal("solana"),
  z.literal("sei"),
  z.literal("sei-testnet"),
  z.string().refine((value) => value.startsWith("eip155:"), {
    message: "Invalid network",
  }),
]);

export type FacilitatorNetwork = z.infer<typeof FacilitatorNetworkSchema>;

export const RequestedPaymentPayloadSchema = PaymentPayloadSchema.extend({
  network: FacilitatorNetworkSchema,
});

export type RequestedPaymentPayload = z.infer<
  typeof RequestedPaymentPayloadSchema
>;
export type UnsignedPaymentPayload = Omit<
  RequestedPaymentPayload,
  "payload"
> & {
  payload: Omit<ExactEvmPayload, "signature"> & { signature: undefined };
};

export const RequestedPaymentRequirementsSchema =
  PaymentRequirementsSchema.extend({
    network: FacilitatorNetworkSchema,
  });

export type RequestedPaymentRequirements = z.infer<
  typeof RequestedPaymentRequirementsSchema
>;

const FacilitatorSettleResponseSchema = SettleResponseSchema.extend({
  network: FacilitatorNetworkSchema,
});
export type FacilitatorSettleResponse = z.infer<
  typeof FacilitatorSettleResponseSchema
>;

export function networkToChainId(network: string | Chain): number {
  if (typeof network === "object") {
    return network.id;
  }
  if (network.startsWith("eip155:")) {
    const chainId = parseInt(network.split(":")[1] ?? "0");
    if (!Number.isNaN(chainId) && chainId > 0) {
      return chainId;
    } else {
      throw new Error(`Invalid network: ${network}`);
    }
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
