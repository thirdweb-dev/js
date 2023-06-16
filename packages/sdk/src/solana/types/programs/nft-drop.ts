import { NFTCollectionMetadataInputSchema } from ".";
import {
  AmountSchema,
  BasisPointsSchema,
  QuantitySchema,
} from "../../../core/schema/shared";
import { CurrencyValueSchema } from "../../../core/schema/token";
import { z } from "zod";

/**
 * @internal
 */
export const NFTDropInitialConditionsInputSchema = /* @__PURE__ */ z.object({
  totalSupply: AmountSchema,
});

/**
 * @internal
 */
// TODO: Handle allow lists and end times
export const NFTDropUpdatableConditionsInputSchema = /* @__PURE__ */ z.object({
  price: AmountSchema.optional(),
  currencyAddress: z.string().nullable().optional(),
  primarySaleRecipient: z.string().optional(),
  sellerFeeBasisPoints: BasisPointsSchema.optional(),
  startTime: z.date().optional(),
  maxClaimable: QuantitySchema.optional(),
});

/**
 * @internal
 */
export const NFTDropUpdatableConditionsOutputSchema = /* @__PURE__ */ z.object({
  price: CurrencyValueSchema,
  currencyAddress: z.string().nullable(),
  primarySaleRecipient: z.string(),
  sellerFeeBasisPoints: BasisPointsSchema,
  startTime: z.date().nullable(),
  totalAvailableSupply: z.number(),
  lazyMintedSupply: z.number(),
  claimedSupply: z.number(),
  maxClaimable: QuantitySchema,
  isReadyToClaim: z.boolean(),
});

/**
 * @internal
 */
export const NFTDropContractInputSchema =
  /* @__PURE__ */ NFTCollectionMetadataInputSchema.merge(
    NFTDropInitialConditionsInputSchema,
  );

/**
 * @public
 */
export type NFTDropContractInput = /* @__PURE__ */ z.input<
  typeof NFTDropContractInputSchema
>;

/**
 * @public
 */
export type NFTDropConditionsInput = /* @__PURE__ */ z.input<
  typeof NFTDropUpdatableConditionsInputSchema
>;
/**
 * @public
 */
export type NFTDropConditions = /* @__PURE__ */ z.output<
  typeof NFTDropUpdatableConditionsOutputSchema
>;
