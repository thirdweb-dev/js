import { NFTMetadata } from "../../../core/schema/nft";
import { ListingType } from "../../enums/marketplace";
import { CurrencyValue } from "../currency";
import { BigNumber, BigNumberish } from "ethers";

/**
 * Represents a marketplace direct listing.
 */
export interface DirectListing {
  /**
   * The id of the listing.
   */
  id: string;

  /**
   * The address of the creator of listing.
   */
  listingCreatorAddress: string;

  /**
   * The address of the asset being listed.
   */
  assetContractAddress: string;

  /**
   * The ID of the token to list.
   */
  tokenId: BigNumberish;

  /**
   * The quantity of tokens to include in the listing.
   *
   * For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
   */
  quantity: BigNumberish;

  /**
   * The address of the currency to accept for the listing.
   */
  currencyContractAddress: string;

  /**
   * The `CurrencyValue` of the listing. Useful for displaying the price information.
   */
  currencyValuePerToken: CurrencyValue;

  /**
   * The price to pay per unit of NFTs listed.
   */
  pricePerToken: BigNumberish;

  /**
   * The asset being listed.
   */
  asset: NFTMetadata;

  /**
   * The start time of the listing.
   */
  startTimeInSeconds: BigNumberish;

  /**
   * The end time of the listing.
   */
  endTimeInSeconds: BigNumberish;

  /**
   * Whether the listing is reserved to be bought from a specific set of buyers.
   */
  isReservedListing: boolean;
}
