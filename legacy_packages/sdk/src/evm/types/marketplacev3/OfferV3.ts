import { NFTMetadata } from "../../../core/schema/nft";
import { Status } from "../../enums/marketplace/Status";
import { CurrencyValue } from "../currency";

/**
 * Represents a marketplace offer.
 */
export interface OfferV3 {
  /**
   * The id of the offer.
   */
  id: string;

  /**
   * The address of the creator of offer.
   */
  offerorAddress: string;

  /**
   * The address of the asset being sought.
   */
  assetContractAddress: string;

  /**
   * The ID of the token.
   */
  tokenId: string;

  /**
   * The quantity of tokens to buy.
   *
   * For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
   */
  quantity: string;

  /**
   * The address of the currency offered for the NFTs.
   */
  currencyContractAddress: string;

  /**
   * The `CurrencyValue` of the listing. Useful for displaying the price information.
   */
  currencyValue: CurrencyValue;

  /**
   * The total offer amount for the NFTs.
   */
  totalPrice: string;

  /**
   * The asset to buy.
   */
  asset: NFTMetadata;

  /**
   * The end time of the offer.
   */
  endTimeInSeconds: number;

  /**
   * Whether the listing is CREATED, COMPLETED, or CANCELLED.
   */
  status: Status;
}
