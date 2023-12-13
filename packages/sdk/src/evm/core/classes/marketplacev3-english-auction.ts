import type {
  EnglishAuctionsLogic,
  IEnglishAuctions,
  IMulticall,
  MarketplaceV3,
} from "@thirdweb-dev/contracts-js";
import { NewAuctionEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/EnglishAuctionsLogic";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, constants, utils, type BigNumberish } from "ethers";
import invariant from "tiny-invariant";
import { cleanCurrencyAddress } from "../../common/currency/cleanCurrencyAddress";
import { fetchCurrencyMetadata } from "../../common/currency/fetchCurrencyMetadata";
import { fetchCurrencyValue } from "../../common/currency/fetchCurrencyValue";
import { normalizePriceValue } from "../../common/currency/normalizePriceValue";
import { setErc20Allowance } from "../../common/currency/setErc20Allowance";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { AuctionHasNotEndedError } from "../../common/error";
import { getAllInBatches, handleTokenApproval } from "../../common/marketplace";
import { fetchTokenMetadataForContract } from "../../common/nft";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_ENGLISH_AUCTIONS } from "../../constants/thirdweb-features";
import { Status } from "../../enums/marketplace/Status";
import {
  EnglishAuctionInputParams,
  EnglishAuctionInputParamsSchema,
} from "../../schema/marketplacev3/english-auctions";
import { Address } from "../../schema/shared/Address";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { CurrencyValue, Price } from "../../types/currency";
import type { MarketplaceFilterWithoutOfferor } from "../../types/marketplace/MarketPlaceFilter";
import { EnglishAuction } from "../../types/marketplacev3/EnglishAuction";
import { Bid } from "../../types/marketplacev3/Bid";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../types";
import { ContractEncoder } from "./contract-encoder";
import { ContractEvents } from "./contract-events";
import { ContractInterceptor } from "./contract-interceptor";
import { ContractWrapper } from "./internal/contract-wrapper";
import { GasCostEstimator } from "./gas-cost-estimator";
import { Transaction } from "./transactions";

/**
 * Handles auctions
 * @public
 */
export class MarketplaceV3EnglishAuctions<
  TContract extends EnglishAuctionsLogic,
> implements DetectableFeature
{
  featureName = FEATURE_ENGLISH_AUCTIONS.name;
  private contractWrapper: ContractWrapper<EnglishAuctionsLogic>;
  private storage: ThirdwebStorage;

  // utilities
  public events: ContractEvents<EnglishAuctionsLogic>;
  public interceptor: ContractInterceptor<EnglishAuctionsLogic>;
  public encoder: ContractEncoder<EnglishAuctionsLogic>;
  public estimator: GasCostEstimator<EnglishAuctionsLogic>;

  constructor(
    contractWrapper: ContractWrapper<TContract>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.events = new ContractEvents(this.contractWrapper);
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
  }

  getAddress(): string {
    return this.contractWrapper.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get the total number of english auctions
   *
   * @returns Returns the total number of auctions created.
   * @public
   *
   * @example
   * ```javascript
   * const totalAuctions = await contract.englishAuctions.getTotalCount();
   * ```
   * @twfeature EnglishAuctions
   */
  public async getTotalCount(): Promise<BigNumber> {
    return await this.contractWrapper.read("totalAuctions", []);
  }

  /**
   * Get all english auctions
   *
   * @example
   * ```javascript
   * const auctions = await contract.englishAuctions.getAll();
   * ```
   *
   * @param filter - optional filter parameters
   * @returns the Auction object array
   * @twfeature EnglishAuctions
   */
  public async getAll(
    filter?: MarketplaceFilterWithoutOfferor,
  ): Promise<EnglishAuction[]> {
    const totalAuctions = await this.getTotalCount();

    const start = BigNumber.from(filter?.start || 0).toNumber();
    const end = totalAuctions.toNumber();

    if (end === 0) {
      throw new Error(`No auctions exist on the contract.`);
    }

    let rawAuctions: IEnglishAuctions.AuctionStructOutput[] = [];
    const batches = await getAllInBatches(start, end, (startId, endId) =>
      this.contractWrapper.read("getAllAuctions", [startId, endId]),
    );
    rawAuctions = batches.flat();

    const filteredAuctions = await this.applyFilter(rawAuctions, filter);

    return await Promise.all(
      filteredAuctions.map((auction) => this.mapAuction(auction)),
    );
  }

  /**
   * Get all valid english auctions
   *
   * @example
   * ```javascript
   * const auctions = await contract.englishAuctions.getAllValid();
   * ```
   *
   * @param filter - optional filter parameters
   * @returns the Auction object array
   * @twfeature EnglishAuctions
   */
  public async getAllValid(
    filter?: MarketplaceFilterWithoutOfferor,
  ): Promise<EnglishAuction[]> {
    const totalAuctions = await this.getTotalCount();

    const start = BigNumber.from(filter?.start || 0).toNumber();
    const end = totalAuctions.toNumber();

    if (end === 0) {
      throw new Error(`No auctions exist on the contract.`);
    }

    let rawAuctions: IEnglishAuctions.AuctionStructOutput[] = [];
    const batches = await getAllInBatches(start, end, (startId, endId) =>
      this.contractWrapper.read("getAllValidAuctions", [startId, endId]),
    );
    rawAuctions = batches.flat();

    const filteredAuctions = await this.applyFilter(rawAuctions, filter);

    return await Promise.all(
      filteredAuctions.map((auction) => this.mapAuction(auction)),
    );
  }

  /**
   * Get a single english auction
   *
   * @example
   * ```javascript
   * const auctionId = 0;
   * const auction = await contract.englishAuctions.getAuction(auctionId);
   * ```
   *
   * @param auctionId - the auction Id
   * @returns the Auction object
   * @twfeature EnglishAuctions
   */
  public async getAuction(auctionId: BigNumberish): Promise<EnglishAuction> {
    const auction = await this.contractWrapper.read("getAuction", [auctionId]);

    return await this.mapAuction(auction);
  }

  /**
   * Get winning bid of an english auction
   *
   * @remarks Get the current highest bid of an active auction.
   *
   * @example
   * ```javascript
   * // The ID of the auction
   * const auctionId = 0;
   * const winningBid = await contract.englishAuctions.getWinningBid(auctionId);
   * ```
   * @param auctionId - the auction Id
   * @twfeature EnglishAuctions
   */
  public async getWinningBid(
    auctionId: BigNumberish,
  ): Promise<Bid | undefined> {
    await this.validateAuction(BigNumber.from(auctionId));
    const bid = await this.contractWrapper.read("getWinningBid", [auctionId]);
    if (bid._bidder === constants.AddressZero) {
      return undefined;
    }
    return await this.mapBid(
      auctionId.toString(),
      bid._bidder,
      bid._currency,
      bid._bidAmount.toString(),
    );
  }

  /**
   * Check if a bid is or will be a winning bid
   *
   * @example
   * ```javascript
   * const auctionId = 0;
   * const bidAmount = 100;
   * const isWinningBid = await contract.englishAuctions.isWinningBid(auctionId, bidAmount);
   * ```
   *
   * @param auctionId - Auction Id
   * @param bidAmount - Amount to bid
   * @returns true if the bid is or will be a winning bid
   * @twfeature EnglishAuctions
   */
  public async isWinningBid(
    auctionId: BigNumberish,
    bidAmount: BigNumberish,
  ): Promise<boolean> {
    return await this.contractWrapper.read("isNewWinningBid", [
      auctionId,
      bidAmount,
    ]);
  }

  /**
   * Get the winner for a specific english auction
   *
   * @remarks Get the winner of the auction after an auction ends.
   *
   * @example
   * ```javascript
   * // The auction ID of a closed english auction
   * const auctionId = 0;
   * const auctionWinner = await contract.englishAuctions.getWinner(auctionId);
   * ```
   * @param auctionId - the auction Id
   * @returns the address of the auction winner
   * @twfeature EnglishAuctions
   */
  public async getWinner(auctionId: BigNumberish): Promise<Address> {
    const auction = await this.validateAuction(BigNumber.from(auctionId));
    const bid = await this.contractWrapper.read("getWinningBid", [auctionId]);
    const now = BigNumber.from(Math.floor(Date.now() / 1000));
    const endTime = BigNumber.from(auction.endTimeInSeconds);

    // if we have a winner in the map and the current time is past the endtime of the auction return the address of the winner
    if (now.gt(endTime) && bid._bidder !== constants.AddressZero) {
      return bid._bidder;
    }
    // otherwise fall back to query filter things

    // TODO this should be via indexer or direct contract call
    const contractEvent = new ContractEvents(this.contractWrapper);
    const closedAuctions = await contractEvent.getEvents("AuctionClosed");
    const closed = closedAuctions.find((a) =>
      a.data.auctionId.eq(BigNumber.from(auctionId)),
    );
    if (!closed) {
      throw new Error(
        `Could not find auction with ID ${auctionId} in closed auctions`,
      );
    }
    return closed.data.winningBidder;
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Create an english auction
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
   * @param auction - the auction data
   * @returns the transaction hash and the auction id
   * @twfeature EnglishAuctions
   */
  createAuction = /* @__PURE__ */ buildTransactionFunction(
    async (
      auction: EnglishAuctionInputParams,
    ): Promise<Transaction<TransactionResultWithId>> => {
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

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "createAuction",
        args: [
          {
            assetContract: parsedAuction.assetContractAddress,
            tokenId: parsedAuction.tokenId,
            quantity: parsedAuction.quantity,
            currency: cleanCurrencyAddress(
              parsedAuction.currencyContractAddress,
            ),
            minimumBidAmount: normalizedMinBidAmount,
            buyoutBidAmount: normalizedBuyoutAmount,
            timeBufferInSeconds: parsedAuction.timeBufferInSeconds,
            bidBufferBps: parsedAuction.bidBufferBps,
            startTimestamp: parsedAuction.startTimestamp,
            endTimestamp: parsedAuction.endTimestamp,
          } as IEnglishAuctions.AuctionParametersStruct,
        ],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<NewAuctionEvent>(
            "NewAuction",
            receipt.logs,
          )[0];
          return {
            id: event.args.auctionId,
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
   * const tx = await contract.englishAuctions.createAuctionsBatch(auctions);
   * ```
   */
  createAuctionsBatch = /* @__PURE__ */ buildTransactionFunction(
    async (
      listings: EnglishAuctionInputParams[],
    ): Promise<Transaction<TransactionResultWithId[]>> => {
      const data = (
        await Promise.all(
          listings.map((listing) => this.createAuction.prepare(listing)),
        )
      ).map((tx) => tx.encode());

      return Transaction.fromContractWrapper({
        contractWrapper: this
          .contractWrapper as unknown as ContractWrapper<MarketplaceV3>,
        method: "multicall",
        args: [data],
        parse: (receipt) => {
          const events = this.contractWrapper.parseLogs<NewAuctionEvent>(
            "NewAuction",
            receipt?.logs,
          );
          return events.map((event) => {
            return {
              id: event.args.auctionId,
              receipt,
            };
          });
        },
      });
    },
  );

  /**
   * Buyout an english auction
   *
   * @remarks Buy a specific auction from the marketplace.
   *
   * @example
   * ```javascript
   * // The auction ID you want to buy
   * const auctionId = 0;
   *
   * await contract.englishAuctions.buyoutAuction(auctionId);
   * ```
   * @param auctionId - the auction id
   * @returns the transaction result
   * @twfeature EnglishAuctions
   */
  buyoutAuction = /* @__PURE__ */ buildTransactionFunction(
    async (auctionId: BigNumberish) => {
      const auction = await this.validateAuction(BigNumber.from(auctionId));

      const currencyMetadata = await fetchCurrencyMetadata(
        this.contractWrapper.getProvider(),
        auction.currencyContractAddress,
      );

      return this.makeBid.prepare(
        auctionId,
        utils.formatUnits(auction.buyoutBidAmount, currencyMetadata.decimals),
      );
    },
  );

  /**
   * Bid on an english auction
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
   * @param auctionId - the auction id
   * @param bidAmount - the amount you are willing to bid
   * @returns the transaction result
   * @twfeature EnglishAuctions
   */
  makeBid = /* @__PURE__ */ buildTransactionFunction(
    async (auctionId: BigNumberish, bidAmount: Price) => {
      const auction = await this.validateAuction(BigNumber.from(auctionId));

      const normalizedBidAmount = await normalizePriceValue(
        this.contractWrapper.getProvider(),
        bidAmount,
        auction.currencyContractAddress,
      );
      if (normalizedBidAmount.eq(BigNumber.from(0))) {
        throw new Error("Cannot make a bid with 0 value");
      }

      if (
        BigNumber.from(auction.buyoutBidAmount).gt(0) &&
        normalizedBidAmount.gt(auction.buyoutBidAmount)
      ) {
        throw new Error(
          "Bid amount must be less than or equal to buyoutBidAmount",
        );
      }

      const winningBid = await this.getWinningBid(auctionId);
      if (winningBid) {
        const isWinnner = await this.isWinningBid(
          auctionId,
          normalizedBidAmount,
        );

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

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "bidInAuction",
        args: [auctionId, normalizedBidAmount],
        overrides,
      });
    },
  );

  /**
   * Cancel an english auction
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
   * @param auctionId - the auction id
   * @returns the transaction result
   * @twfeature EnglishAuctions
   */
  cancelAuction = /* @__PURE__ */ buildTransactionFunction(
    async (auctionId: BigNumberish) => {
      const winningBid = await this.getWinningBid(auctionId);
      if (winningBid) {
        throw new Error(`Bids already made.`);
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "cancelAuction",
        args: [auctionId],
      });
    },
  );

  /**
   * Close the english auction for the bidder
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
   * @returns the transaction result
   * @twfeature EnglishAuctions
   */
  closeAuctionForBidder = /* @__PURE__ */ buildTransactionFunction(
    async (auctionId: BigNumberish, closeFor?: AddressOrEns) => {
      if (!closeFor) {
        closeFor = await this.contractWrapper.getSignerAddress();
      }
      const auction = await this.validateAuction(BigNumber.from(auctionId));
      try {
        return Transaction.fromContractWrapper({
          contractWrapper: this.contractWrapper,
          method: "collectAuctionTokens",
          args: [BigNumber.from(auctionId)],
        });
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
    },
  );

  /**
   * Close the english auction for the seller
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
   * @returns the transaction result
   * @twfeature EnglishAuctions
   */
  closeAuctionForSeller = /* @__PURE__ */ buildTransactionFunction(
    async (auctionId: BigNumberish) => {
      const auction = await this.validateAuction(BigNumber.from(auctionId));
      try {
        return Transaction.fromContractWrapper({
          contractWrapper: this.contractWrapper,
          method: "collectAuctionPayout",
          args: [BigNumber.from(auctionId)],
        });
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
    },
  );

  /**
   * Close the english auction for both the seller and the bidder
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
   * @returns the transaction result
   * @twfeature EnglishAuctions
   */
  executeSale = /* @__PURE__ */ buildTransactionFunction(
    async (auctionId: BigNumberish) => {
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
        return Transaction.fromContractWrapper({
          contractWrapper: this
            .contractWrapper as unknown as ContractWrapper<IMulticall>,
          method: "multicall",
          args: [[closeForSeller, closeForBuyer]],
        });
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
    },
  );

  /**
   * Get the buffer for an english auction
   *
   * @example
   * ```javascript
   * // The ID of the auction you want to get the buffer for
   * const auctionId = "0";
   * const buffer = await contract.englishAuctions.getBidBufferBps(auctionId);
   * ```
   *
   * @param auctionId - id of the auction
   * @returns the buffer in basis points
   * @twfeature EnglishAuctions
   */
  public async getBidBufferBps(auctionId: BigNumberish): Promise<number> {
    return (await this.getAuction(auctionId)).bidBufferBps;
  }

  /**
   * Get the minimum next bid for an english auction
   *
   * @example
   * ```javascript
   * // The ID of the auction you want to get the minimum next bid for
   * const auctionId = "0";
   * const minimumNextBid = await contract.englishAuctions.getMinimumNextBid(auctionId);
   * ```
   *
   * @returns the minimum bid a user can place to outbid the previous highest bid
   * @param auctionId - id of the auction
   * @twfeature EnglishAuctions
   */
  public async getMinimumNextBid(
    auctionId: BigNumberish,
  ): Promise<CurrencyValue> {
    // we can fetch all of these at the same time using promise.all
    const [currentBidBufferBps, winningBid, auction] = await Promise.all([
      this.getBidBufferBps(auctionId),
      this.getWinningBid(auctionId),
      this.validateAuction(BigNumber.from(auctionId)),
    ]);

    const currentBidOrReservePrice = winningBid
      ? // if there is a winning bid use the value of it
        BigNumber.from(winningBid.bidAmount)
      : // if there is no winning bid use the reserve price
        BigNumber.from(auction.minimumBidAmount);

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
  private async mapAuction(
    auction: IEnglishAuctions.AuctionStruct,
  ): Promise<EnglishAuction> {
    let status: Status = Status.UNSET;
    const block = await this.contractWrapper.getProvider().getBlock("latest");
    const blockTime = block.timestamp;
    switch (auction.status) {
      case 1:
        status = BigNumber.from(auction.startTimestamp).gt(blockTime)
          ? Status.Created
          : BigNumber.from(auction.endTimestamp).lt(blockTime)
          ? Status.Expired
          : Status.Active;
        break;
      case 2:
        status = Status.Completed;
        break;
      case 3:
        status = Status.Cancelled;
        break;
    }

    return {
      id: auction.auctionId.toString(),
      creatorAddress: auction.auctionCreator,
      assetContractAddress: auction.assetContract,
      tokenId: auction.tokenId.toString(),
      quantity: auction.quantity.toString(),
      currencyContractAddress: auction.currency,
      minimumBidAmount: auction.minimumBidAmount.toString(),
      minimumBidCurrencyValue: await fetchCurrencyValue(
        this.contractWrapper.getProvider(),
        auction.currency,
        auction.minimumBidAmount,
      ),
      buyoutBidAmount: auction.buyoutBidAmount.toString(),
      buyoutCurrencyValue: await fetchCurrencyValue(
        this.contractWrapper.getProvider(),
        auction.currency,
        auction.buyoutBidAmount,
      ),
      timeBufferInSeconds: BigNumber.from(
        auction.timeBufferInSeconds,
      ).toNumber(),
      bidBufferBps: BigNumber.from(auction.bidBufferBps).toNumber(),
      startTimeInSeconds: BigNumber.from(auction.startTimestamp).toNumber(),
      endTimeInSeconds: BigNumber.from(auction.endTimestamp).toNumber(),
      asset: await fetchTokenMetadataForContract(
        auction.assetContract,
        this.contractWrapper.getProvider(),
        auction.tokenId,
        this.storage,
      ),
      status: status,
    };
  }

  /**
   * Maps an auction-bid to the strict interface
   *
   * @internal
   * @param bid - The bid to map, as returned from the contract.
   * @returns - A `Bid` object
   */
  private async mapBid(
    auctionId: string,
    bidderAddress: AddressOrEns,
    currencyContractAddress: AddressOrEns,
    bidAmount: string,
  ): Promise<Bid> {
    const resolvedBidderAddress = await resolveAddress(bidderAddress);
    const resolvedCurrencyAddress = await resolveAddress(
      currencyContractAddress,
    );
    return {
      auctionId,
      bidderAddress: resolvedBidderAddress,
      currencyContractAddress: resolvedCurrencyAddress,
      bidAmount,
      bidAmountCurrencyValue: await fetchCurrencyValue(
        this.contractWrapper.getProvider(),
        resolvedCurrencyAddress,
        bidAmount,
      ),
    } as Bid;
  }

  private async applyFilter(
    auctions: IEnglishAuctions.AuctionStructOutput[],
    filter?: MarketplaceFilterWithoutOfferor,
  ) {
    let rawAuctions = [...auctions];

    if (filter) {
      if (filter.seller) {
        const resolvedSeller = await resolveAddress(filter.seller);
        rawAuctions = rawAuctions.filter(
          (seller) =>
            seller.auctionCreator.toString().toLowerCase() ===
            resolvedSeller?.toString().toLowerCase(),
        );
      }
      if (filter.tokenContract) {
        const resolvedToken = await resolveAddress(filter.tokenContract);
        rawAuctions = rawAuctions.filter(
          (tokenContract) =>
            tokenContract.assetContract.toString().toLowerCase() ===
            resolvedToken?.toString().toLowerCase(),
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
