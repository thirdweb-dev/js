import {
  AuctionAlreadyStartedError,
  AuctionHasNotEndedError,
} from "../../common";
import {
  cleanCurrencyAddress,
  fetchCurrencyMetadata,
  fetchCurrencyValue,
  normalizePriceValue,
  setErc20Allowance,
} from "../../common/currency";
import {
  getAllInBatches,
  handleTokenApproval,
} from "../../common/marketplacev3";
import { fetchTokenMetadataForContract } from "../../common/nft";
import {
  EnglishAuctionInputParams,
  EnglishAuctionInputParamsSchema,
} from "../../schema/marketplacev3/english-auctions";
import { MarketplaceFilter } from "../../types";
import { CurrencyValue, Price } from "../../types/currency";
import { EnglishAuction, Bid } from "../../types/marketplacev3";
import { TransactionResult, TransactionResultWithId } from "../types";
import { ContractEncoder } from "./contract-encoder";
import { ContractWrapper } from "./contract-wrapper";
import type {
  IEnglishAuctions,
  EnglishAuctionsLogic,
} from "@thirdweb-dev/contracts-js";
import { NewAuctionEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/EnglishAuctionsLogic";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, ethers, constants } from "ethers";
import invariant from "tiny-invariant";

/**
 * Handles auctions
 * @public
 */
export class MarketplaceV3EnglishAuctions {
  private contractWrapper: ContractWrapper<EnglishAuctionsLogic>;
  private storage: ThirdwebStorage;
  public encoder: ContractEncoder<EnglishAuctionsLogic>;

  constructor(
    contractWrapper: ContractWrapper<EnglishAuctionsLogic>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.encoder = new ContractEncoder<EnglishAuctionsLogic>(contractWrapper);
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get the total number of english auctions.
   * @returns Returns the total number of auctions created.
   * @public
   *
   * @example
   * ```javascript
   * const totalAuctions = await contract.englishAuctions.getTotalCount();
   * ```
   */
  public async getTotalCount(): Promise<BigNumber> {
    return await this.contractWrapper.readContract.totalAuctions();
  }

  /**
   * Get all auctions.
   *
   * @example
   * ```javascript
   * const auctions = await contract.englishAuctions.getAll();
   * ```
   *
   * @param filter - optional filter parameters
   * @returns the Auction object array
   */
  public async getAll(filter?: MarketplaceFilter): Promise<EnglishAuction[]> {
    const totalAuctions = await this.getTotalCount();

    let start = BigNumber.from(filter?.start || 0).toNumber();
    let end = totalAuctions.toNumber();

    if (end === 0) {
      throw new Error(`No auctions exist on the contract.`);
    }

    let rawAuctions: IEnglishAuctions.AuctionStructOutput[] = [];
    let batches = await getAllInBatches(
      start,
      end,
      this.contractWrapper.readContract.getAllAuctions,
    );
    rawAuctions = batches.flat();

    const filteredAuctions = this.applyFilter(rawAuctions, filter);

    return await Promise.all(
      filteredAuctions.map((auction) => this.mapAuction(auction)),
    );
  }

  /**
   * Get all valid auctions.
   *
   * @example
   * ```javascript
   * const auctions = await contract.englishAuctions.getAllValid();
   * ```
   *
   * @param filter - optional filter parameters
   * @returns the Auction object array
   */
  public async getAllValid(
    filter?: MarketplaceFilter,
  ): Promise<EnglishAuction[]> {
    const totalAuctions = await this.getTotalCount();

    let start = BigNumber.from(filter?.start || 0).toNumber();
    let end = totalAuctions.toNumber();

    if (end === 0) {
      throw new Error(`No auctions exist on the contract.`);
    }

    let rawAuctions: IEnglishAuctions.AuctionStructOutput[] = [];
    let batches = await getAllInBatches(
      start,
      end,
      this.contractWrapper.readContract.getAllValidAuctions,
    );
    rawAuctions = batches.flat();

    const filteredAuctions = this.applyFilter(rawAuctions, filter);

    return await Promise.all(
      filteredAuctions.map((auction) => this.mapAuction(auction)),
    );
  }

  /**
   * Get an Auction by id.
   *
   * @example
   * ```javascript
   * const auctionId = 0;
   * const auction = await contract.englishAuctions.getAuction(auctionId);
   * ```
   *
   * @param auctionId - the auction Id
   * @returns the Auction object
   */
  public async getAuction(auctionId: BigNumberish): Promise<EnglishAuction> {
    const auction = await this.contractWrapper.readContract.getAuction(
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
   * // The ID of the auction
   * const auctionId = 0;
   *
   * contract.englishAuctions.
   *   .getWinningBid(auctionId)
   *   .then((bid) => console.log(bid))
   *   .catch((err) => console.error(err));
   * ```
   */
  public async getWinningBid(
    auctionId: BigNumberish,
  ): Promise<Bid | undefined> {
    await this.validateAuction(BigNumber.from(auctionId));
    const bid = await this.contractWrapper.readContract.getWinningBid(
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
    return await this.contractWrapper.readContract.isNewWinningBid(
      auctionId,
      bidAmount,
    );
  }

  /**
   * Get Auction Winner
   *
   * @remarks Get the winner of the auction after an auction ends.
   *
   * @example
   * ```javascript
   * // The auction ID of the auction that closed
   * const auctionId = 0;
   *
   * contract.englishAuctions.
   *   .getWinner(auctionId)
   *   .then((auctionWinner) => console.log(auctionWinner))
   *   .catch((err) => console.error(err));
   * ```
   */
  public async getWinner(auctionId: BigNumberish): Promise<string> {
    const auction = await this.validateAuction(BigNumber.from(auctionId));
    const bid = await this.contractWrapper.readContract.getWinningBid(
      auctionId,
    );
    const now = BigNumber.from(Math.floor(Date.now() / 1000));
    const endTime = BigNumber.from(auction.endTimeInSeconds);

    // if we have a winner in the map and the current time is past the endtime of the auction return the address of the winner
    if (now.gt(endTime) && bid._bidder !== constants.AddressZero) {
      return bid._bidder;
    }
    // otherwise fall back to query filter things

    // TODO this should be via indexer or direct contract call
    const closedAuctions = await this.contractWrapper.readContract.queryFilter(
      this.contractWrapper.readContract.filters.AuctionClosed(),
    );
    const closed = closedAuctions.find((a) =>
      a.args.auctionId.eq(BigNumber.from(auctionId)),
    );
    if (!closed) {
      throw new Error(
        `Could not find auction with ID ${auctionId} in closed auctions`,
      );
    }
    return closed.args.winningBidder;
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
   *   // address of the contract of the asset you want to auction
   *   assetContractAddress: "0x...",
   *   // token ID of the asset you want to auction
   *   tokenId: "0",
   *   // how many of the asset you want to auction
   *   quantity: 1,
   *   // address of the currency contract that will be used to pay for the auctioned tokens
   *   currencyContractAddress: NATIVE_TOKEN_ADDRESS,
   *   // the minimum bid that will be accepted for the token
   *   minimumBidAmount: "1.5",
   *   // how much people would have to bid to instantly buy the asset
   *   buyoutBidAmount: "10",
   *   // If a bid is made less than these many seconds before expiration, the expiration time is increased by this.
   *   timeBufferInSeconds: "900", // 15 minutes by default
   *   // A bid must be at least this much bps greater than the current winning bid
   *   bidBufferBps: "500", // 5% by default
   *   // when should the auction open up for bidding
   *   startTimestamp: new Date(Date.now()),
   *   // end time of auction
   *   endTimestamp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
   * }
   *
   * const tx = await contract.englishAuctions.createAuction(auction);
   * const receipt = tx.receipt; // the transaction receipt
   * const id = tx.id; // the id of the newly created auction
   * ```
   */
  public async createAuction(
    auction: EnglishAuctionInputParams,
  ): Promise<TransactionResultWithId> {
    const parsedAuction = EnglishAuctionInputParamsSchema.parse(auction);

    await handleTokenApproval(
      this.contractWrapper,
      this.getAddress(),
      parsedAuction.assetContractAddress,
      parsedAuction.tokenId,
      await this.contractWrapper.getSignerAddress(),
    );

    const normalizedBuyoutAmount = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      parsedAuction.buyoutBidAmount,
      parsedAuction.currencyContractAddress,
    );

    const normalizedMinBidAmount = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      parsedAuction.minimumBidAmount,
      parsedAuction.currencyContractAddress,
    );

    const block = await this.contractWrapper.getProvider().getBlock("latest");
    const blockTime = block.timestamp;
    if (parsedAuction.startTimestamp.lt(blockTime)) {
      parsedAuction.startTimestamp = BigNumber.from(blockTime);
    }

    const receipt = await this.contractWrapper.sendTransaction(
      "createAuction",
      [
        {
          assetContract: parsedAuction.assetContractAddress,
          tokenId: parsedAuction.tokenId,
          quantity: parsedAuction.quantity,
          currency: cleanCurrencyAddress(parsedAuction.currencyContractAddress),
          minimumBidAmount: normalizedMinBidAmount,
          buyoutBidAmount: normalizedBuyoutAmount,
          timeBufferInSeconds: parsedAuction.timeBufferInSeconds,
          bidBufferBps: parsedAuction.bidBufferBps,
          startTimestamp: parsedAuction.startTimestamp,
          endTimestamp: parsedAuction.endTimestamp,
        } as IEnglishAuctions.AuctionParametersStruct,
      ],
      {
        // Higher gas limit for create auction
        gasLimit: 500000,
      },
    );

    const event = this.contractWrapper.parseLogs<NewAuctionEvent>(
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
   * @remarks Buy a specific auction from the marketplace.
   *
   * @example
   * ```javascript
   * // The auction ID of the asset you want to buy
   * const auctionId = 0;
   *
   * await contract.englishAuctions.buyoutAuction(auctionId);
   * ```
   */
  public async buyoutAuction(
    auctionId: BigNumberish,
  ): Promise<TransactionResult> {
    const auction = await this.validateAuction(BigNumber.from(auctionId));

    const currencyMetadata = await fetchCurrencyMetadata(
      this.contractWrapper.getProvider(),
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
   * @remarks Make a bid on an auction
   *
   * @example
   * ```javascript
   * // The auction ID of the asset you want to bid on
   * const auctionId = 0;
   * // The total amount you are willing to bid for auctioned tokens
   * const bidAmount = 1;
   *
   * await contract.englishAuctions.makeBid(auctionId, bidAmount);
   * ```
   */
  public async makeBid(
    auctionId: BigNumberish,
    bidAmount: Price,
  ): Promise<TransactionResult> {
    const auction = await this.validateAuction(BigNumber.from(auctionId));

    const normalizedBidAmount = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      bidAmount,
      auction.currencyContractAddress,
    );
    if (normalizedBidAmount.eq(BigNumber.from(0))) {
      throw new Error("Cannot make a bid with 0 value");
    }

    const winningBid = await this.getWinningBid(auctionId);
    if (winningBid) {
      const isWinnner = await this.isWinningBid(auctionId, normalizedBidAmount);

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

    const overrides = (await this.contractWrapper.getCallOverrides()) || {};
    await setErc20Allowance(
      this.contractWrapper,
      normalizedBidAmount,
      auction.currencyContractAddress,
      overrides,
    );
    return {
      receipt: await this.contractWrapper.sendTransaction(
        "bidInAuction",
        [auctionId, normalizedBidAmount],
        overrides,
      ),
    };
  }

  /**
   * Cancel Auction
   *
   * @remarks Cancel an auction on the marketplace
   *
   * @example
   * ```javascript
   * // The ID of the auction you want to cancel
   * const auctionId = "0";
   *
   * await contract.englishAuctions.cancelAuction(auctionId);
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
      receipt: await this.contractWrapper.sendTransaction("cancelAuction", [
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
   * // The ID of the auction you want to close
   * const auction = "0";
   * await contract.englishAuctions.closeAuctionForBidder(auctionId);
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
      closeFor = await this.contractWrapper.getSignerAddress();
    }
    const auction = await this.validateAuction(BigNumber.from(auctionId));
    try {
      return {
        receipt: await this.contractWrapper.sendTransaction(
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
   * // The ID of the auction you want to close
   * const auctionId = "0";
   * await contract.englishAuctions.closeAuctionForSeller(auctionId);
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
        receipt: await this.contractWrapper.sendTransaction(
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
   * // The ID of the auction you want to close
   * const auction = "0";
   * await contract.englishAuctions.executeSale(auctionId);
   * ```
   *
   * @param auctionId - the auction to close
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
      return await this.contractWrapper.multiCall([
        closeForSeller,
        closeForBuyer,
      ]);
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
   * Get the buffer in basis points between bids for an auction.
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
      this.contractWrapper.getProvider(),
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
        this.contractWrapper.getProvider(),
        auction.currency,
        auction.minimumBidAmount,
      ),
      buyoutBidAmount: BigNumber.from(auction.buyoutBidAmount),
      buyoutCurrencyValue: await fetchCurrencyValue(
        this.contractWrapper.getProvider(),
        auction.currency,
        auction.buyoutBidAmount,
      ),
      timeBufferInSeconds: BigNumber.from(auction.timeBufferInSeconds),
      bidBufferBps: BigNumber.from(auction.bidBufferBps),
      startTimeInSeconds: auction.startTimestamp,
      endTimeInSeconds: auction.endTimestamp,
      asset: await fetchTokenMetadataForContract(
        auction.assetContract,
        this.contractWrapper.getProvider(),
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
        this.contractWrapper.getProvider(),
        currencyContractAddress,
        bidAmount,
      ),
    } as Bid;
  }

  private applyFilter(
    auctions: IEnglishAuctions.AuctionStructOutput[],
    filter?: MarketplaceFilter,
  ) {
    let rawAuctions = [...auctions];

    if (filter) {
      if (filter.seller) {
        rawAuctions = rawAuctions.filter(
          (seller) =>
            seller.auctionCreator.toString().toLowerCase() ===
            filter?.seller?.toString().toLowerCase(),
        );
      }
      if (filter.tokenContract) {
        rawAuctions = rawAuctions.filter(
          (tokenContract) =>
            tokenContract.assetContract.toString().toLowerCase() ===
            filter?.tokenContract?.toString().toLowerCase(),
        );
      }

      if (filter.tokenId !== undefined) {
        rawAuctions = rawAuctions.filter(
          (tokenContract) =>
            tokenContract.tokenId.toString() === filter?.tokenId?.toString(),
        );
      }
    }

    return filter?.count && filter.count < rawAuctions.length
      ? rawAuctions.slice(0, filter.count)
      : rawAuctions;
  }
}
