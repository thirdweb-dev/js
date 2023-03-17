import { ALL_ROLES, assertEnabled, detectContractFeature } from "../common";
import { FEATURE_TOKEN } from "../constants/erc20-features";
import { FEATURE_NFT } from "../constants/erc721-features";
import { FEATURE_EDITION } from "../constants/erc1155-features";
import {
  FEATURE_APPURI,
  FEATURE_DIRECT_LISTINGS,
  FEATURE_ENGLISH_AUCTIONS,
  FEATURE_OFFERS,
  FEATURE_OWNER,
  FEATURE_PERMISSIONS,
  FEATURE_PLATFORM_FEE,
  FEATURE_PRIMARY_SALE,
  FEATURE_ROYALTY,
} from "../constants/thirdweb-features";
import {
  ContractEncoder,
  ContractOwner,
  MarketplaceV3DirectListings,
  MarketplaceV3EnglishAuctions,
  MarketplaceV3Offers,
  NetworkInput,
  Transaction,
} from "../core";
import { ContractAppURI } from "../core/classes/contract-appuri";
import { ContractEvents } from "../core/classes/contract-events";
import { ContractInterceptor } from "../core/classes/contract-interceptor";
import { ContractMetadata } from "../core/classes/contract-metadata";
import { ContractPlatformFee } from "../core/classes/contract-platform-fee";
import { ContractPublishedMetadata } from "../core/classes/contract-published-metadata";
import { ContractRoles } from "../core/classes/contract-roles";
import { ContractRoyalty } from "../core/classes/contract-royalty";
import { ContractPrimarySale } from "../core/classes/contract-sales";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { Erc20 } from "../core/classes/erc-20";
import { Erc721 } from "../core/classes/erc-721";
import { Erc1155 } from "../core/classes/erc-1155";
import { GasCostEstimator } from "../core/classes/gas-cost-estimator";
import { UpdateableNetwork } from "../core/interfaces/contract";
import { Address } from "../schema";
import { CustomContractSchema } from "../schema/contracts/custom";
import { SDKOptions } from "../schema/sdk-options";
import { BaseERC1155, BaseERC20, BaseERC721 } from "../types/eips";
import type {
  IPermissions,
  IPlatformFee,
  IPrimarySale,
  IRoyalty,
  Ownable,
  IAppURI,
  IContractMetadata,
  DirectListingsLogic,
  EnglishAuctionsLogic,
  OffersLogic,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BaseContract, CallOverrides, ContractInterface } from "ethers";

/**
 * Custom contract dynamic class with feature detection
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK(provider);
 * const contract = await sdk.getContract("{{contract_address}}");
 *
 * // call any function in your contract
 * await contract.call("myCustomFunction", param1, param2);
 *
 * // if your contract follows the ERC721 standard, contract.nft will be present
 * const allNFTs = await contract.erc721.query.all()
 *
 * // if your contract extends IMintableERC721, contract.nft.mint() will be available
 * const tx = await contract.erc721.mint({
 *     name: "Cool NFT",
 *     image: readFileSync("some_image.png"),
 *   });
 * ```
 *
 * @beta
 */
export class SmartContract<TContract extends BaseContract = BaseContract>
  implements UpdateableNetwork
{
  private contractWrapper;
  private storage;

  // utilities
  public events: ContractEvents<TContract>;
  public interceptor: ContractInterceptor<TContract>;
  public encoder: ContractEncoder<TContract>;
  public estimator: GasCostEstimator<TContract>;
  public publishedMetadata: ContractPublishedMetadata<TContract>;
  public abi: ContractInterface;
  public metadata: ContractMetadata<BaseContract, any>;

  /**
   * Handle royalties
   */
  get royalties(): ContractRoyalty<IRoyalty, any> {
    return assertEnabled(this.detectRoyalties(), FEATURE_ROYALTY);
  }

  /**
   * Handle permissions
   */
  get roles(): ContractRoles<IPermissions, any> {
    return assertEnabled(this.detectRoles(), FEATURE_PERMISSIONS);
  }

  /**
   * Handle primary sales
   */
  get sales(): ContractPrimarySale<IPrimarySale> {
    return assertEnabled(this.detectPrimarySales(), FEATURE_PRIMARY_SALE);
  }

  /**
   * Handle platform fees
   */
  get platformFees(): ContractPlatformFee<IPlatformFee> {
    return assertEnabled(this.detectPlatformFees(), FEATURE_PLATFORM_FEE);
  }

  /**
   * Set and get the owner of the contract
   */
  get owner(): ContractOwner<Ownable> {
    return assertEnabled(this.detectOwnable(), FEATURE_OWNER);
  }

  /**
   * Auto-detects ERC20 standard functions.
   */
  get erc20(): Erc20 {
    return assertEnabled(this.detectErc20(), FEATURE_TOKEN);
  }

  /**
   * Auto-detects ERC721 standard functions.
   */
  get erc721(): Erc721 {
    return assertEnabled(this.detectErc721(), FEATURE_NFT);
  }

  /**
   * Auto-detects ERC1155 standard functions.
   */
  get erc1155(): Erc1155 {
    return assertEnabled(this.detectErc1155(), FEATURE_EDITION);
  }

  /**
   * Auto-detects AppURI standard functions.
   */
  get app(): ContractAppURI<IAppURI | IContractMetadata> {
    return assertEnabled(this.detectApp(), FEATURE_APPURI);
  }

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

  private _chainId: number;
  get chainId() {
    return this._chainId;
  }

  constructor(
    network: NetworkInput,
    address: string,
    abi: ContractInterface,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    chainId: number,
    contractWrapper = new ContractWrapper<TContract>(
      network,
      address,
      abi,
      options,
    ),
  ) {
    this._chainId = chainId;
    this.storage = storage;
    this.contractWrapper = contractWrapper;
    this.abi = abi;

    this.events = new ContractEvents(this.contractWrapper);
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.publishedMetadata = new ContractPublishedMetadata(
      this.contractWrapper,
      this.storage,
    );

    this.metadata = new ContractMetadata(
      this.contractWrapper,
      CustomContractSchema,
      this.storage,
    );
  }

  onNetworkUpdated(network: NetworkInput): void {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  getAddress(): Address {
    return this.contractWrapper.readContract.address;
  }

  /**
   * Prepare a transaction for sending
   */
  public prepare<
    TMethod extends keyof TContract["functions"] = keyof TContract["functions"],
  >(
    method: string & TMethod,
    args: any[] & Parameters<TContract["functions"][TMethod]>,
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
   * Call any function on this contract
   * @example
   * ```javascript
   * // read functions will return the data from the contract
   * const myValue = await contract.call("myReadFunction");
   * console.log(myValue);
   *
   * // write functions will return the transaction receipt
   * const tx = await contract.call("myWriteFunction", arg1, arg2);
   * const receipt = tx.receipt;
   *
   * // Optionally override transaction options
   * await contract.call("myWriteFunction", arg1, arg2, {
   *  gasLimit: 1000000, // override default gas limit
   *  value: ethers.utils.parseEther("0.1"), // send 0.1 ether with the contract call
   * };
   * ```
   * @param functionName - the name of the function to call
   * @param args - the arguments of the function
   */
  public async call(
    functionName: string,
    ...args: unknown[] | [...unknown[], CallOverrides]
  ): Promise<any> {
    return this.contractWrapper.call(functionName, ...args);
  }

  /** ********************
   * FEATURE DETECTION
   * ********************/

  private detectRoyalties() {
    if (detectContractFeature<IRoyalty>(this.contractWrapper, "Royalty")) {
      // ContractMetadata is stateless, it's fine to create a new one here
      // This also makes it not order dependent in the feature detection process
      const metadata = new ContractMetadata(
        this.contractWrapper,
        CustomContractSchema,
        this.storage,
      );
      return new ContractRoyalty(this.contractWrapper, metadata);
    }
    return undefined;
  }

  private detectRoles() {
    if (
      detectContractFeature<IPermissions>(this.contractWrapper, "Permissions")
    ) {
      return new ContractRoles(this.contractWrapper, ALL_ROLES);
    }
    return undefined;
  }

  private detectPrimarySales() {
    if (
      detectContractFeature<IPrimarySale>(this.contractWrapper, "PrimarySale")
    ) {
      return new ContractPrimarySale(this.contractWrapper);
    }
    return undefined;
  }

  private detectPlatformFees() {
    if (
      detectContractFeature<IPlatformFee>(this.contractWrapper, "PlatformFee")
    ) {
      return new ContractPlatformFee(this.contractWrapper);
    }
    return undefined;
  }

  private detectErc20() {
    if (detectContractFeature<BaseERC20>(this.contractWrapper, "ERC20")) {
      return new Erc20(this.contractWrapper, this.storage, this.chainId);
    }
    return undefined;
  }

  private detectErc721() {
    if (detectContractFeature<BaseERC721>(this.contractWrapper, "ERC721")) {
      return new Erc721(this.contractWrapper, this.storage, this.chainId);
    }
    return undefined;
  }

  private detectErc1155() {
    if (detectContractFeature<BaseERC1155>(this.contractWrapper, "ERC1155")) {
      return new Erc1155(this.contractWrapper, this.storage, this.chainId);
    }
    return undefined;
  }

  private detectOwnable() {
    if (detectContractFeature<Ownable>(this.contractWrapper, "Ownable")) {
      return new ContractOwner(this.contractWrapper);
    }
    return undefined;
  }

  private detectApp() {
    const metadata = new ContractMetadata(
      this.contractWrapper,
      CustomContractSchema,
      this.storage,
    );

    if (detectContractFeature<IAppURI>(this.contractWrapper, "AppURI")) {
      return new ContractAppURI(this.contractWrapper, metadata, this.storage);
    } else if (
      detectContractFeature<IContractMetadata>(
        this.contractWrapper,
        "ContractMetadata",
      )
    ) {
      return new ContractAppURI(this.contractWrapper, metadata, this.storage);
    }
    return undefined;
  }

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
