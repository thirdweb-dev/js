import {
  AuctionAlreadyStartedError,
  AuctionHasNotEndedError,
  ListingNotFoundError,
  WrongListingTypeError,
} from "../../common";
import {
  cleanCurrencyAddress,
  fetchCurrencyMetadata,
  fetchCurrencyValue,
  normalizePriceValue,
  setErc20Allowance,
} from "../../common/currency";
import {
  handleTokenApproval,
  validateNewEnglishAuctionParam,
} from "../../common/marketplacev3";
import { fetchTokenMetadataForContract } from "../../common/nft";
import { ListingType } from "../../enums";
import { CurrencyValue, Price } from "../../types/currency";
import {
  EnglishAuction,
  NewEnglishAuction,
  Bid,
} from "../../types/marketplacev3";
import { TransactionResult, TransactionResultWithId } from "../types";
import { ContractEncoder } from "./contract-encoder";
import { ContractWrapper } from "./contract-wrapper";
import type {
  IEnglishAuctions,
  MarketplaceEntrypoint,
  EnglishAuctions,
} from "@thirdweb-dev/contracts-js";
import { NewAuctionEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/EnglishAuctions";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, ethers, constants } from "ethers";
import invariant from "tiny-invariant";

/**
 * Handles auction listings
 * @public
 */
export class MarketplaceV3EnglishAuctions {
  private englishAuctions: ContractWrapper<EnglishAuctions>;
  private entrypoint: ContractWrapper<MarketplaceEntrypoint>;
  private storage: ThirdwebStorage;
  public encoder: ContractEncoder<EnglishAuctions>;

  constructor(
    englishAuctions: ContractWrapper<EnglishAuctions>,
    entrypoint: ContractWrapper<MarketplaceEntrypoint>,
    storage: ThirdwebStorage,
  ) {
    this.englishAuctions = englishAuctions;
    this.entrypoint = entrypoint;
    this.storage = storage;
    this.encoder = new ContractEncoder<EnglishAuctions>(englishAuctions);
  }

  getAddress(): string {
    return this.entrypoint.readContract.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get the total number of english auctions
   * @returns Returns the total number of auctions created.
   * @public
   */
  public async getTotalAuctions(): Promise<BigNumber> {
    return await this.englishAuctions.readContract.totalAuctions();
  }

  /**
   * Get all auctions between start and end Id (both inclusive).
   *
   * @param startIndex - start auction-Id
   * @param endIndex - end auction-Id
   * @returns the Auction object array
   */
  public async getAllAuctions(
    startIndex: BigNumberish,
    endIndex: BigNumberish,
  ): Promise<EnglishAuction[]> {
    const auctions = await this.englishAuctions.readContract.getAllAuctions(
      startIndex,
      endIndex,
    );

    return await Promise.all(
      auctions.map((auction) => this.mapAuction(auction)),
    );
  }

  /**
   * Get all valid auctions between start and end Id (both inclusive).
   *
   *
   * @param startIndex - start auction-Id
   * @param endIndex - end auction-Id
   * @returns the Auction object array
   */
  public async getAllValidAuctions(
    startIndex: BigNumberish,
    endIndex: BigNumberish,
  ): Promise<EnglishAuction[]> {
    const auctions =
      await this.englishAuctions.readContract.getAllValidAuctions(
        startIndex,
        endIndex,
      );

    return await Promise.all(
      auctions.map((auction) => this.mapAuction(auction)),
    );
  }

  /**
   * Get an Auction by id
   *
   * @param auctionId - the auction Id
   * @returns the Auction object
   */
  public async getAuction(auctionId: BigNumberish): Promise<EnglishAuction> {
    const auction = await this.englishAuctions.readContract.getAuction(
      auctionId,
    );

    return await this.mapAuction(auction);
  }

  /**
   * Get Highest Bid
   *
   * @remarks Get the current highest bid of an active auction.
   *
   * @example
   * ```javascript
   * // The auction ID of the auction that closed
   * const auctionId = 0;
   *
   * contract.auction.
   *   .getWinningBid(auctionId)
   *   .then((offer) => console.log(offer))
   *   .catch((err) => console.error(err));
   * ```
   */
  public async getWinningBid(
    auctionId: BigNumberish,
  ): Promise<Bid | undefined> {
    await this.validateAuction(BigNumber.from(auctionId));
    const bid = await this.englishAuctions.readContract.getWinningBid(
      auctionId,
    );
    if (bid._bidder === constants.AddressZero) {
      return undefined;
    }
    return await this.mapBid(
      BigNumber.from(auctionId),
      bid._bidder,
      bid._currency,
      BigNumber.from(bid._bidAmount),
    );
  }

  /**
   * Check if a bid-amount is/will be a winning bid.
   *
   * @param auctionId - Auction Id
   * @param bidAmount - Amount to bid
   * @returns the Auction object
   */
  public async isWinningBid(
    auctionId: BigNumberish,
    bidAmount: BigNumberish,
  ): Promise<boolean> {
    return await this.englishAuctions.readContract.isNewWinningBid(
      auctionId,
      bidAmount,
    );
  }

  // /**
  //  * Get Auction Winner
  //  *
  //  * @remarks Get the winner of the auction after an auction ends.
  //  *
  //  * @example
  //  * ```javascript
  //  * // The listing ID of the auction that closed
  //  * const listingId = 0;
  //  *
  //  * contract.auction.
  //  *   .getWinner(listingId)
  //  *   .then((auctionWinner) => console.log(auctionWinner))
  //  *   .catch((err) => console.error(err));
  //  * ```
  //  */
  // public async getWinner(auctionId: BigNumberish): Promise<string> {
  //   const auction = await this.validateAuction(BigNumber.from(auctionId));
  //   const offers = await this.contractWrapper.readContract.winningBid(
  //     listingId,
  //   );
  //   const now = BigNumber.from(Math.floor(Date.now() / 1000));
  //   const endTime = BigNumber.from(listing.endTimeInEpochSeconds);

  //   // if we have a winner in the map and the current time is past the endtime of the auction return the address of the winner
  //   if (now.gt(endTime) && offers.offeror !== constants.AddressZero) {
  //     return offers.offeror;
  //   }
  //   // otherwise fall back to query filter things

  //   // TODO this should be via indexer or direct contract call
  //   const closedAuctions = await this.contractWrapper.readContract.queryFilter(
  //     this.contractWrapper.readContract.filters.AuctionClosed(),
  //   );
  //   const auction = closedAuctions.find((a) =>
  //     a.args.listingId.eq(BigNumber.from(listingId)),
  //   );
  //   if (!auction) {
  //     throw new Error(
  //       `Could not find auction with listingId ${listingId} in closed auctions`,
  //     );
  //   }
  //   return auction.args.winningBidder;
  // }

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
  public async createAuction(
    auction: NewEnglishAuction,
  ): Promise<TransactionResultWithId> {
    validateNewEnglishAuctionParam(auction);

    await handleTokenApproval(
      this.englishAuctions,
      this.getAddress(),
      auction.assetContractAddress,
      auction.tokenId,
      await this.englishAuctions.getSignerAddress(),
    );

    const normalizedBuyoutAmount = await normalizePriceValue(
      this.englishAuctions.getProvider(),
      auction.buyoutBidAmount,
      auction.currencyContractAddress,
    );

    const normalizedMinBidAmount = await normalizePriceValue(
      this.englishAuctions.getProvider(),
      auction.minimumBidAmount,
      auction.currencyContractAddress,
    );

    let auctionStartTime = Math.floor(auction.startTimestamp.getTime() / 1000);
    const block = await this.englishAuctions.getProvider().getBlock("latest");
    const blockTime = block.timestamp;
    if (auctionStartTime < blockTime) {
      auctionStartTime = blockTime;
    }

    let auctionEndTime = Math.floor(auction.endTimestamp.getTime() / 1000);

    const receipt = await this.englishAuctions.sendTransaction(
      "createAuction",
      [
        {
          assetContract: auction.assetContractAddress,
          tokenId: auction.tokenId,
          quantity: auction.quantity,
          currency: cleanCurrencyAddress(auction.currencyContractAddress),
          minimumBidAmount: normalizedMinBidAmount,
          buyoutBidAmount: normalizedBuyoutAmount,
          timeBufferInSeconds: auction.timeBufferInSeconds,
          bidBufferBps: auction.bidBufferBps,
          startTimestamp: BigNumber.from(auctionStartTime),
          endTimestamp: BigNumber.from(auctionEndTime),
        } as IEnglishAuctions.AuctionParametersStruct,
      ],
      {
        // Higher gas limit for create listing
        gasLimit: 500000,
      },
    );

    const event = this.englishAuctions.parseLogs<NewAuctionEvent>(
      "NewAuction",
      receipt?.logs,
    );
    return {
      id: event[0].args.auctionId,
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
  public async buyoutAuction(
    auctionId: BigNumberish,
  ): Promise<TransactionResult> {
    const auction = await this.validateAuction(BigNumber.from(auctionId));

    const currencyMetadata = await fetchCurrencyMetadata(
      this.englishAuctions.getProvider(),
      auction.currencyContractAddress,
    );

    return this.makeBid(
      auctionId,
      ethers.utils.formatUnits(
        auction.buyoutBidAmount,
        currencyMetadata.decimals,
      ),
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
    auctionId: BigNumberish,
    bidAmount: Price,
  ): Promise<TransactionResult> {
    const auction = await this.validateAuction(BigNumber.from(auctionId));

    const normalizedBidAmount = await normalizePriceValue(
      this.englishAuctions.getProvider(),
      bidAmount,
      auction.currencyContractAddress,
    );
    if (normalizedBidAmount.eq(BigNumber.from(0))) {
      throw new Error("Cannot make a bid with 0 value");
    }

    const winningBid = await this.getWinningBid(auctionId);
    if (winningBid) {
      const isWinnner = this.isWinningBid(auctionId, normalizedBidAmount);

      invariant(
        isWinnner,
        "Bid price is too low based on the current winning bid and the bid buffer",
      );
    } else {
      const tokenPrice = normalizedBidAmount;
      const minimumBidAmount = BigNumber.from(auction.minimumBidAmount);
      invariant(
        tokenPrice.gte(minimumBidAmount),
        "Bid price is too low based on minimum bid amount",
      );
    }

    const overrides = (await this.englishAuctions.getCallOverrides()) || {};
    await setErc20Allowance(
      this.englishAuctions,
      normalizedBidAmount,
      auction.currencyContractAddress,
      overrides,
    );
    return {
      receipt: await this.englishAuctions.sendTransaction(
        "bidInAuction",
        [auctionId, normalizedBidAmount],
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
  public async cancelAuction(
    auctionId: BigNumberish,
  ): Promise<TransactionResult> {
    const auction = await this.validateAuction(BigNumber.from(auctionId));

    const now = BigNumber.from(Math.floor(Date.now() / 1000));
    const startTime = BigNumber.from(auction.startTimeInSeconds);

    const winningBid = await this.getWinningBid(auctionId);
    if (
      now.gt(startTime) &&
      winningBid?.bidderAddress !== constants.AddressZero
    ) {
      throw new AuctionAlreadyStartedError(auctionId.toString());
    }

    return {
      receipt: await this.englishAuctions.sendTransaction("cancelAuction", [
        auctionId,
      ]),
    };
  }

  /**
   * Close the Auction for the buyer
   *
   * @remarks Closes the Auction and executes the sale for the buyer.
   *
   * @example
   * ```javascript
   * // The listing ID of the auction listing you want to close
   * const listingId = "0";
   * await contract.auction.closeListing(listingId);
   * ```
   *
   * @param auctionId - the auction id to close
   * @param closeFor - optionally pass the winning bid offeror address to close the auction on their behalf
   */
  public async closeAuctionForBidder(
    auctionId: BigNumberish,
    closeFor?: string,
  ): Promise<TransactionResult> {
    if (!closeFor) {
      closeFor = await this.englishAuctions.getSignerAddress();
    }
    const auction = await this.validateAuction(BigNumber.from(auctionId));
    try {
      return {
        receipt: await this.englishAuctions.sendTransaction(
          "collectAuctionTokens",
          [BigNumber.from(auctionId)],
        ),
      };
    } catch (err: any) {
      if (err.message.includes("Marketplace: auction still active.")) {
        throw new AuctionHasNotEndedError(
          auctionId.toString(),
          auction.endTimeInSeconds.toString(),
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Close the Auction for the seller, i.e. the auction creator
   *
   * @remarks Closes the Auction and executes the sale for the seller.
   *
   * @example
   * ```javascript
   * // The listing ID of the auction listing you want to close
   * const listingId = "0";
   * await contract.auction.closeListing(listingId);
   * ```
   *
   * @param auctionId - the auction id to close
   */
  public async closeAuctionForSeller(
    auctionId: BigNumberish,
  ): Promise<TransactionResult> {
    const auction = await this.validateAuction(BigNumber.from(auctionId));
    try {
      return {
        receipt: await this.englishAuctions.sendTransaction(
          "collectAuctionPayout",
          [BigNumber.from(auctionId)],
        ),
      };
    } catch (err: any) {
      if (err.message.includes("Marketplace: auction still active.")) {
        throw new AuctionHasNotEndedError(
          auctionId.toString(),
          auction.endTimeInSeconds.toString(),
        );
      } else {
        throw err;
      }
    }
  }

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
   * @param auctionId - the auction  listing ud to close
   */
  public async executeSale(auctionId: BigNumberish) {
    const auction = await this.validateAuction(BigNumber.from(auctionId));
    try {
      const winningBid = await this.getWinningBid(auctionId);
      invariant(winningBid, "No winning bid found");
      const closeForSeller = this.encoder.encode("collectAuctionPayout", [
        auctionId,
      ]);
      const closeForBuyer = this.encoder.encode("collectAuctionTokens", [
        auctionId,
      ]);
      return await this.entrypoint.multiCall([closeForSeller, closeForBuyer]);
    } catch (err: any) {
      if (err.message.includes("Marketplace: auction still active.")) {
        throw new AuctionHasNotEndedError(
          auctionId.toString(),
          auction.endTimeInSeconds.toString(),
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Get the buffer in basis points between bids
   *
   * @param auctionId - id of the auction
   */
  public async getBidBufferBps(auctionId: BigNumberish): Promise<BigNumber> {
    return (await this.getAuction(auctionId)).bidBufferBps;
  }

  /**
   * returns the minimum bid a user can place to outbid the previous highest bid
   * @param auctionId - id of the auction
   */
  public async getMinimumNextBid(
    auctionId: BigNumberish,
  ): Promise<CurrencyValue> {
    // we can fetch all of these at the same time using promise.all
    const [currentBidBufferBps, winningBid, auction] = await Promise.all([
      this.getBidBufferBps(auctionId),
      this.getWinningBid(auctionId),
      await this.validateAuction(BigNumber.from(auctionId)),
    ]);

    const currentBidOrReservePrice = winningBid
      ? // if there is a winning bid use the value of it
        winningBid.bidAmount
      : // if there is no winning bid use the reserve price
        auction.minimumBidAmount;

    const minimumNextBid = currentBidOrReservePrice.add(
      // the addition of the current bid and the buffer
      // (have to divide by 10000 to get the fraction of the buffer (since it's in basis points))
      currentBidOrReservePrice.mul(currentBidBufferBps).div(10000),
    );

    // it's more useful to return a currency value here
    return fetchCurrencyValue(
      this.englishAuctions.getProvider(),
      auction.currencyContractAddress,
      minimumNextBid,
    );
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  /**
   * Throws error if auction could not be found
   *
   * @param auctionId - Auction to check for
   */
  private async validateAuction(auctionId: BigNumber): Promise<EnglishAuction> {
    try {
      return await this.getAuction(auctionId);
    } catch (err) {
      console.error(`Error getting the auction with id ${auctionId}`);
      throw err;
    }
  }

  /**
   * Helper method maps the auction to the auction interface.
   *
   * @internal
   * @param auction - The auction to map, as returned from the contract.
   * @returns - The mapped interface.
   */
  public async mapAuction(
    auction: IEnglishAuctions.AuctionStruct,
  ): Promise<EnglishAuction> {
    return {
      id: auction.auctionId.toString(),
      auctionCreatorAddress: auction.auctionCreator,
      assetContractAddress: auction.assetContract,
      tokenId: auction.tokenId,
      quantity: auction.quantity,
      currencyContractAddress: auction.currency,
      minimumBidAmount: BigNumber.from(auction.minimumBidAmount),
      minimumBidCurrencyValue: await fetchCurrencyValue(
        this.englishAuctions.getProvider(),
        auction.currency,
        auction.minimumBidAmount,
      ),
      buyoutBidAmount: BigNumber.from(auction.buyoutBidAmount),
      buyoutCurrencyValue: await fetchCurrencyValue(
        this.englishAuctions.getProvider(),
        auction.currency,
        auction.buyoutBidAmount,
      ),
      timeBufferInSeconds: BigNumber.from(auction.timeBufferInSeconds),
      bidBufferBps: BigNumber.from(auction.bidBufferBps),
      startTimeInSeconds: auction.startTimestamp,
      endTimeInSeconds: auction.endTimestamp,
      asset: await fetchTokenMetadataForContract(
        auction.assetContract,
        this.englishAuctions.getProvider(),
        auction.tokenId,
        this.storage,
      ),
    };
  }

  /**
   * Maps an auction-bid to the strict interface
   *
   * @internal
   * @param bid
   * @returns - A `Bid` object
   */
  public async mapBid(
    auctionId: BigNumber,
    bidderAddress: string,
    currencyContractAddress: string,
    bidAmount: BigNumber,
  ): Promise<Bid> {
    return {
      auctionId,
      bidderAddress,
      currencyContractAddress,
      bidAmount,
      bidAmountCurrencyValue: await fetchCurrencyValue(
        this.englishAuctions.getProvider(),
        currencyContractAddress,
        bidAmount,
      ),
    } as Bid;
  }
}
