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
import { Abi } from "../../schema/contracts/custom";
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
  MarketplaceRouter,
  DirectListingsLogic,
  EnglishAuctionsLogic,
  OffersLogic,
} from "@thirdweb-dev/contracts-js";
import DirectListingsABI from "@thirdweb-dev/contracts-js/dist/abis/DirectListingsLogic.json";
import EnglishAuctionsABI from "@thirdweb-dev/contracts-js/dist/abis/EnglishAuctionsLogic.json";
import type ABI from "@thirdweb-dev/contracts-js/dist/abis/MarketplaceRouter.json";
import OffersABI from "@thirdweb-dev/contracts-js/dist/abis/OffersLogic.json";
// ===
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

  public abi: Abi;
  private contractWrapper: ContractWrapper<MarketplaceRouter>;
  private storage: ThirdwebStorage;

  public encoder: ContractEncoder<MarketplaceRouter>;
  public events: ContractEvents<MarketplaceRouter>;
  public estimator: GasCostEstimator<MarketplaceRouter>;
  public platformFees: ContractPlatformFee<MarketplaceRouter>;
  public metadata: ContractMetadata<
    MarketplaceRouter,
    typeof MarketplaceContractSchema
  >;
  public roles: ContractRoles<
    MarketplaceRouter,
    typeof MarketplaceV3.contractRoles[number]
  >;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<MarketplaceRouter>;
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
    abi: Abi,
    chainId: number,
    contractWrapper = new ContractWrapper<MarketplaceRouter>(
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
      this.contractWrapper as unknown as ContractWrapper<DirectListingsLogic>,
      this.storage,
    );
    this.englishAuctions = new MarketplaceV3EnglishAuctions(
      this.contractWrapper as unknown as ContractWrapper<EnglishAuctionsLogic>,
      this.storage,
    );
    this.offers = new MarketplaceV3Offers(
      this.contractWrapper as unknown as ContractWrapper<OffersLogic>,
      this.storage,
    );
    this.events = new ContractEvents(this.contractWrapper);
    this.platformFees = new ContractPlatformFee(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
  }

  onNetworkUpdated(network: NetworkOrSignerOrProvider) {
    this.contractWrapper.updateSignerOrProvider(network);

    this.directListings.onNetworkUpdated(network);
    this.englishAuctions.onNetworkUpdated(network);
    this.offers.onNetworkUpdated(network);
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
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
