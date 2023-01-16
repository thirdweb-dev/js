import { ContractEncoder } from "../../core/classes/contract-encoder";
import { ContractEvents } from "../../core/classes/contract-events";
import { ContractInterceptor } from "../../core/classes/contract-interceptor";
import { ContractMetadata } from "../../core/classes/contract-metadata";
import { ContractPlatformFee } from "../../core/classes/contract-platform-fee";
import { ContractRoles } from "../../core/classes/contract-roles";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import { MarketplaceV3DirectListings } from "../../core/classes/marketplacev3-direct-listings";
import { MarketplaceV3EnglishAuctions } from "../../core/classes/marketplacev3-english-auction";
import { MarketplaceV3Offers } from "../../core/classes/marketplacev3-offers";
import { UpdateableNetwork } from "../../core/interfaces/contract";
import { NetworkOrSignerOrProvider } from "../../core/types";
import { Abi } from "../../schema/contracts/custom";
import { MarketplaceContractSchema } from "../../schema/contracts/marketplace";
import { SDKOptions } from "../../schema/sdk-options";
import type {
  MarketplaceRouter,
  DirectListingsLogic,
  EnglishAuctionsLogic,
  OffersLogic,
} from "@thirdweb-dev/contracts-js";
import type ABI from "@thirdweb-dev/contracts-js/dist/abis/MarketplaceRouter.json";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { CallOverrides } from "ethers";

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
   * ```javascript
   * // Data of the listing you want to create
   * const listing = {
   *   // address of the contract the asset you want to list is on
   *   assetContractAddress: "0x...",
   *   // token ID of the asset you want to list
   *   tokenId: "0",
   *   // how many of the asset you want to list
   *   quantity: 1,
   *   // address of the currency contract that will be used to pay for the listing
   *   currencyContractAddress: NATIVE_TOKEN_ADDRESS,
   *   // The price to pay per unit of NFTs listed.
   *   pricePerToken: 1.5,
   *   // when should the listing open up for offers
   *   startTimestamp: new Date(Date.now()),
   *   // how long the listing will be open for
   *   endTimestamp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
   *   // Whether the listing is reserved for a specific set of buyers.
   *   isReservedListing: false
   * }
   *
   * const tx = await contract.directListings.createListing(listing);
   * const receipt = tx.receipt; // the transaction receipt
   * const id = tx.id; // the id of the newly created listing
   *
   * // And on the buyers side:
   * // The ID of the listing you want to buy from
   * const listingId = 0;
   * // Quantity of the asset you want to buy
   * const quantityDesired = 1;
   *
   * await contract.directListings.buyFromListing(listingId, quantityDesired);
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
   *   timeBufferInSeconds: "1000",
   *   // A bid must be at least this much bps greater than the current winning bid
   *   bidBufferBps: "100", // 100 bps stands for 1%
   *   // when should the auction open up for bidding
   *   startTimestamp: new Date(Date.now()),
   *   // end time of auction
   *   endTimestamp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
   * }
   *
   * const tx = await contract.englishAuctions.createAuction(auction);
   * const receipt = tx.receipt; // the transaction receipt
   * const id = tx.id; // the id of the newly created auction
   *
   * // And on the buyers side:
   * // The auction ID of the asset you want to bid on
   * const auctionId = 0;
   * // The total amount you are willing to bid for auctioned tokens
   * const bidAmount = 1;
   *
   * await contract.englishAuctions.makeBid(auctionId, bidAmount);
   * ```
   */
  public englishAuctions: MarketplaceV3EnglishAuctions;

  /**
   * Offers
   * @remarks Make and manage offers.
   * @example
   * ```javascript
   * // Data of the offer you want to make
   * const offer = {
   *   // address of the contract the asset you want to make an offer for
   *   assetContractAddress: "0x...",
   *   // token ID of the asset you want to buy
   *   tokenId: "0",
   *   // how many of the asset you want to buy
   *   quantity: 1,
   *   // address of the currency contract that you offer to pay in
   *   currencyContractAddress: NATIVE_TOKEN_ADDRESS,
   *   // Total price you offer to pay for the mentioned token(s)
   *   totalPrice: "1.5",
   *   // Offer valid until
   *   endTimestamp: new Date(),
   * }
   *
   * const tx = await contract.offers.makeOffer(offer);
   * const receipt = tx.receipt; // the transaction receipt
   * const id = tx.id; // the id of the newly created offer
   *
   * // And on the seller's side:
   * // The ID of the offer you want to accept
   * const offerId = 0;
   * await contract.offers.acceptOffer(offerId);
   * ```
   */
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
