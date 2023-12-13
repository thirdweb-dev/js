import type {
  DirectListingsLogic,
  EnglishAuctionsLogic,
  MarketplaceV3 as MarketplaceV3Contract,
  OffersLogic,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { CallOverrides } from "ethers";
import { assertEnabled } from "../../common/feature-detection/assertEnabled";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";
import {
  FEATURE_DIRECT_LISTINGS,
  FEATURE_ENGLISH_AUCTIONS,
  FEATURE_OFFERS,
} from "../../constants/thirdweb-features";
import { ContractAppURI } from "../../core/classes/contract-appuri";
import { ContractEncoder } from "../../core/classes/contract-encoder";
import { ContractEvents } from "../../core/classes/contract-events";
import { ContractInterceptor } from "../../core/classes/contract-interceptor";
import { ContractMetadata } from "../../core/classes/contract-metadata";
import { ContractPlatformFee } from "../../core/classes/contract-platform-fee";
import { ContractRoles } from "../../core/classes/contract-roles";
import { ContractWrapper } from "../../core/classes/internal/contract-wrapper";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import { MarketplaceV3DirectListings } from "../../core/classes/marketplacev3-direct-listings";
import { MarketplaceV3EnglishAuctions } from "../../core/classes/marketplacev3-english-auction";
import { MarketplaceV3Offers } from "../../core/classes/marketplacev3-offers";
import { Transaction } from "../../core/classes/transactions";
import { UpdateableNetwork } from "../../core/interfaces/contract";
import { NetworkInput } from "../../core/types";
import { Abi, AbiInput, AbiSchema } from "../../schema/contracts/custom";
import { MarketplaceContractSchema } from "../../schema/contracts/marketplace";
import { SDKOptions } from "../../schema/sdk-options";
import { Address } from "../../schema/shared/Address";
import { MARKETPLACE_CONTRACT_ROLES } from "../contractRoles";

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
export class MarketplaceV3 implements UpdateableNetwork {
  static contractRoles = MARKETPLACE_CONTRACT_ROLES;

  public abi: Abi;
  private contractWrapper: ContractWrapper<MarketplaceV3Contract>;
  private storage: ThirdwebStorage;

  public encoder: ContractEncoder<MarketplaceV3Contract>;
  public events: ContractEvents<MarketplaceV3Contract>;
  public estimator: GasCostEstimator<MarketplaceV3Contract>;
  public platformFees: ContractPlatformFee;
  public metadata: ContractMetadata<
    MarketplaceV3Contract,
    typeof MarketplaceContractSchema
  >;

  public app: ContractAppURI<MarketplaceV3Contract>;
  public roles: ContractRoles<
    MarketplaceV3Contract,
    (typeof MarketplaceV3.contractRoles)[number]
  >;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<MarketplaceV3Contract>;
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
  get directListings(): MarketplaceV3DirectListings<DirectListingsLogic> {
    return assertEnabled(this.detectDirectListings(), FEATURE_DIRECT_LISTINGS);
  }
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
  get englishAuctions(): MarketplaceV3EnglishAuctions<EnglishAuctionsLogic> {
    return assertEnabled(
      this.detectEnglishAuctions(),
      FEATURE_ENGLISH_AUCTIONS,
    );
  }

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
  get offers(): MarketplaceV3Offers<OffersLogic> {
    return assertEnabled(this.detectOffers(), FEATURE_OFFERS);
  }

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
    contractWrapper = new ContractWrapper<MarketplaceV3Contract>(
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
      MarketplaceV3.contractRoles,
    );
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.events = new ContractEvents(this.contractWrapper);
    this.platformFees = new ContractPlatformFee(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
  }

  onNetworkUpdated(network: NetworkInput) {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  getAddress(): Address {
    return this.contractWrapper.address;
  }

  /**
   * @internal
   */
  public async prepare<
    TMethod extends
      keyof MarketplaceV3Contract["functions"] = keyof MarketplaceV3Contract["functions"],
  >(
    method: string & TMethod,
    args: any[] & Parameters<MarketplaceV3Contract["functions"][TMethod]>,
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
      keyof MarketplaceV3Contract["functions"] = keyof MarketplaceV3Contract["functions"],
  >(
    functionName: string & TMethod,
    args?: Parameters<MarketplaceV3Contract["functions"][TMethod]>,
    overrides?: CallOverrides,
  ): Promise<ReturnType<MarketplaceV3Contract["functions"][TMethod]>> {
    return this.contractWrapper.call(functionName, args, overrides);
  }

  /** ********************
   * FEATURE DETECTION
   * ********************/

  private detectDirectListings() {
    if (
      detectContractFeature<DirectListingsLogic>(
        this.contractWrapper,
        "DirectListings",
      )
    ) {
      return new MarketplaceV3DirectListings(
        this.contractWrapper,
        this.storage,
      );
    }
    return undefined;
  }

  private detectEnglishAuctions() {
    if (
      detectContractFeature<EnglishAuctionsLogic>(
        this.contractWrapper,
        "EnglishAuctions",
      )
    ) {
      return new MarketplaceV3EnglishAuctions(
        this.contractWrapper,
        this.storage,
      );
    }
    return undefined;
  }

  private detectOffers() {
    if (detectContractFeature<OffersLogic>(this.contractWrapper, "Offers")) {
      return new MarketplaceV3Offers(this.contractWrapper, this.storage);
    }
    return undefined;
  }
}
