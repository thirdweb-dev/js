import { AmountSchema } from "../../../core/schema/shared";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/currency";
import { EndDateSchema, RawDateSchema } from "../shared/RawDateSchema";
import { BigNumberishSchema } from "../shared/BigNumberSchema";
import { AddressOrEnsSchema } from "../shared/AddressOrEnsSchema";
import { z } from "zod";

/**
 * @internal
 */
export const EnglishAuctionInputParamsSchema = /* @__PURE__ */ (() =>
  z.object({
    /**
     * The address of the asset being auctioned.
     */
    assetContractAddress: AddressOrEnsSchema,

    /**
     * The ID of the token to auction.
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
     * The minimum price that a bid must be in order to be accepted.
     */
    minimumBidAmount: AmountSchema,

    /**
     * The buyout price of the auction.
     */
    buyoutBidAmount: AmountSchema,

    /**
     * This is a buffer e.g. x seconds.
     *
     * If a new winning bid is made less than x seconds before expirationTimestamp, the
     * expirationTimestamp is increased by x seconds.
     */
    timeBufferInSeconds: BigNumberishSchema.default(900), // 15 minutes by default

    /**
     * This is a buffer in basis points e.g. x%.
     *
     * To be considered as a new winning bid, a bid must be at least x% greater than
     * the current winning bid.
     */
    bidBufferBps: BigNumberishSchema.default(500), // 5% by default

    /**
     * The start time of the auction.
     */
    startTimestamp: RawDateSchema.default(new Date()),

    /**
     * The end time of the auction.
     */
    endTimestamp: EndDateSchema,
  }))();

/**
 * @public
 */
export type EnglishAuctionInputParams = z.input<
  typeof EnglishAuctionInputParamsSchema
>;
