import { DEFAULT_QUERY_ALL_COUNT } from "../../../core/schema/QueryParams";
import { ListingNotFoundError } from "../../common";
// ===
import { isNativeToken } from "../../common/currency";
import { mapOffer } from "../../common/marketplace";
import { getRoleHash } from "../../common/role";
import { NATIVE_TOKENS, SUPPORTED_CHAIN_ID } from "../../constants";
import { ContractEncoder } from "../../core/classes/contract-encoder";
import { ContractEvents } from "../../core/classes/contract-events";
import { ContractInterceptor } from "../../core/classes/contract-interceptor";
import { ContractMetadata } from "../../core/classes/contract-metadata";
import { ContractPlatformFee } from "../../core/classes/contract-platform-fee";
import { ContractRoles } from "../../core/classes/contract-roles";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
// ===
import { MarketplaceV3DirectListings } from "../../core/classes/marketplacev3-direct-listings";
import { MarketplaceV3EnglishAuctions } from "../../core/classes/marketplacev3-english-auction";
import { MarketplaceV3Offers } from "../../core/classes/marketplacev3-offers";
// ===
import { UpdateableNetwork } from "../../core/interfaces/contract";
import { NetworkOrSignerOrProvider, TransactionResult } from "../../core/types";
import { ListingType } from "../../enums";
// ===
import { MarketplaceContractSchema } from "../../schema/contracts/marketplace";
// ===
import { SDKOptions } from "../../schema/sdk-options";
import { Price } from "../../types/currency";
import { AuctionListing, DirectListing, Offer } from "../../types/marketplace";
// ===
import { MarketplaceFilter } from "../../types/marketplace/MarketPlaceFilter";
// ===
import { UnmappedOffer } from "../../types/marketplace/UnmappedOffer";
// ===
import type {
  MarketplaceEntrypoint,
  DirectListings,
  EnglishAuctions,
  Offers,
} from "@thirdweb-dev/contracts-js";
import DirectListingsABI from "@thirdweb-dev/contracts-js/dist/abis/DirectListings.json";
import EnglishAuctionsABI from "@thirdweb-dev/contracts-js/dist/abis/EnglishAuctions.json";
// ===
import type ABI from "@thirdweb-dev/contracts-js/dist/abis/Marketplace.json";
import OffersABI from "@thirdweb-dev/contracts-js/dist/abis/Offers.json";
// ===
import { NewOfferEventObject } from "@thirdweb-dev/contracts-js/dist/declarations/src/Marketplace";
// ===
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, CallOverrides, constants } from "ethers";
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
 * const contract = await sdk.getContract("{{contract_address}}", "marketplace");
 * ```
 *
 * @public
 */
export class MarketplaceV3 implements UpdateableNetwork {
  static contractRoles = ["admin", "lister", "asset"] as const;

  public abi: typeof ABI;
  private contractWrapper: ContractWrapper<MarketplaceEntrypoint>;
  private storage: ThirdwebStorage;

  public encoder: ContractEncoder<MarketplaceEntrypoint>;
  public events: ContractEvents<MarketplaceEntrypoint>;
  public estimator: GasCostEstimator<MarketplaceEntrypoint>;
  public platformFees: ContractPlatformFee<MarketplaceEntrypoint>;
  public metadata: ContractMetadata<
    MarketplaceEntrypoint,
    typeof MarketplaceContractSchema
  >;
  public roles: ContractRoles<
    MarketplaceEntrypoint,
    typeof MarketplaceV3.contractRoles[number]
  >;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<MarketplaceEntrypoint>;
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
  public directListings: MarketplaceV3DirectListings;
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
  public englishAuctions: MarketplaceV3EnglishAuctions;

  public offers: MarketplaceV3Offers;

  private _chainId;
  get chainId() {
    return this._chainId;
  }

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: typeof ABI,
    chainId: number,
    contractWrapper = new ContractWrapper<MarketplaceEntrypoint>(
      network,
      address,
      abi,
      options,
    ),
  ) {
    this._chainId = chainId;
    this.abi = abi;
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      MarketplaceContractSchema,
      this.storage,
    );
    this.roles = new ContractRoles(
      this.contractWrapper,
      MarketplaceV3.contractRoles,
    );
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.directListings = new MarketplaceV3DirectListings(
      new ContractWrapper<DirectListings>(
        network,
        address,
        DirectListingsABI,
        options,
      ),
      this.contractWrapper,
      this.storage,
    );
    this.englishAuctions = new MarketplaceV3EnglishAuctions(
      new ContractWrapper<EnglishAuctions>(
        network,
        address,
        EnglishAuctionsABI,
        options,
      ),
      this.contractWrapper,
      this.storage,
    );
    this.offers = new MarketplaceV3Offers(
      new ContractWrapper<Offers>(network, address, OffersABI, options),
      this.contractWrapper,
      this.storage,
    );
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
      listingEvents.map(async (e): Promise<Offer> => {
        return await mapOffer(
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
  public async makeOffer(
    listingId: BigNumberish,
    pricePerToken: Price,
    quantity?: BigNumberish,
  ): Promise<TransactionResult> {
    const listing = await this.contractWrapper.readContract.listings(listingId);
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
        return await this.direct.makeOffer(
          listingId,
          quantity,
          isNativeToken(listing.currency)
            ? NATIVE_TOKENS[chainId as SUPPORTED_CHAIN_ID].wrapped.address
            : listing.currency,
          pricePerToken,
        );
      }
      case ListingType.Auction: {
        return await this.auction.makeBid(listingId, pricePerToken);
      }
      default:
        throw Error(`Unknown listing type: ${listing.listingType}`);
    }
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

  /**
   * @internal
   */
  public async call(
    functionName: string,
    ...args: unknown[] | [...unknown[], CallOverrides]
  ): Promise<any> {
    return this.contractWrapper.call(functionName, ...args);
  }
}
