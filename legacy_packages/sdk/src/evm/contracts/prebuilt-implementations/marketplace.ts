import type { Marketplace as MarketplaceContract } from "@thirdweb-dev/contracts-js";
import { NewOfferEventObject } from "@thirdweb-dev/contracts-js/dist/declarations/src/Marketplace";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, CallOverrides, constants } from "ethers";
import invariant from "tiny-invariant";
import { DEFAULT_QUERY_ALL_COUNT } from "../../../core/schema/QueryParams";
import { isNativeToken } from "../../common/currency/isNativeToken";
import { ListingNotFoundError } from "../../common/error";
import { mapOffer } from "../../common/marketplace";
import { getRoleHash } from "../../common/role";
import { buildTransactionFunction } from "../../common/transactions";
import { SUPPORTED_CHAIN_ID } from "../../constants/chains/SUPPORTED_CHAIN_ID";
import { NATIVE_TOKENS } from "../../constants/currency";
import { ContractAppURI } from "../../core/classes/contract-appuri";
import { ContractEncoder } from "../../core/classes/contract-encoder";
import { ContractEvents } from "../../core/classes/contract-events";
import { ContractInterceptor } from "../../core/classes/contract-interceptor";
import { ContractMetadata } from "../../core/classes/contract-metadata";
import { ContractPlatformFee } from "../../core/classes/contract-platform-fee";
import { ContractRoles } from "../../core/classes/contract-roles";
import { ContractWrapper } from "../../core/classes/internal/contract-wrapper";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import { MarketplaceAuction } from "../../core/classes/internal/marketplace/marketplace-auction";
import { MarketplaceDirect } from "../../core/classes/internal/marketplace/marketplace-direct";
import { Transaction } from "../../core/classes/transactions";
import { UpdateableNetwork } from "../../core/interfaces/contract";
import { NetworkInput } from "../../core/types";
import { Abi, AbiInput, AbiSchema } from "../../schema/contracts/custom";
import { MarketplaceContractSchema } from "../../schema/contracts/marketplace";
import { SDKOptions } from "../../schema/sdk-options";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { Price } from "../../types/currency";
import { MarketplaceFilter } from "../../types/marketplace/MarketPlaceFilter";
import { UnmappedOffer } from "../../types/marketplace/UnmappedOffer";
import { MARKETPLACE_CONTRACT_ROLES } from "../contractRoles";
import { ListingType } from "../../enums/marketplace/ListingType";
import { AuctionListing } from "../../types/marketplace/AuctionListing";
import { DirectListing } from "../../types/marketplace/DirectListing";
import { Offer } from "../../types/marketplace/Offer";

/**
 * Create your own whitelabel marketplace that enables users to buy and sell any digital assets.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = await sdk.getContract("{{contract_address}}", "marketplace");
 * ```
 *
 * @internal
 * @deprecated use contract.directListings / contract.auctions / contract.offers instead
 */
export class Marketplace implements UpdateableNetwork {
  static contractRoles = MARKETPLACE_CONTRACT_ROLES;

  public abi: Abi;
  private contractWrapper: ContractWrapper<MarketplaceContract>;
  private storage: ThirdwebStorage;

  public encoder: ContractEncoder<MarketplaceContract>;
  public events: ContractEvents<MarketplaceContract>;
  public estimator: GasCostEstimator<MarketplaceContract>;
  public platformFees: ContractPlatformFee;
  public metadata: ContractMetadata<
    MarketplaceContract,
    typeof MarketplaceContractSchema
  >;
  public app: ContractAppURI<MarketplaceContract>;
  public roles: ContractRoles<
    MarketplaceContract,
    (typeof Marketplace.contractRoles)[number]
  >;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<MarketplaceContract>;
  /**
   * Direct listings
   * @remarks Create and manage direct listings in your marketplace.
   * @example
   * ```javascript
   * // Data of the listing you want to create
   * const listing = {
   *   // address of the NFT contract the asset you want to list is on
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
   *   // how much the asset will be sold for
   *   buyoutPricePerToken: "1.5",
   * }
   *
   * const tx = await contract.direct.createListing(listing);
   * const receipt = tx.receipt; // the transaction receipt
   * const listingId = tx.id; // the id of the newly created listing
   *
   * // And on the buyers side:
   * // Quantity of the asset you want to buy
   * const quantityDesired = 1;
   * await contract.direct.buyoutListing(listingId, quantityDesired);
   * ```
   */
  public direct: MarketplaceDirect;
  /**
   * Auctions
   * @remarks Create and manage auctions in your marketplace.
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
   * const listingId = tx.id; // the id of the newly created listing
   *
   * // And on the buyers side:
   * // The price you are willing to bid for a single token of the listing
   * const pricePerToken = 2.6;
   * await contract.auction.makeBid(listingId, pricePerToken);
   * ```
   */
  public auction: MarketplaceAuction;

  private _chainId;
  get chainId() {
    return this._chainId;
  }

  constructor(
    network: NetworkInput,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: AbiInput,
    chainId: number,
    contractWrapper = new ContractWrapper<MarketplaceContract>(
      network,
      address,
      abi,
      options,
      storage,
    ),
  ) {
    this._chainId = chainId;
    this.abi = AbiSchema.parse(abi || []);
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      MarketplaceContractSchema,
      this.storage,
    );

    this.app = new ContractAppURI(
      this.contractWrapper,
      this.metadata,
      this.storage,
    );
    this.roles = new ContractRoles(
      this.contractWrapper,
      Marketplace.contractRoles,
    );
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.direct = new MarketplaceDirect(this.contractWrapper, this.storage);
    this.auction = new MarketplaceAuction(this.contractWrapper, this.storage);
    this.events = new ContractEvents(this.contractWrapper);
    this.platformFees = new ContractPlatformFee(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
  }

  onNetworkUpdated(network: NetworkInput) {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  getAddress(): string {
    return this.contractWrapper.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Convenience function to get either a direct or auction listing
   *
   * @param listingId - the listing id
   * @returns either a direct or auction listing
   *
   * @remarks Get a listing by its listing id
   * @example
   * ```javascript
   * const listingId = 0;
   * const listing = await contract.getListing(listingId);
   * ```
   */
  public async getListing(
    listingId: BigNumberish,
  ): Promise<AuctionListing | DirectListing> {
    const listing = await this.contractWrapper.read("listings", [listingId]);
    if (listing.assetContract === constants.AddressZero) {
      throw new ListingNotFoundError(this.getAddress(), listingId.toString());
    }
    switch (listing.listingType) {
      case ListingType.Auction: {
        return await this.auction.mapListing(listing);
      }
      case ListingType.Direct: {
        return await this.direct.mapListing(listing);
      }
      default: {
        throw new Error(`Unknown listing type: ${listing.listingType}`);
      }
    }
  }

  /**
   * Get all active listings
   *
   * @remarks Fetch all the active listings from this marketplace contract. An active listing means it can be bought or bid on.
   * @example
   * ```javascript
   * const listings = await contract.getActiveListings();
   * const priceOfFirstActiveListing = listings[0].price;
   * ```
   * @param filter - optional filter parameters
   */
  public async getActiveListings(
    filter?: MarketplaceFilter,
  ): Promise<(AuctionListing | DirectListing)[]> {
    const rawListings = await this.getAllListingsNoFilter(true);
    const filtered = this.applyFilter(rawListings, filter);
    const now = BigNumber.from(Math.floor(Date.now() / 1000));
    return filtered.filter((l) => {
      return (
        (l.type === ListingType.Auction &&
          BigNumber.from(l.endTimeInEpochSeconds).gt(now) &&
          BigNumber.from(l.startTimeInEpochSeconds).lte(now)) ||
        (l.type === ListingType.Direct && BigNumber.from(l.quantity).gt(0))
      );
    });
  }

  /**
   * Get all the listings
   *
   * @remarks Fetch all the listings from this marketplace contract, including sold ones.
   * @example
   * ```javascript
   * const listings = await contract.getAllListings();
   * const priceOfFirstListing = listings[0].price;
   * ```
   *
   * @param filter - optional filter parameters
   */
  public async getAllListings(
    filter?: MarketplaceFilter,
  ): Promise<(AuctionListing | DirectListing)[]> {
    const rawListings = await this.getAllListingsNoFilter(false);
    return this.applyFilter(rawListings, filter);
  }

  /**
   * @internal
   */
  public getAll = this.getAllListings;

  /**
   * Get the total number of Listings
   * @returns The total number listings on the marketplace
   * @public
   */
  public async getTotalCount(): Promise<BigNumber> {
    return await this.contractWrapper.read("totalListings", []);
  }

  /**
   * Get whether listing is restricted only to addresses with the Lister role
   */
  public async isRestrictedToListerRoleOnly(): Promise<boolean> {
    const anyoneCanList = await this.contractWrapper.read("hasRole", [
      getRoleHash("lister"),
      constants.AddressZero,
    ]);
    return !anyoneCanList;
  }

  /**
   * Get the buffer in basis points between offers
   */
  public async getBidBufferBps(): Promise<BigNumber> {
    return this.contractWrapper.read("bidBufferBps", []);
  }

  /**
   * get the buffer time in seconds between offers
   */
  public async getTimeBufferInSeconds(): Promise<BigNumber> {
    return this.contractWrapper.read("timeBuffer", []);
  }

  /**
   * Get all the offers for a listing
   *
   * @remarks Fetch all the offers for a specified direct or auction listing.
   * @example
   * ```javascript
   * const offers = await marketplaceContract.getOffers(listingId);
   * const firstOffer = offers[0];
   * ```
   *
   * @param listingId - the id of the listing to fetch offers for
   */
  public async getOffers(listingId: BigNumberish): Promise<Offer[]> {
    // get all new offer events from this contract
    const listingEvents = await this.events.getEvents<NewOfferEventObject>(
      "NewOffer",
      {
        order: "desc",
        filters: {
          listingId,
        },
      },
    );
    // derive the offers from the events
    return await Promise.all(
      listingEvents.map((e): Promise<Offer> => {
        return mapOffer(
          this.contractWrapper.getProvider(),
          BigNumber.from(listingId),
          {
            quantityWanted: e.data.quantityWanted,
            pricePerToken: e.data.quantityWanted.gt(0)
              ? e.data.totalOfferAmount.div(e.data.quantityWanted)
              : e.data.totalOfferAmount,
            currency: e.data.currency,
            offeror: e.data.offeror,
          } as UnmappedOffer,
        );
      }),
    );
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Purchase NFTs
   * @remarks Buy a Direct or Auction listing on your marketplace.
   * @example
   * ```javascript
   * // The listing ID of the asset you want to buy
   * const listingId = 0;
   * // Quantity of the asset you want to buy
   * const quantityDesired = 1;
   *
   * await contract.buyoutListing(listingId, quantityDesired);
   * ```
   * @param listingId - the listing ID of the listing you want to buy
   * @param quantityDesired - the quantity that you want to buy (for ERC1155 tokens)
   * @param receiver - optional receiver of the bought listing if different from the connected wallet (for direct listings only)
   */
  buyoutListing = /* @__PURE__ */ buildTransactionFunction(
    async (
      listingId: BigNumberish,
      quantityDesired?: BigNumberish,
      receiver?: AddressOrEns,
    ) => {
      const listing = await this.contractWrapper.read("listings", [listingId]);
      if (listing.listingId.toString() !== listingId.toString()) {
        throw new ListingNotFoundError(this.getAddress(), listingId.toString());
      }
      switch (listing.listingType) {
        case ListingType.Direct: {
          invariant(
            quantityDesired !== undefined,
            "quantityDesired is required when buying out a direct listing",
          );
          return await this.direct.buyoutListing.prepare(
            listingId,
            quantityDesired,
            receiver,
          );
        }
        case ListingType.Auction: {
          return await this.auction.buyoutListing.prepare(listingId);
        }
        default:
          throw Error(`Unknown listing type: ${listing.listingType}`);
      }
    },
  );

  /**
   * Make an offer for a Direct or Auction Listing
   *
   * @remarks Make an offer on a direct or auction listing
   *
   * @example
   * ```javascript
   * // The listing ID of the asset you want to offer on
   * const listingId = 0;
   * // The price you are willing to offer per token
   * const pricePerToken = 0.5;
   * // The quantity of tokens you want to receive for this offer
   * const quantity = 1;
   *
   * await contract.makeOffer(
   *   listingId,
   *   pricePerToken,
   *   quantity,
   * );
   * ```
   */
  makeOffer = /* @__PURE__ */ buildTransactionFunction(
    async (
      listingId: BigNumberish,
      pricePerToken: Price,
      quantity?: BigNumberish,
    ) => {
      const listing = await this.contractWrapper.read("listings", [listingId]);
      if (listing.listingId.toString() !== listingId.toString()) {
        throw new ListingNotFoundError(this.getAddress(), listingId.toString());
      }
      const chainId = await this.contractWrapper.getChainID();
      switch (listing.listingType) {
        case ListingType.Direct: {
          invariant(
            quantity,
            "quantity is required when making an offer on a direct listing",
          );
          return await this.direct.makeOffer.prepare(
            listingId,
            quantity,
            isNativeToken(listing.currency)
              ? NATIVE_TOKENS[chainId as SUPPORTED_CHAIN_ID].wrapped.address
              : listing.currency,
            pricePerToken,
          );
        }
        case ListingType.Auction: {
          return await this.auction.makeBid.prepare(listingId, pricePerToken);
        }
        default:
          throw Error(`Unknown listing type: ${listing.listingType}`);
      }
    },
  );

  /**
   * Set the Auction bid buffer
   * @remarks A percentage (e.g. 5%) in basis points (5% = 500, 100% = 10000). A new bid is considered to be a winning bid only if its bid amount is at least the bid buffer (e.g. 5%) greater than the previous winning bid. This prevents buyers from making very slightly higher bids to win the auctioned items.
   * @example
   * ```javascript
   * // the bid buffer in basis points
   * const bufferBps = 5_00; // 5%
   * await contract.setBidBufferBps(bufferBps);
   * ```
   * @param bufferBps - the bps value
   */
  setBidBufferBps = /* @__PURE__ */ buildTransactionFunction(
    async (bufferBps: BigNumberish) => {
      await this.roles.verify(
        ["admin"],
        await this.contractWrapper.getSignerAddress(),
      );

      const timeBuffer = await this.getTimeBufferInSeconds();

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setAuctionBuffers",
        args: [timeBuffer, BigNumber.from(bufferBps)],
      });
    },
  );

  /**
   * Set the Auction Time buffer:
   * @remarks Measured in seconds (e.g. 15 minutes or 900 seconds). If a winning bid is made within the buffer of the auction closing (e.g. 15 minutes within the auction closing), the auction's closing time is increased by the buffer to prevent buyers from making last minute winning bids, and to give time to other buyers to make a higher bid if they wish to.
   * @example
   * ```javascript
   * // the time buffer in seconds
   * const bufferInSeconds = 60;
   * await contract.setTimeBufferInSeconds(bufferInSeconds);
   * ```
   * @param bufferInSeconds - the seconds value
   */
  setTimeBufferInSeconds = /* @__PURE__ */ buildTransactionFunction(
    async (bufferInSeconds: BigNumberish) => {
      await this.roles.verify(
        ["admin"],
        await this.contractWrapper.getSignerAddress(),
      );

      const bidBuffer = await this.getBidBufferBps();

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setAuctionBuffers",
        args: [BigNumber.from(bufferInSeconds), bidBuffer],
      });
    },
  );

  /**
   * Restrict listing NFTs only from the specified NFT contract address.
   * It is possible to allow listing from multiple contract addresses.
   * @param contractAddress - the NFT contract address
   */
  allowListingFromSpecificAssetOnly = /* @__PURE__ */ buildTransactionFunction(
    async (contractAddress: string) => {
      const encoded: string[] = [];
      const members = await this.roles.get("asset");
      if (members.includes(constants.AddressZero)) {
        encoded.push(
          this.encoder.encode("revokeRole", [
            getRoleHash("asset"),
            constants.AddressZero,
          ]),
        );
      }
      encoded.push(
        this.encoder.encode("grantRole", [
          getRoleHash("asset"),
          contractAddress,
        ]),
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [encoded],
      });
    },
  );

  /**
   * Allow listings from any NFT contract
   */
  allowListingFromAnyAsset = /* @__PURE__ */ buildTransactionFunction(
    async () => {
      const encoded: string[] = [];
      const members = await this.roles.get("asset");
      for (const addr in members) {
        encoded.push(
          this.encoder.encode("revokeRole", [getRoleHash("asset"), addr]),
        );
      }
      encoded.push(
        this.encoder.encode("grantRole", [
          getRoleHash("asset"),
          constants.AddressZero,
        ]),
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [encoded],
      });
    },
  );

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  private async getAllListingsNoFilter(
    filterInvalidListings: boolean,
  ): Promise<(AuctionListing | DirectListing)[]> {
    const listings = await Promise.all(
      Array.from(
        Array(
          (await this.contractWrapper.read("totalListings", [])).toNumber(),
        ).keys(),
      ).map(async (i) => {
        let listing;

        try {
          listing = await this.getListing(i);
        } catch (err) {
          if (err instanceof ListingNotFoundError) {
            return undefined;
          } else {
            console.warn(
              `Failed to get listing ${i}' - skipping. Try 'marketplace.getListing(${i})' to get the underlying error.`,
            );
            return undefined;
          }
        }

        if (listing.type === ListingType.Auction) {
          return listing;
        }

        if (filterInvalidListings) {
          const { valid } = await this.direct.isStillValidListing(listing);
          if (!valid) {
            return undefined;
          }
        }

        return listing;
      }),
    );
    return listings.filter((l) => l !== undefined) as (
      | AuctionListing
      | DirectListing
    )[];
  }

  private applyFilter(
    listings: (AuctionListing | DirectListing)[],
    filter?: MarketplaceFilter,
  ) {
    let rawListings = [...listings];
    const start = BigNumber.from(filter?.start || 0).toNumber();
    const count = BigNumber.from(
      filter?.count || DEFAULT_QUERY_ALL_COUNT,
    ).toNumber();
    if (filter) {
      if (filter.seller) {
        rawListings = rawListings.filter(
          (seller) =>
            seller.sellerAddress.toString().toLowerCase() ===
            filter?.seller?.toString().toLowerCase(),
        );
      }
      if (filter.tokenContract) {
        rawListings = rawListings.filter(
          (tokenContract) =>
            tokenContract.assetContractAddress.toString().toLowerCase() ===
            filter?.tokenContract?.toString().toLowerCase(),
        );
      }

      if (filter.tokenId !== undefined) {
        rawListings = rawListings.filter(
          (tokenContract) =>
            tokenContract.tokenId.toString() === filter?.tokenId?.toString(),
        );
      }
      rawListings = rawListings.filter((_, index) => index >= start);
      rawListings = rawListings.slice(0, count);
    }
    return rawListings;
  }

  /**
   * @internal
   */
  public async prepare<
    TMethod extends
      keyof MarketplaceContract["functions"] = keyof MarketplaceContract["functions"],
  >(
    method: string & TMethod,
    args: any[] & Parameters<MarketplaceContract["functions"][TMethod]>,
    overrides?: CallOverrides,
  ) {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method,
      args,
      overrides,
    });
  }

  /**
   * @internal
   */
  public async call<
    TMethod extends
      keyof MarketplaceContract["functions"] = keyof MarketplaceContract["functions"],
  >(
    functionName: string & TMethod,
    args?: Parameters<MarketplaceContract["functions"][TMethod]>,
    overrides?: CallOverrides,
  ): Promise<ReturnType<MarketplaceContract["functions"][TMethod]>> {
    return this.contractWrapper.call(functionName, args, overrides);
  }
}
