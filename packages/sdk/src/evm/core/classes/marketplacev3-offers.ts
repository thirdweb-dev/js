import { ListingNotFoundError, WrongListingTypeError } from "../../common";
import {
  cleanCurrencyAddress,
  fetchCurrencyValue,
  hasERC20Allowance,
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
import { MarketplaceFilter } from "../../types";
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
  MarketplaceRouter,
  OffersLogic,
} from "@thirdweb-dev/contracts-js";
import ERC165Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC165.json";
import ERC721Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC721.json";
import ERC1155Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC1155.json";
import OffersABI from "@thirdweb-dev/contracts-js/dist/abis/OffersLogic.json";
import {
  NewListingEvent,
  UpdatedListingEvent,
} from "@thirdweb-dev/contracts-js/dist/declarations/src/DirectListingsLogic";
import { NewOfferEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/OffersLogic";
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
  private contractWrapper: ContractWrapper<OffersLogic>;
  private storage: ThirdwebStorage;

  constructor(
    contractWrapper: ContractWrapper<OffersLogic>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  onNetworkUpdated(network: NetworkOrSignerOrProvider) {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
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
    return await this.contractWrapper.readContract.totalOffers();
  }

  /**
   * Get all offers between start and end Id (both inclusive).
   *
   * @param startIndex - start offer-Id
   * @param endIndex - end offer-Id
   * @returns the Offer object array
   */
  public async getAll(filter?: MarketplaceFilter): Promise<OfferV3[]> {
    const startIndex = BigNumber.from(filter?.start || 0).toNumber();
    const count = BigNumber.from(
      filter?.count || (await this.getTotalOffers()),
    ).toNumber();

    if (count === 0) {
      throw new Error(`No offers exist on the contract.`);
    }

    const rawOffers = await this.contractWrapper.readContract.getAllOffers(
      startIndex,
      count - 1,
    );

    const filteredOffers = this.applyFilter(rawOffers, filter);

    return await Promise.all(
      filteredOffers.map((offer) => this.mapOffer(offer)),
    );
  }

  /**
   * Get all valid offers between start and end Id (both inclusive).
   *
   * @param startIndex - start listing-Id
   * @param endIndex - end listing-Id
   * @returns the Offer object array
   */
  public async getAllValid(
    startIndex: BigNumberish,
    endIndex: BigNumberish,
  ): Promise<OfferV3[]> {
    const offers = await this.contractWrapper.readContract.getAllValidOffers(
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
    const offer = await this.contractWrapper.readContract.getOffer(offerId);

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
      this.contractWrapper.getProvider(),
      offer.totalPrice,
      offer.currencyContractAddress,
    );

    const hasAllowance = await hasERC20Allowance(
      this.contractWrapper,
      offer.currencyContractAddress,
      normalizedTotalPrice,
    );
    if (!hasAllowance) {
      const overrides = await this.contractWrapper.getCallOverrides();
      await setErc20Allowance(
        this.contractWrapper,
        normalizedTotalPrice,
        offer.currencyContractAddress,
        overrides,
      );
    }

    let offerEndTime = Math.floor(offer.endTimestamp.getTime() / 1000);

    const receipt = await this.contractWrapper.sendTransaction(
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

    const event = this.contractWrapper.parseLogs<NewOfferEvent>(
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
      receipt: await this.contractWrapper.sendTransaction("cancelOffer", [
        offerId,
      ]),
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
    const overrides = (await this.contractWrapper.getCallOverrides()) || {};

    // await setErc721Allowance(
    //   this.directListings,
    //   value,
    //   listing.currencyContractAddress,
    //   overrides,
    // );
    return {
      receipt: await this.contractWrapper.sendTransaction(
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
        this.contractWrapper.getProvider(),
        offer.currency,
        offer.totalPrice,
      ),
      asset: await fetchTokenMetadataForContract(
        offer.assetContract,
        this.contractWrapper.getProvider(),
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

  private applyFilter(
    offers: IOffers.OfferStructOutput[],
    filter?: MarketplaceFilter,
  ) {
    let rawOffers = [...offers];

    if (filter) {
      if (filter.offeror) {
        rawOffers = rawOffers.filter(
          (offeror) =>
            offeror.offeror.toString().toLowerCase() ===
            filter?.offeror?.toString().toLowerCase(),
        );
      }
      if (filter.tokenContract) {
        rawOffers = rawOffers.filter(
          (tokenContract) =>
            tokenContract.assetContract.toString().toLowerCase() ===
            filter?.tokenContract?.toString().toLowerCase(),
        );
      }

      if (filter.tokenId !== undefined) {
        rawOffers = rawOffers.filter(
          (tokenContract) =>
            tokenContract.tokenId.toString() === filter?.tokenId?.toString(),
        );
      }
    }

    return rawOffers;
  }
}
