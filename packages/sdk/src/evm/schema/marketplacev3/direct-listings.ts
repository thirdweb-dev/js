import { AmountSchema } from "../../../core/schema/shared";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/currency";
import { BigNumberishSchema } from "../shared/BigNumberSchema";
import { AddressOrEnsSchema } from "../shared/AddressOrEnsSchema";
import { EndDateSchema, RawDateSchema } from "../shared/RawDateSchema";
import { z } from "zod";

/**
 * @internal
 */
export const DirectListingInputParamsSchema = /* @__PURE__ */ (() =>
  z.object({
    /**
     * The address of the asset being listed.
     */
    assetContractAddress: AddressOrEnsSchema,

    /**
     * The ID of the token to list.
     */
    tokenId: BigNumberishSchema,

    /**
     * The quantity of tokens to include in the listing.
     *
     * For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
     */
    quantity: BigNumberishSchema.default(1),

    /**
     * The address of the currency to accept for the listing.
     */
    currencyContractAddress: AddressOrEnsSchema.default(NATIVE_TOKEN_ADDRESS),

    /**
     * The price to pay per unit of NFTs listed.
     */
    pricePerToken: AmountSchema,

    /**
     * The start time of the listing.
     */
    startTimestamp: RawDateSchema.default(new Date()),

    /**
     * The end time of the listing.
     */
    endTimestamp: EndDateSchema,

    /**
     * Whether the listing is reserved to be bought from a specific set of buyers.
     */
    isReservedListing: z.boolean().default(false),
  }))();

/**
 * @public
 */
export type DirectListingInputParams = z.input<
  typeof DirectListingInputParamsSchema
>;
