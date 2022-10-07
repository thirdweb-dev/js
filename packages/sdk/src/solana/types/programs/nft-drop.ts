import { NFTCollectionMetadataInputSchema } from ".";
import { BasisPointsSchema } from "../../../core/schema/shared";
import { CurrencyValueSchema } from "../../../core/schema/token";
import { AmountSchema } from "../common";
import { z } from "zod";

/**
 * @internal
 */
export const NFTDropInitialConditionsInputSchema = z.object({
  itemsAvailable: AmountSchema,
});
/**
 * @internal
 */
// TODO: Handle allow lists and end times
export const NFTDropUpdateableConditionsInputSchema = z.object({
  price: AmountSchema.optional(),
  currencyAddress: z.string().nullable().optional(),
  primarySaleRecipient: z.string().optional(),
  sellerFeeBasisPoints: BasisPointsSchema.optional(),
  goLiveDate: z.date().optional(),
});

/**
 * @internal
 */
export const NFTDropUpdateableConditionsOutputSchema = z.object({
  price: CurrencyValueSchema,
  currencyAddress: z.string().nullable(),
  primarySaleRecipient: z.string(),
  sellerFeeBasisPoints: BasisPointsSchema,
  goLiveDate: z.date().nullable(),
  totalAvailableSupply: z.number(),
  lazyMintedSupply: z.number(),
  isReadyToClaim: z.boolean(),
});

/**
 * @internal
 */
export const NFTDropContractInputSchema =
  NFTCollectionMetadataInputSchema.merge(NFTDropInitialConditionsInputSchema);

/**
 * @public
 */
export type NFTDropContractInput = z.input<typeof NFTDropContractInputSchema>;

/**
 * @public
 */
export type NFTDropConditionsInput = z.input<
  typeof NFTDropUpdateableConditionsInputSchema
>;
/**
 * @public
 */
export type NFTDropConditions = z.output<
  typeof NFTDropUpdateableConditionsOutputSchema
>;
