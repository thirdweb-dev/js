import {
  AuctionAlreadyStartedError,
  AuctionHasNotEndedError,
  ListingNotFoundError,
  WrongListingTypeError,
} from "../../common";
import {
  fetchCurrencyMetadata,
  fetchCurrencyValue,
  normalizePriceValue,
  setErc20Allowance,
} from "../../common/currency";
import {
  handleTokenApproval,
  isWinningBid,
  mapOffer,
  validateNewListingParam,
} from "../../common/marketplace";
import { fetchTokenMetadataForContract } from "../../common/nft";
import { ListingType } from "../../enums";
import { Price } from "../../types/currency";
import {
  AuctionListing,
  NewAuctionListing,
  Offer,
} from "../../types/marketplace";
import { TransactionResult, TransactionResultWithId } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { IMarketplace, Marketplace } from "@thirdweb-dev/contracts-js";
import { ListingAddedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/Marketplace";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, ethers, constants } from "ethers";
import invariant from "tiny-invariant";

/**
 * Handles auction listings
 * @public
 */
export class MarketplaceAuction {
  private contractWrapper: ContractWrapper<Marketplace>;
  private storage: ThirdwebStorage;

  constructor(
    contractWrapper: ContractWrapper<Marketplace>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get an Auction listing by id
   *
   * @param listingId - the listing Id
   * @returns the Auction listing object
   */
  public async getListing(listingId: BigNumberish): Promise<AuctionListing> {
    const listing = await this.contractWrapper.readContract.listings(listingId);

    if (listing.listingId.toString() !== listingId.toString()) {
      throw new ListingNotFoundError(this.getAddress(), listingId.toString());
    }

    if (listing.listingType !== ListingType.Auction) {
      throw new WrongListingTypeError(
        this.getAddress(),
        listingId.toString(),
        "Direct",
        "Auction",
      );
    }
    return await this.mapListing(listing);
  }

  /**
   * Get Highest Bid
   *
   * @remarks Get the current highest bid of an active auction.
   *
   * @example
   * ```javascript
   * // The listing ID of the auction that closed
   * const listingId = 0;
   *
   * contract.auction.
   *   .getWinningBid(listingId)
   *   .then((offer) => console.log(offer))
   *   .catch((err) => console.error(err));
   * ```
   */
  public async getWinningBid(
    listingId: BigNumberish,
  ): Promise<Offer | undefined> {
    await this.validateListing(BigNumber.from(listingId));
    const offers = await this.contractWrapper.readContract.winningBid(
      listingId,
    );
    if (offers.offeror === constants.AddressZero) {
      return undefined;
    }
    return await mapOffer(
      this.contractWrapper.getProvider(),
      BigNumber.from(listingId),
      offers,
    );
  }

  /**
   * Get Auction Winner
   *
   * @remarks Get the winner of the auction after an auction ends.
   *
   * @example
   * ```javascript
   * // The listing ID of the auction that closed
   * const listingId = 0;
   *
   * contract.auction.
   *   .getWinner(listingId)
   *   .then((auctionWinner) => console.log(auctionWinner))
   *   .catch((err) => console.error(err));
   * ```
   */
  public async getWinner(listingId: BigNumberish): Promise<string> {
    const listing = await this.validateListing(BigNumber.from(listingId));
    const offers = await this.contractWrapper.readContract.winningBid(
      listingId,
    );
    const now = BigNumber.from(Math.floor(Date.now() / 1000));
    const endTime = BigNumber.from(listing.endTimeInEpochSeconds);

    // if we have a winner in the map and the current time is past the endtime of the auction return the address of the winner
    if (now.gt(endTime) && offers.offeror !== constants.AddressZero) {
      return offers.offeror;
    }
    // otherwise fall back to query filter things

    // TODO this should be via indexer or direct contract call
    const closedAuctions = await this.contractWrapper.readContract.queryFilter(
      this.contractWrapper.readContract.filters.AuctionClosed(),
    );
    const auction = closedAuctions.find((a) =>
      a.args.listingId.eq(BigNumber.from(listingId)),
    );
    if (!auction) {
      throw new Error(
        `Could not find auction with listingId ${listingId} in closed auctions`,
      );
    }
    return auction.args.winningBidder;
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Create Auction
   *
   * @remarks Create a new auction where people can bid on an asset.
   *
   * @example
   * ```javascript
   * // Data of the auction you want to create
   * const auction = {
   *   // address of the contract the asset you want to list is on
   *   assetContractAddress: "0x...",
   *   // token ID of the asset you want to list
   *   tokenId: "0",
   *  // when should the listing open up for offers
   *   startTimestamp: new Date(),
   *   // how long the listing will be open for
   *   listingDurationInSeconds: 86400,
   *   // how many of the asset you want to list
   *   quantity: 1,
   *   // address of the currency contract that will be used to pay for the listing
   *   currencyContractAddress: NATIVE_TOKEN_ADDRESS,
   *   // how much people would have to bid to instantly buy the asset
   *   buyoutPricePerToken: "10",
   *   // the minimum bid that will be accepted for the token
   *   reservePricePerToken: "1.5",
   * }
   *
   * const tx = await contract.auction.createListing(auction);
   * const receipt = tx.receipt; // the transaction receipt
   * const id = tx.id; // the id of the newly created listing
   * ```
   */
  public async createListing(
    listing: NewAuctionListing,
  ): Promise<TransactionResultWithId> {
    validateNewListingParam(listing);

    await handleTokenApproval(
      this.contractWrapper.getSignerOrProvider(),
      this.getAddress(),
      listing.assetContractAddress,
      listing.tokenId,
      await this.contractWrapper.getSignerAddress(),
    );

    const normalizedPricePerToken = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      listing.buyoutPricePerToken,
      listing.currencyContractAddress,
    );

    const normalizedReservePrice = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      listing.reservePricePerToken,
      listing.currencyContractAddress,
    );

    let listingStartTime = Math.floor(listing.startTimestamp.getTime() / 1000);
    const block = await this.contractWrapper.getProvider().getBlock("latest");
    const blockTime = block.timestamp;
    if (listingStartTime < blockTime) {
      listingStartTime = blockTime;
    }

    const receipt = await this.contractWrapper.sendTransaction(
      "createListing",
      [
        {
          assetContract: listing.assetContractAddress,
          tokenId: listing.tokenId,
          buyoutPricePerToken: normalizedPricePerToken,
          currencyToAccept: listing.currencyContractAddress,
          listingType: ListingType.Auction,
          quantityToList: listing.quantity,
          reservePricePerToken: normalizedReservePrice,
          secondsUntilEndTime: listing.listingDurationInSeconds,
          startTime: BigNumber.from(listingStartTime),
        } as IMarketplace.ListingParametersStruct,
      ],
      {
        // Higher gas limit for create listing
        gasLimit: 500000,
      },
    );

    const event = this.contractWrapper.parseLogs<ListingAddedEvent>(
      "ListingAdded",
      receipt?.logs,
    );
    return {
      id: event[0].args.listingId,
      receipt,
    };
  }

  /**
   * Buyout Auction
   *
   * @remarks Buy a specific direct listing from the marketplace.
   *
   * @example
   * ```javascript
   * // The listing ID of the asset you want to buy
   * const listingId = 0;
   *
   * await contract.auction.buyoutListing(listingId);
   * ```
   */
  public async buyoutListing(
    listingId: BigNumberish,
  ): Promise<TransactionResult> {
    const listing = await this.validateListing(BigNumber.from(listingId));

    const currencyMetadata = await fetchCurrencyMetadata(
      this.contractWrapper.getProvider(),
      listing.currencyContractAddress,
    );

    return this.makeBid(
      listingId,
      ethers.utils.formatUnits(listing.buyoutPrice, currencyMetadata.decimals),
    );
  }

  /**
   * Bid On Auction
   *
   * @remarks Make a bid on an auction listing
   *
   * @example
   * ```javascript
   * // The listing ID of the asset you want to bid on
   * const listingId = 0;
   * // The price you are willing to bid for a single token of the listing
   * const pricePerToken = 1;
   *
   * await contract.auction.makeBid(listingId, pricePerToken);
   * ```
   */
  public async makeBid(
    listingId: BigNumberish,
    pricePerToken: Price,
  ): Promise<TransactionResult> {
    const listing = await this.validateListing(BigNumber.from(listingId));
    const normalizedPrice = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      pricePerToken,
      listing.currencyContractAddress,
    );
    if (normalizedPrice.eq(BigNumber.from(0))) {
      throw new Error("Cannot make a bid with 0 value");
    }
    const bidBuffer = await this.contractWrapper.readContract.bidBufferBps();
    const winningBid = await this.getWinningBid(listingId);
    if (winningBid) {
      const isWinnner = isWinningBid(
        winningBid.pricePerToken,
        normalizedPrice,
        bidBuffer,
      );

      invariant(
        isWinnner,
        "Bid price is too low based on the current winning bid and the bid buffer",
      );
    } else {
      const tokenPrice = normalizedPrice;
      const reservePrice = BigNumber.from(listing.reservePrice);
      invariant(
        tokenPrice.gte(reservePrice),
        "Bid price is too low based on reserve price",
      );
    }

    const quantity = BigNumber.from(listing.quantity);
    const value = normalizedPrice.mul(quantity);

    const overrides = (await this.contractWrapper.getCallOverrides()) || {};
    await setErc20Allowance(
      this.contractWrapper,
      value,
      listing.currencyContractAddress,
      overrides,
    );
    return {
      receipt: await this.contractWrapper.sendTransaction(
        "offer",
        [
          listingId,
          listing.quantity,
          listing.currencyContractAddress,
          normalizedPrice,
          ethers.constants.MaxUint256,
        ],
        overrides,
      ),
    };
  }

  /**
   * Cancel Auction Listing
   *
   * @remarks Cancel an auction listing on the marketplace
   *
   * @example
   * ```javascript
   * // The listing ID of the auction listing you want to cancel
   * const listingId = "0";
   *
   * await contract.auction.cancelListing(listingId);
   * ```
   */
  public async cancelListing(
    listingId: BigNumberish,
  ): Promise<TransactionResult> {
    const listing = await this.validateListing(BigNumber.from(listingId));

    const now = BigNumber.from(Math.floor(Date.now() / 1000));
    const startTime = BigNumber.from(listing.startTimeInEpochSeconds);

    const offers = await this.contractWrapper.readContract.winningBid(
      listingId,
    );
    if (now.gt(startTime) && offers.offeror !== constants.AddressZero) {
      throw new AuctionAlreadyStartedError(listingId.toString());
    }

    return {
      receipt: await this.contractWrapper.sendTransaction("closeAuction", [
        BigNumber.from(listingId),
        await this.contractWrapper.getSignerAddress(),
      ]),
    };
  }

  /**
   * Close the Auction
   *
   * @remarks Closes the Auction and executes the sale.
   *
   * @example
   * ```javascript
   * // The listing ID of the auction listing you want to close
   * const listingId = "0";
   * await contract.auction.closeListing(listingId);
   * ```
   *
   * @param listingId - the auction  listing ud to close
   * @param closeFor - optionally pass the auction creator address or winning bid offeror address to close the auction on their behalf
   */
  public async closeListing(
    listingId: BigNumberish,
    closeFor?: string,
  ): Promise<TransactionResult> {
    if (!closeFor) {
      closeFor = await this.contractWrapper.getSignerAddress();
    }
    const listing = await this.validateListing(BigNumber.from(listingId));
    try {
      return {
        receipt: await this.contractWrapper.sendTransaction("closeAuction", [
          BigNumber.from(listingId),
          closeFor,
        ]),
      };
    } catch (err: any) {
      if (err.message.includes("cannot close auction before it has ended")) {
        throw new AuctionHasNotEndedError(
          listingId.toString(),
          listing.endTimeInEpochSeconds.toString(),
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Update an Auction listing with new metadata
   * @param listing - the listing id to update
   */
  public async updateListing(
    listing: AuctionListing,
  ): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("updateListing", [
        listing.id,
        listing.quantity,
        listing.reservePrice,
        listing.buyoutPrice,
        listing.currencyContractAddress,
        listing.startTimeInEpochSeconds,
        listing.endTimeInEpochSeconds,
      ]),
    };
  }

  /**
   * Get the buffer in basis points between offers
   */
  public async getBidBufferBps(): Promise<BigNumber> {
    return this.contractWrapper.readContract.bidBufferBps();
  }

  /**
   * returns the minimum bid a user can place to outbid the previous highest bid
   * @param listingId - the listing id of the auction
   */
  public async getMinimumNextBid(
    listingId: BigNumberish,
  ): Promise<BigNumberish> {
    const currentBidBuffer = await this.getBidBufferBps();
    const winningBid = await this.getWinningBid(listingId);
    const listing: AuctionListing = await this.getListing(listingId);
    if (winningBid) {
      const winningBidPrice = winningBid.currencyValue.value;
      return winningBidPrice.add(currentBidBuffer.mul(winningBidPrice));
    } else {
      const price = listing.reservePrice;
      return price.add(currentBidBuffer.mul(price));
    }
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  /**
   * Throws error if listing could not be found
   *
   * @param listingId - Listing to check for
   */
  private async validateListing(listingId: BigNumber): Promise<AuctionListing> {
    try {
      return await this.getListing(listingId);
    } catch (err) {
      console.error(`Error getting the listing with id ${listingId}`);
      throw err;
    }
  }

  /**
   * Helper method maps the auction listing to the auction listing interface.
   *
   * @internal
   * @param listing - The listing to map, as returned from the contract.
   * @returns - The mapped interface.
   */
  public async mapListing(
    listing: IMarketplace.ListingStruct,
  ): Promise<AuctionListing> {
    return {
      assetContractAddress: listing.assetContract,
      buyoutPrice: BigNumber.from(listing.buyoutPricePerToken),
      currencyContractAddress: listing.currency,
      buyoutCurrencyValuePerToken: await fetchCurrencyValue(
        this.contractWrapper.getProvider(),
        listing.currency,
        listing.buyoutPricePerToken,
      ),
      id: listing.listingId.toString(),
      tokenId: listing.tokenId,
      quantity: listing.quantity,
      startTimeInEpochSeconds: listing.startTime,
      asset: await fetchTokenMetadataForContract(
        listing.assetContract,
        this.contractWrapper.getProvider(),
        listing.tokenId,
        this.storage,
      ),
      reservePriceCurrencyValuePerToken: await fetchCurrencyValue(
        this.contractWrapper.getProvider(),
        listing.currency,
        listing.reservePricePerToken,
      ),
      reservePrice: BigNumber.from(listing.reservePricePerToken),
      endTimeInEpochSeconds: listing.endTime,
      sellerAddress: listing.tokenOwner,
      type: ListingType.Auction,
    };
  }
}
