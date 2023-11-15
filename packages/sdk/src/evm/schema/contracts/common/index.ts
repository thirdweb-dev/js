import {
  BasisPointsSchema,
  FileOrBufferOrStringSchema,
} from "../../../../core/schema/shared";
import { AddressOrEnsSchema } from "../../shared/AddressOrEnsSchema";
import { constants } from "ethers";
import { z } from "zod";

/**
 * @internal
 */
export const CommonContractSchema = /* @__PURE__ */ (() =>
  z
    .object({
      name: z.string(),
      description: z.string().optional(),
      image: FileOrBufferOrStringSchema.optional(),
      external_link: z.string().optional(),
      app_uri: z.string().optional(),
      social_urls: z.record(z.string()).optional(),
    })
    .catchall(z.unknown()))();

export type CommonContractSchemaInput = z.input<typeof CommonContractSchema>;

/**
 * @internal
 */
export const CommonContractOutputSchema = /* @__PURE__ */ (() =>
  CommonContractSchema.extend({
    image: z.string().optional(),
  }).catchall(z.unknown()))();

/**
 * @internal
 */
export const CommonRoyaltySchema = /* @__PURE__ */ (() =>
  z.object({
    /**
     * The amount of royalty collected on all royalties represented as basis points.
     * The default is 0 (no royalties).
     *
     * 1 basis point = 0.01%
     *
     * For example: if this value is 100, then the royalty is 1% of the total sales.
     *
     *  @internalremarks used by OpenSea "seller_fee_basis_points"
     */
    seller_fee_basis_points: BasisPointsSchema.default(0),

    /**
     * The address of the royalty recipient. All royalties will be sent
     * to this address.
     * @internalremarks used by OpenSea "fee_recipient"
     */
    fee_recipient: AddressOrEnsSchema.default(constants.AddressZero),
  }))();

/**
 * @internal
 */
export const CommonPrimarySaleSchema = /* @__PURE__ */ (() =>
  z.object({
    /**
     * primary sale recipient address
     */
    primary_sale_recipient: AddressOrEnsSchema,
  }))();

/**
 * @internal
 */
export const CommonPlatformFeeSchema = /* @__PURE__ */ (() =>
  z.object({
    /**
     * platform fee basis points
     */
    platform_fee_basis_points: BasisPointsSchema.default(0),
    /**
     * platform fee recipient address
     */
    platform_fee_recipient: AddressOrEnsSchema.default(constants.AddressZero),
  }))();

/**
 * @internal
 */
export const CommonTrustedForwarderSchema = /* @__PURE__ */ (() =>
  z.object({
    trusted_forwarders: z.array(AddressOrEnsSchema).default([]),
  }))();

/**
 * @internal
 */
export const CommonSymbolSchema = /* @__PURE__ */ (() =>
  z.object({
    symbol: z.string().default(""),
  }))();
