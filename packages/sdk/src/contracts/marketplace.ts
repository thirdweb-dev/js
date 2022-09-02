import { ListingNotFoundError } from "../common";
import { getRoleHash } from "../common/role";
import { ContractEncoder } from "../core/classes/contract-encoder";
import { ContractEvents } from "../core/classes/contract-events";
import { ContractInterceptor } from "../core/classes/contract-interceptor";
import { ContractMetadata } from "../core/classes/contract-metadata";
import { ContractPlatformFee } from "../core/classes/contract-platform-fee";
import { ContractRoles } from "../core/classes/contract-roles";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { GasCostEstimator } from "../core/classes/gas-cost-estimator";
import { MarketplaceAuction } from "../core/classes/marketplace-auction";
import { MarketplaceDirect } from "../core/classes/marketplace-direct";
import { UpdateableNetwork } from "../core/interfaces/contract";
import { NetworkOrSignerOrProvider, TransactionResult } from "../core/types";
import { ListingType } from "../enums";
import { MarketplaceContractSchema } from "../schema/contracts/marketplace";
import { SDKOptions } from "../schema/sdk-options";
import { DEFAULT_QUERY_ALL_COUNT } from "../types/QueryParams";
import { AuctionListing, DirectListing } from "../types/marketplace";
import { MarketplaceFilter } from "../types/marketplace/MarketPlaceFilter";
import { Marketplace as MarketplaceContract } from "@thirdweb-dev/contracts-js";
import ABI from "@thirdweb-dev/contracts-js/dist/abis/Marketplace.json";
import { IStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, constants } from "ethers";
import invariant from "tiny-invariant";

/**
 * Create your own whitelabel marketplace that enables users to buy and sell any digital assets.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = sdk.getMarketplace("{{contract_address}}");
 * ```
 *
 * @public
 */
export class Marketplace implements UpdateableNetwork {
  static contractType = "marketplace" as const;
  static contractRoles = ["admin", "lister", "asset"] as const;
  static contractAbi = ABI as any;
  /**
   * @internal
   */
  static schema = MarketplaceContractSchema;

  private contractWrapper: ContractWrapper<MarketplaceContract>;
  private storage: IStorage;

  public encoder: ContractEncoder<MarketplaceContract>;
  public events: ContractEvents<MarketplaceContract>;
  public estimator: GasCostEstimator<MarketplaceContract>;
  public platformFees: ContractPlatformFee<MarketplaceContract>;
  public metadata: ContractMetadata<
    MarketplaceContract,
    typeof Marketplace.schema
  >;
  public roles: ContractRoles<
    MarketplaceContract,
    typeof Marketplace.contractRoles[number]
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

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: IStorage,
    options: SDKOptions = {},
    contractWrapper = new ContractWrapper<MarketplaceContract>(
      network,
      address,
      Marketplace.contractAbi,
      options,
    ),
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      Marketplace.schema,
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
    const listing = await this.contractWrapper.readContract.listings(listingId);
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
        (l.type === ListingType.Direct && l.quantity > 0)
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
   * @returns the total number listings on the marketplace
   * @public
   */
  public async getTotalCount(): Promise<BigNumber> {
    return await this.contractWrapper.readContract.totalListings();
  }

  /**
   * Get whether listing is restricted only to addresses with the Lister role
   */
  public async isRestrictedToListerRoleOnly(): Promise<boolean> {
    const anyoneCanList = await this.contractWrapper.readContract.hasRole(
      getRoleHash("lister"),
      constants.AddressZero,
    );
    return !anyoneCanList;
  }

  /**
   * Get the buffer in basis points between offers
   */
  public async getBidBufferBps(): Promise<BigNumber> {
    return this.contractWrapper.readContract.bidBufferBps();
  }

  /**
   * get the buffer time in seconds between offers
   */
  public async getTimeBufferInSeconds(): Promise<BigNumber> {
    return this.contractWrapper.readContract.timeBuffer();
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
  public async buyoutListing(
    listingId: BigNumberish,
    quantityDesired?: BigNumberish,
    receiver?: string,
  ): Promise<TransactionResult> {
    const listing = await this.contractWrapper.readContract.listings(listingId);
    if (listing.listingId.toString() !== listingId.toString()) {
      throw new ListingNotFoundError(this.getAddress(), listingId.toString());
    }
    switch (listing.listingType) {
      case ListingType.Direct: {
        invariant(
          quantityDesired !== undefined,
          "quantityDesired is required when buying out a direct listing",
        );
        return await this.direct.buyoutListing(
          listingId,
          quantityDesired,
          receiver,
        );
      }
      case ListingType.Auction: {
        return await this.auction.buyoutListing(listingId);
      }
      default:
        throw Error(`Unknown listing type: ${listing.listingType}`);
    }
  }

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
  public async setBidBufferBps(bufferBps: BigNumberish): Promise<void> {
    await this.roles.verify(
      ["admin"],
      await this.contractWrapper.getSignerAddress(),
    );

    const timeBuffer = await this.getTimeBufferInSeconds();
    await this.contractWrapper.sendTransaction("setAuctionBuffers", [
      timeBuffer,
      BigNumber.from(bufferBps),
    ]);
  }

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
  public async setTimeBufferInSeconds(
    bufferInSeconds: BigNumberish,
  ): Promise<void> {
    await this.roles.verify(
      ["admin"],
      await this.contractWrapper.getSignerAddress(),
    );

    const bidBuffer = await this.getBidBufferBps();
    await this.contractWrapper.sendTransaction("setAuctionBuffers", [
      BigNumber.from(bufferInSeconds),
      bidBuffer,
    ]);
  }

  /**
   * Restrict listing NFTs only from the specified NFT contract address.
   * It is possible to allow listing from multiple contract addresses.
   * @param contractAddress - the NFT contract address
   */
  public async allowListingFromSpecificAssetOnly(contractAddress: string) {
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
      this.encoder.encode("grantRole", [getRoleHash("asset"), contractAddress]),
    );

    await this.contractWrapper.multiCall(encoded);
  }

  /**
   * Allow listings from any NFT contract
   */
  public async allowListingFromAnyAsset() {
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
    await this.contractWrapper.multiCall(encoded);
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  private async getAllListingsNoFilter(
    filterInvalidListings: boolean,
  ): Promise<(AuctionListing | DirectListing)[]> {
    const listings = await Promise.all(
      Array.from(
        Array(
          (await this.contractWrapper.readContract.totalListings()).toNumber(),
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

  // TODO: Complete method implementation with subgraph
  // /**
  //  * @beta - This method is not yet complete.
  //  *
  //  * @param listingId
  //  * @returns
  //  */
  // public async getActiveOffers(listingId: BigNumberish): Promise<Offer[]> {
  //   const listing = await this.validateDirectListing(BigNumber.from(listingId));

  //   const offers = await this.readOnlyContract.offers(listing.id, "");

  //   return await Promise.all(
  //     offers.map(async (offer: any) => {
  //       return await this.mapOffer(BigNumber.from(listingId), offer);
  //     }),
  //   );
  // }
}
