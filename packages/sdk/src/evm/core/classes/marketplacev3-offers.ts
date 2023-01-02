import { ListingNotFoundError, WrongListingTypeError } from "../../common";
import {
  cleanCurrencyAddress,
  fetchCurrencyValue,
  isNativeToken,
  normalizePriceValue,
  setErc20Allowance,
} from "../../common/currency";
import {
  handleTokenApproval,
  isTokenApprovedForTransfer,
  validateNewListingParam,
  validateNewOfferParam,
} from "../../common/marketplacev3";
import { fetchTokenMetadataForContract } from "../../common/nft";
import {
  InterfaceId_IERC1155,
  InterfaceId_IERC721,
} from "../../constants/contract";
import { ListingType } from "../../enums";
import { Price } from "../../types/currency";
import { OfferV3, NewOffer } from "../../types/marketplacev3";
import {
  NetworkOrSignerOrProvider,
  TransactionResult,
  TransactionResultWithId,
} from "../types";
import { ContractWrapper } from "./contract-wrapper";
import type {
  IERC1155,
  IERC165,
  IERC721,
  IOffers,
  MarketplaceEntrypoint,
  Offers,
} from "@thirdweb-dev/contracts-js";
import ERC165Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC165.json";
import ERC721Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC721.json";
import ERC1155Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC1155.json";
import OffersABI from "@thirdweb-dev/contracts-js/dist/abis/Offers.json";
import {
  NewListingEvent,
  UpdatedListingEvent,
} from "@thirdweb-dev/contracts-js/dist/declarations/src/DirectListings";
import { NewOfferEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/Offers";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BigNumber,
  BigNumberish,
  Contract,
  ethers,
  constants,
  utils,
} from "ethers";
import { off } from "process";
import invariant from "tiny-invariant";

/**
 * Handles direct listings
 * @public
 */
export class MarketplaceV3Offers {
  private offers: ContractWrapper<Offers>;
  private entrypoint: ContractWrapper<MarketplaceEntrypoint>;
  private storage: ThirdwebStorage;

  constructor(
    offers: ContractWrapper<Offers>,
    entrypoint: ContractWrapper<MarketplaceEntrypoint>,
    storage: ThirdwebStorage,
  ) {
    this.offers = offers;
    this.entrypoint = entrypoint;
    this.storage = storage;
  }

  onNetworkUpdated(network: NetworkOrSignerOrProvider) {
    this.offers.updateSignerOrProvider(network);
  }

  getAddress(): string {
    return this.entrypoint.readContract.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get the total number of offers
   * @returns Returns the total number of offers created.
   * @public
   */
  public async getTotalOffers(): Promise<BigNumber> {
    return await this.offers.readContract.totalOffers();
  }

  /**
   * Get all offers between start and end Id (both inclusive).
   *
   * @param startIndex - start offer-Id
   * @param endIndex - end offer-Id
   * @returns the Offer object array
   */
  public async getAllOffers(
    startIndex: BigNumberish,
    endIndex: BigNumberish,
  ): Promise<OfferV3[]> {
    const offers = await this.offers.readContract.getAllOffers(
      startIndex,
      endIndex,
    );

    return await Promise.all(offers.map((offer) => this.mapOffer(offer)));
  }

  /**
   * Get all valid offers between start and end Id (both inclusive).
   *
   * @param startIndex - start listing-Id
   * @param endIndex - end listing-Id
   * @returns the Offer object array
   */
  public async getAllValidOffers(
    startIndex: BigNumberish,
    endIndex: BigNumberish,
  ): Promise<OfferV3[]> {
    const offers = await this.offers.readContract.getAllValidOffers(
      startIndex,
      endIndex,
    );

    return await Promise.all(offers.map((offer) => this.mapOffer(offer)));
  }

  /**
   * Get a offer by id
   *
   * @param offerId - the listing id
   * @returns the Direct listing object
   */
  public async getOffer(offerId: BigNumberish): Promise<OfferV3> {
    const offer = await this.offers.readContract.getOffer(offerId);

    return await this.mapOffer(offer);
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Make Offer
   *
   * @remarks Make an offer on the marketplace for an asset.
   *
   * @example
   * ```javascript
   * // Data of the listing you want to create
   * const listing = {
   *   // address of the contract the asset you want to list is on
   *   assetContractAddress: "0x...",
   *   // token ID of the asset you want to list
   *   tokenId: "0",
   *   // when should the listing open up for offers
   *   startTimestamp: new Date(),
   *   // how long the listing will be open for
   *   listingDurationInSeconds: 86400,
   *   // how many of the asset you want to list
   *   quantity: 1,
   *   // address of the currency contract that will be used to pay for the listing
   *   currencyContractAddress: NATIVE_TOKEN_ADDRESS,
   *   // how much the asset will be sold for
   *   buyoutPricePerToken: "1.5",
   * }
   *
   * const tx = await contract.direct.createListing(listing);
   * const receipt = tx.receipt; // the transaction receipt
   * const id = tx.id; // the id of the newly created listing
   * ```
   */
  public async makeOffer(offer: NewOffer): Promise<TransactionResultWithId> {
    validateNewOfferParam(offer);

    const normalizedTotalPrice = await normalizePriceValue(
      this.offers.getProvider(),
      offer.totalPrice,
      offer.currencyContractAddress,
    );

    await handleTokenApproval(
      this.offers,
      this.getAddress(),
      offer.currencyContractAddress,
      normalizedTotalPrice,
      await this.offers.getSignerAddress(),
    );

    let offerEndTime = Math.floor(offer.endTimestamp.getTime() / 1000);

    const receipt = await this.offers.sendTransaction(
      "makeOffer",
      [
        {
          assetContract: offer.assetContractAddress,
          tokenId: offer.tokenId,
          quantity: offer.quantity,
          currency: cleanCurrencyAddress(offer.currencyContractAddress),
          totalPrice: normalizedTotalPrice,
          expirationTimestamp: BigNumber.from(offerEndTime),
        } as IOffers.OfferParamsStruct,
      ],
      {
        // Higher gas limit for create listing
        gasLimit: 500000,
      },
    );

    const event = this.offers.parseLogs<NewOfferEvent>(
      "NewOffer",
      receipt?.logs,
    );
    return {
      id: event[0].args.offerId,
      receipt,
    };
  }

  /**
   * Cancel Offer
   *
   * @remarks Cancel an offer on the marketplace
   *
   * @example
   * ```javascript
   * // The listing ID of the direct listing you want to cancel
   * const listingId = "0";
   *
   * await contract.direct.cancelListing(listingId);
   * ```
   */
  public async cancelListing(
    offerId: BigNumberish,
  ): Promise<TransactionResult> {
    return {
      receipt: await this.offers.sendTransaction("cancelOffer", [offerId]),
    };
  }

  /**
   * Accept an offer
   *
   * @remarks Buy a specific direct listing from the marketplace.
   *
   * @example
   * ```javascript
   * // The listing ID of the asset you want to buy
   * const listingId = 0;
   * // Quantity of the asset you want to buy
   * const quantityDesired = 1;
   *
   * await contract.direct.buyoutListing(listingId, quantityDesired);
   * ```
   *
   * @param offerId - The listing id to buy
   */
  public async acceptOffer(offerId: BigNumberish): Promise<TransactionResult> {
    const offer = await this.validateOffer(BigNumber.from(offerId));
    const { valid, error } = await this.isStillValidOffer(offer);
    if (!valid) {
      throw new Error(`Offer ${offerId} is no longer valid. ${error}`);
    }
    const overrides = (await this.offers.getCallOverrides()) || {};

    // await setErc721Allowance(
    //   this.directListings,
    //   value,
    //   listing.currencyContractAddress,
    //   overrides,
    // );
    return {
      receipt: await this.offers.sendTransaction(
        "acceptOffer",
        [offerId],
        overrides,
      ),
    };
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  /**
   * Throws error if offer could not be found
   *
   * @param offerId - offer to check for
   */
  private async validateOffer(offerId: BigNumber): Promise<OfferV3> {
    try {
      return await this.getOffer(offerId);
    } catch (err) {
      console.error(`Error getting the offer with id ${offerId}`);
      throw err;
    }
  }

  /**
   * Helper method maps the offer to the offer interface.
   *
   * @internal
   * @param offer - The offer to map, as returned from the contract.
   * @returns - The mapped interface.
   */
  public async mapOffer(offer: IOffers.OfferStruct): Promise<OfferV3> {
    return {
      id: offer.offerId.toString(),
      offerorAddress: offer.offeror,
      assetContractAddress: offer.assetContract,
      currencyContractAddress: offer.currency,
      tokenId: offer.tokenId,
      quantity: offer.quantity,
      totalPrice: offer.totalPrice,
      currencyValue: await fetchCurrencyValue(
        this.offers.getProvider(),
        offer.currency,
        offer.totalPrice,
      ),
      asset: await fetchTokenMetadataForContract(
        offer.assetContract,
        this.offers.getProvider(),
        offer.tokenId,
        this.storage,
      ),
      endTimeInSeconds: offer.expirationTimestamp,
    };
  }

  /**
   * Use this method to check if an offer is still valid.
   *
   * Ways a direct listing can become invalid:
   * 1. The asset holder transferred the asset to another wallet
   * 2. The asset holder burned the asset
   * 3. The asset holder removed the approval on the marketplace
   *
   * @internal
   * @param offer - The offer to check.
   * @returns - True if the offer is valid, false otherwise.
   */
  public async isStillValidOffer(
    offer: OfferV3,
  ): Promise<{ valid: boolean; error?: string }> {
    // TODO

    return {
      valid: true,
      error: "error",
    };
  }
}
