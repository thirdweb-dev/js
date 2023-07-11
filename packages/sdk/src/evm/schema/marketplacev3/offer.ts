import { AmountSchema } from "../../../core/schema/shared";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/currency";
import { AddressOrEnsSchema } from "../shared/AddressOrEnsSchema";
import { BigNumberishSchema } from "../shared/BigNumberSchema";
import { EndDateSchema } from "../shared/RawDateSchema";
import { z } from "zod";

/**
 * @internal
 */
export const OfferInputParamsSchema = /* @__PURE__ */ (() =>
  z.object({
    /**
     * The address of the asset being sought.
     */
    assetContractAddress: AddressOrEnsSchema,

    /**
     * The ID of the token.
     */
    tokenId: BigNumberishSchema,

    /**
     * The quantity of tokens to buy.
     *
     * For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
     */
    quantity: BigNumberishSchema.default(1),

    /**
     * The address of the currency offered for the NFTs.
     */
    currencyContractAddress: AddressOrEnsSchema.default(NATIVE_TOKEN_ADDRESS),

    /**
     * The total offer amount for the NFTs.
     */
    totalPrice: AmountSchema,

    /**
     * The end time of the offer.
     */
    endTimestamp: EndDateSchema,
  }))();

/**
 * @public
 */
export type OfferInputParams = z.input<typeof OfferInputParamsSchema>;
