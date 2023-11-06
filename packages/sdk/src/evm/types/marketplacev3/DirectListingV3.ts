import { NFTMetadata } from "../../../core/schema/nft";
import { Status } from "../../enums/marketplace/Status";
import { Address } from "../../schema/shared/Address";
import { CurrencyValue } from "../currency";

/**
 * Represents a marketplace direct listing.
 */
export interface DirectListingV3 {
  /**
   * The id of the listing.
   */
  id: string;

  /**
   * The address of the creator of listing.
   */
  creatorAddress: Address;

  /**
   * The address of the asset being listed.
   */
  assetContractAddress: Address;

  /**
   * The ID of the token to list.
   */
  tokenId: string;

  /**
   * The quantity of tokens to include in the listing.
   *
   * For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
   */
  quantity: string;

  /**
   * The address of the currency to accept for the listing.
   */
  currencyContractAddress: Address;

  /**
   * The `CurrencyValue` of the listing. Useful for displaying the price information.
   */
  currencyValuePerToken: CurrencyValue;

  /**
   * The price to pay per unit of NFTs listed.
   */
  pricePerToken: string;

  /**
   * The asset being listed.
   */
  asset: NFTMetadata;

  /**
   * The start time of the listing.
   */
  startTimeInSeconds: number;

  /**
   * The end time of the listing.
   */
  endTimeInSeconds: number;

  /**
   * Whether the listing is reserved to be bought from a specific set of buyers.
   */
  isReservedListing: boolean;

  /**
   * Whether the listing is CREATED, COMPLETED, or CANCELLED.
   */
  status: Status;
}
