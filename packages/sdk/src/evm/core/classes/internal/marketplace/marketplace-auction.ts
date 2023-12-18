import type { IMarketplace, Marketplace } from "@thirdweb-dev/contracts-js";
import {
  ListingAddedEvent,
  Marketplace as MarketplaceContract,
} from "@thirdweb-dev/contracts-js/dist/declarations/src/Marketplace";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, constants, utils } from "ethers";
import invariant from "tiny-invariant";
import { cleanCurrencyAddress } from "../../../../common/currency/cleanCurrencyAddress";
import { fetchCurrencyMetadata } from "../../../../common/currency/fetchCurrencyMetadata";
import { fetchCurrencyValue } from "../../../../common/currency/fetchCurrencyValue";
import { normalizePriceValue } from "../../../../common/currency/normalizePriceValue";
import { setErc20Allowance } from "../../../../common/currency/setErc20Allowance";
import { resolveAddress } from "../../../../common/ens/resolveAddress";
import {
  AuctionAlreadyStartedError,
  AuctionHasNotEndedError,
  ListingNotFoundError,
  WrongListingTypeError,
} from "../../../../common/error";
import {
  handleTokenApproval,
  isWinningBid,
  mapOffer,
  validateNewListingParam,
} from "../../../../common/marketplace";
import { fetchTokenMetadataForContract } from "../../../../common/nft";
import { buildTransactionFunction } from "../../../../common/transactions";
import { CurrencyValue, Price } from "../../../../types/currency";
import { TransactionResultWithId } from "../../../types";
import { ContractEncoder } from "../../contract-encoder";
import { ContractEvents } from "../../contract-events";
import { ContractWrapper } from "../contract-wrapper";
import { Transaction } from "../../transactions";
import { ListingType } from "../../../../enums/marketplace/ListingType";
import { AuctionListing } from "../../../../types/marketplace/AuctionListing";
import { Offer } from "../../../../types/marketplace/Offer";
import { NewAuctionListing } from "../../../../types/marketplace/NewAuctionListing";

/**
 * Handles auction listings
 * @public
 */
export class MarketplaceAuction {
  private contractWrapper: ContractWrapper<Marketplace>;
  private storage: ThirdwebStorage;
  public encoder: ContractEncoder<MarketplaceContract>;

  constructor(
    contractWrapper: ContractWrapper<Marketplace>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.encoder = new ContractEncoder<Marketplace>(contractWrapper);
  }

  getAddress(): string {
    return this.contractWrapper.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get an Auction listing by id
   *
   * @param listingId - the listing Id
   * @returns The Auction listing object
   */
  public async getListing(listingId: BigNumberish): Promise<AuctionListing> {
    const listing = await this.contractWrapper.read("listings", [listingId]);

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
    const offers = await this.contractWrapper.read("winningBid", [listingId]);
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
    const offers = await this.contractWrapper.read("winningBid", [listingId]);
    const now = BigNumber.from(Math.floor(Date.now() / 1000));
    const endTime = BigNumber.from(listing.endTimeInEpochSeconds);

    // if we have a winner in the map and the current time is past the endtime of the auction return the address of the winner
    if (now.gt(endTime) && offers.offeror !== constants.AddressZero) {
      return offers.offeror;
    }
    // otherwise fall back to query filter things

    // TODO this should be via indexer or direct contract call
    const contractEvents = new ContractEvents(this.contractWrapper);
    const closedAuctions = await contractEvents.getEvents("AuctionClosed");
    const auction = closedAuctions.find((a) =>
      a.data.listingId.eq(BigNumber.from(listingId)),
    );
    if (!auction) {
      throw new Error(
        `Could not find auction with listingId ${listingId} in closed auctions`,
      );
    }
    return auction.data.winningBidder;
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
  createListing = /* @__PURE__ */ buildTransactionFunction(
    async (
      listing: NewAuctionListing,
    ): Promise<Transaction<TransactionResultWithId>> => {
      validateNewListingParam(listing);

      const resolvedAssetAddress = await resolveAddress(
        listing.assetContractAddress,
      );
      const resolvedCurrencyAddress = await resolveAddress(
        listing.currencyContractAddress,
      );

      await handleTokenApproval(
        this.contractWrapper,
        this.getAddress(),
        resolvedAssetAddress,
        listing.tokenId,
        await this.contractWrapper.getSignerAddress(),
      );

      const normalizedPricePerToken = await normalizePriceValue(
        this.contractWrapper.getProvider(),
        listing.buyoutPricePerToken,
        resolvedCurrencyAddress,
      );

      const normalizedReservePrice = await normalizePriceValue(
        this.contractWrapper.getProvider(),
        listing.reservePricePerToken,
        resolvedCurrencyAddress,
      );

      let listingStartTime = Math.floor(
        listing.startTimestamp.getTime() / 1000,
      );
      const block = await this.contractWrapper.getProvider().getBlock("latest");
      const blockTime = block.timestamp;
      if (listingStartTime < blockTime) {
        listingStartTime = blockTime;
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "createListing",
        args: [
          {
            assetContract: resolvedAssetAddress,
            tokenId: listing.tokenId,
            buyoutPricePerToken: normalizedPricePerToken,
            currencyToAccept: cleanCurrencyAddress(resolvedCurrencyAddress),
            listingType: ListingType.Auction,
            quantityToList: listing.quantity,
            reservePricePerToken: normalizedReservePrice,
            secondsUntilEndTime: listing.listingDurationInSeconds,
            startTime: BigNumber.from(listingStartTime),
          } as IMarketplace.ListingParametersStruct,
        ],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<ListingAddedEvent>(
            "ListingAdded",
            receipt?.logs,
          );
          return {
            id: event[0].args.listingId,
            receipt,
          };
        },
      });
    },
  );

  /**
   * Create a batch of new auctions
   *
   * @remarks Create a batch of new auctions on the marketplace
   *
   * @example
   * ```javascript
   * const auctions = [...];
   * const tx = await contract.auction.createListingsBatch(auctions);
   * ```
   */
  createListingsBatch = /* @__PURE__ */ buildTransactionFunction(
    async (
      listings: NewAuctionListing[],
    ): Promise<Transaction<TransactionResultWithId[]>> => {
      const data = (
        await Promise.all(
          listings.map((listing) => this.createListing.prepare(listing)),
        )
      ).map((tx) => tx.encode());

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [data],
        parse: (receipt) => {
          const events = this.contractWrapper.parseLogs<ListingAddedEvent>(
            "ListingAdded",
            receipt?.logs,
          );
          return events.map((event) => {
            return {
              id: event.args.listingId,
              receipt,
            };
          });
        },
      });
    },
  );

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
  buyoutListing = /* @__PURE__ */ buildTransactionFunction(
    async (listingId: BigNumberish) => {
      const listing = await this.validateListing(BigNumber.from(listingId));

      const currencyMetadata = await fetchCurrencyMetadata(
        this.contractWrapper.getProvider(),
        listing.currencyContractAddress,
      );

      return this.makeBid.prepare(
        listingId,
        utils.formatUnits(listing.buyoutPrice, currencyMetadata.decimals),
      );
    },
  );

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
  makeBid = /* @__PURE__ */ buildTransactionFunction(
    async (listingId: BigNumberish, pricePerToken: Price) => {
      const listing = await this.validateListing(BigNumber.from(listingId));
      const normalizedPrice = await normalizePriceValue(
        this.contractWrapper.getProvider(),
        pricePerToken,
        listing.currencyContractAddress,
      );
      if (normalizedPrice.eq(BigNumber.from(0))) {
        throw new Error("Cannot make a bid with 0 value");
      }
      const bidBuffer = await this.contractWrapper.read("bidBufferBps", []);
      const winningBid = await this.getWinningBid(listingId);
      if (winningBid) {
        const isWinner = isWinningBid(
          winningBid.pricePerToken,
          normalizedPrice,
          bidBuffer,
        );

        invariant(
          isWinner,
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
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "offer",
        args: [
          listingId,
          listing.quantity,
          listing.currencyContractAddress,
          normalizedPrice,
          constants.MaxUint256,
        ],
        overrides,
      });
    },
  );

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
  cancelListing = /* @__PURE__ */ buildTransactionFunction(
    async (listingId: BigNumberish) => {
      const listing = await this.validateListing(BigNumber.from(listingId));

      const now = BigNumber.from(Math.floor(Date.now() / 1000));
      const startTime = BigNumber.from(listing.startTimeInEpochSeconds);

      const offers = await this.contractWrapper.read("winningBid", [listingId]);
      if (now.gt(startTime) && offers.offeror !== constants.AddressZero) {
        throw new AuctionAlreadyStartedError(listingId.toString());
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "closeAuction",
        args: [
          BigNumber.from(listingId),
          await this.contractWrapper.getSignerAddress(),
        ],
      });
    },
  );

  /**
   * Close the Auction for the buyer or the seller
   *
   * @remarks Closes the Auction and executes the sale for the buyer or the seller.
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
  closeListing = /* @__PURE__ */ buildTransactionFunction(
    async (listingId: BigNumberish, closeFor?: string) => {
      if (!closeFor) {
        closeFor = await this.contractWrapper.getSignerAddress();
      }
      const listing = await this.validateListing(BigNumber.from(listingId));
      try {
        return Transaction.fromContractWrapper({
          contractWrapper: this.contractWrapper,
          method: "closeAuction",
          args: [BigNumber.from(listingId), closeFor],
        });
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
    },
  );

  /**
   * Execute the Auction Sale
   *
   * @remarks Closes the Auction and executes the sale for both parties.
   *
   * @example
   * ```javascript
   * // The listing ID of the auction listing you want to close
   * const listingId = "0";
   * await contract.auction.executeSale(listingId);
   * ```
   *
   * @param listingId - the auction  listing ud to close
   */
  executeSale = /* @__PURE__ */ buildTransactionFunction(
    async (listingId: BigNumberish) => {
      const listing = await this.validateListing(BigNumber.from(listingId));
      try {
        const winningBid = await this.getWinningBid(listingId);
        invariant(winningBid, "No winning bid found");
        const closeForSeller = this.encoder.encode("closeAuction", [
          listingId,
          listing.sellerAddress,
        ]);
        const closeForBuyer = this.encoder.encode("closeAuction", [
          listingId,
          winningBid.buyerAddress,
        ]);
        return Transaction.fromContractWrapper({
          contractWrapper: this.contractWrapper,
          method: "multicall",
          args: [closeForSeller, closeForBuyer],
        });
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
    },
  );

  /**
   * Update an Auction listing with new metadata
   * @param listing - the listing id to update
   */
  updateListing = /* @__PURE__ */ buildTransactionFunction(
    async (listing: AuctionListing) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "updateListing",
        args: [
          listing.id,
          listing.quantity,
          listing.reservePrice,
          listing.buyoutPrice,
          listing.currencyContractAddress,
          listing.startTimeInEpochSeconds,
          listing.endTimeInEpochSeconds,
        ],
      });
    },
  );

  /**
   * Get the buffer in basis points between offers
   */
  public async getBidBufferBps(): Promise<BigNumber> {
    return this.contractWrapper.read("bidBufferBps", []);
  }

  /**
   * returns the minimum bid a user can place to outbid the previous highest bid
   * @param listingId - the listing id of the auction
   */
  public async getMinimumNextBid(
    listingId: BigNumberish,
  ): Promise<CurrencyValue> {
    // we can fetch all of these at the same time using promise.all
    const [currentBidBufferBps, winningBid, listing] = await Promise.all([
      this.getBidBufferBps(),
      this.getWinningBid(listingId),
      this.validateListing(BigNumber.from(listingId)),
    ]);

    const currentBidOrReservePrice = winningBid
      ? // if there is a winning bid use the value of it
        winningBid.currencyValue.value
      : // if there is no winning bid use the reserve price
        listing.reservePrice;

    const minimumNextBid = currentBidOrReservePrice.add(
      // the addition of the current bid and the buffer
      // (have to divide by 10000 to get the fraction of the buffer (since it's in basis points))
      currentBidOrReservePrice.mul(currentBidBufferBps).div(10000),
    );

    // it's more useful to return a currency value here
    return fetchCurrencyValue(
      this.contractWrapper.getProvider(),
      listing.currencyContractAddress,
      minimumNextBid,
    );
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
   * @returns  The mapped interface.
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
