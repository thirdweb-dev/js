import type {
  DirectListingsLogic,
  IDirectListings,
  IERC1155,
  IERC165,
  IERC721,
  MarketplaceV3,
} from "@thirdweb-dev/contracts-js";
import {
  NewListingEvent,
  UpdatedListingEvent,
} from "@thirdweb-dev/contracts-js/dist/declarations/src/DirectListingsLogic";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, Contract } from "ethers";
import invariant from "tiny-invariant";
import { cleanCurrencyAddress } from "../../../../common/currency/cleanCurrencyAddress";
import { fetchCurrencyValue } from "../../../../common/currency/fetchCurrencyValue";
import { normalizePriceValue } from "../../../../common/currency/normalizePriceValue";
import { setErc20Allowance } from "../../../../common/currency/setErc20Allowance";
import { resolveAddress } from "../../../../common/ens/resolveAddress";
import {
  getAllInBatches,
  handleTokenApproval,
  isTokenApprovedForTransfer,
} from "../../../../common/marketplace";
import { fetchTokenMetadataForContract } from "../../../../common/nft";
import { buildTransactionFunction } from "../../../../common/transactions";
import {
  InterfaceId_IERC1155,
  InterfaceId_IERC721,
} from "../../../../constants/contract";
import { FEATURE_DIRECT_LISTINGS } from "../../../../constants/thirdweb-features";
import {
  DirectListingInputParams,
  DirectListingInputParamsSchema,
} from "../../../../schema/marketplacev3/direct-listings";
import { AddressOrEns } from "../../../../schema/shared/AddressOrEnsSchema";
import type { MarketplaceFilterWithoutOfferor } from "../../../../types/marketplace/MarketPlaceFilter";
import type { DirectListingV3 } from "../../../../types/marketplacev3/DirectListingV3";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../../../types";
import { ContractEncoder } from "../../contract-encoder";
import { ContractEvents } from "../../contract-events";
import { ContractInterceptor } from "../../contract-interceptor";
import { ContractWrapper } from "../contract-wrapper";
import { GasCostEstimator } from "../../gas-cost-estimator";
import { Transaction } from "../../transactions";
import { Status } from "../../../../enums/marketplace/Status";

/**
 * Handles direct listings
 * @public
 */
export class MarketplaceV3DirectListings<TContract extends DirectListingsLogic>
  implements DetectableFeature
{
  featureName = FEATURE_DIRECT_LISTINGS.name;
  private contractWrapper: ContractWrapper<DirectListingsLogic>;
  private storage: ThirdwebStorage;

  // utilities
  public events: ContractEvents<DirectListingsLogic>;
  public interceptor: ContractInterceptor<DirectListingsLogic>;
  public encoder: ContractEncoder<DirectListingsLogic>;
  public estimator: GasCostEstimator<DirectListingsLogic>;

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
   * Get the total number of direct listings
   *
   * @returns Returns the total number of direct listings created.
   * @public
   *
   * @example
   * ```javascript
   * const totalListings = await contract.directListings.getTotalCount();
   * ```
   * @twfeature DirectListings
   */
  public async getTotalCount(): Promise<BigNumber> {
    return await this.contractWrapper.read("totalListings", []);
  }

  /**
   * Get all direct listings
   *
   * @example
   * ```javascript
   * const listings = await contract.directListings.getAll();
   * ```
   *
   * @param filter - optional filter parameters
   * @returns the Direct listing object array
   * @twfeature DirectListings
   */
  public async getAll(
    filter?: MarketplaceFilterWithoutOfferor,
  ): Promise<DirectListingV3[]> {
    const totalListings = await this.getTotalCount();

    const start = BigNumber.from(filter?.start || 0).toNumber();
    const end = totalListings.toNumber();

    if (end === 0) {
      throw new Error(`No listings exist on the contract.`);
    }

    let rawListings: IDirectListings.ListingStructOutput[] = [];
    const batches = await getAllInBatches(start, end, (startId, endId) =>
      this.contractWrapper.read("getAllListings", [startId, endId]),
    );
    rawListings = batches.flat();

    const filteredListings = await this.applyFilter(rawListings, filter);

    return await Promise.all(
      filteredListings.map((listing) => this.mapListing(listing)),
    );
  }

  /**
   * Get all valid direct listings
   *
   * @remarks A valid listing is where the listing is active, and the creator still owns & has approved Marketplace to transfer the listed NFTs.
   *
   * @example
   * ```javascript
   * const listings = await contract.directListings.getAllValid();
   * ```
   *
   * @param filter - optional filter parameters
   * @returns the Direct listing object array
   * @twfeature DirectListings
   */
  public async getAllValid(
    filter?: MarketplaceFilterWithoutOfferor,
  ): Promise<DirectListingV3[]> {
    const totalListings = await this.getTotalCount();

    const start = BigNumber.from(filter?.start || 0).toNumber();
    const end = totalListings.toNumber();

    if (end === 0) {
      throw new Error(`No listings exist on the contract.`);
    }

    let rawListings: IDirectListings.ListingStructOutput[] = [];
    const batches = await getAllInBatches(start, end, (startId, endId) =>
      this.contractWrapper.read("getAllValidListings", [startId, endId]),
    );
    rawListings = batches.flat();

    const filteredListings = await this.applyFilter(rawListings, filter);

    return await Promise.all(
      filteredListings.map((listing) => this.mapListing(listing)),
    );
  }

  /**
   * Get a single direct listing
   *
   * @example
   * ```javascript
   * const listingId = 0;
   * const listing = await contract.directListings.getListing(listingId);
   * ```
   *
   * @param listingId - the listing id
   * @returns the Direct listing object
   *
   * @example
   * ```javascript
   * const listingId = 0;
   * const listing = await contract.directListings.getListing(listingId);
   * ```
   * @twfeature DirectListings
   */
  public async getListing(listingId: BigNumberish): Promise<DirectListingV3> {
    const listing = await this.contractWrapper.read("getListing", [listingId]);

    return await this.mapListing(listing);
  }

  /**
   * Check if a buyer is approved for a specific direct listing
   *
   * @example
   * ```javascript
   * const listingId = 0;
   * const isBuyerApproved = await contract.directListings.isBuyerApprovedForListing(listingId, "{{wallet_address}}");
   * ```
   *
   * @param listingId - the listing id
   * @param buyer - buyer address
   * @twfeature DirectListings
   */
  public async isBuyerApprovedForListing(
    listingId: BigNumberish,
    buyer: AddressOrEns,
  ): Promise<boolean> {
    const listing = await this.validateListing(BigNumber.from(listingId));

    if (!listing.isReservedListing) {
      throw new Error(`Listing ${listingId} is not a reserved listing.`);
    }

    return await this.contractWrapper.read("isBuyerApprovedForListing", [
      listingId,
      await resolveAddress(buyer),
    ]);
  }

  /**
   * Check if a currency is approved for a specific direct listing
   *
   * @example
   * ```javascript
   * const listingId = 0;
   * const currencyContractAddress = '0x1234';
   * const isApproved = await contract.directListings.isCurrencyApprovedForListing(listingId, currencyContractAddress);
   * ```
   *
   * @param listingId - the listing id
   * @param currency - currency address
   * @twfeature DirectListings
   */
  public async isCurrencyApprovedForListing(
    listingId: BigNumberish,
    currency: AddressOrEns,
  ): Promise<boolean> {
    await this.validateListing(BigNumber.from(listingId));

    return await this.contractWrapper.read("isCurrencyApprovedForListing", [
      listingId,
      await resolveAddress(currency),
    ]);
  }

  /**
   * Check price per token for an approved currency
   *
   * @example
   * ```javascript
   * const listingId = 0;
   * const currencyContractAddress = '0x1234';
   * const price = await contract.directListings.currencyPriceForListing(listingId, currencyContractAddress);
   * ```
   *
   * @param listingId - the listing id
   * @param currencyContractAddress - currency contract address
   * @twfeature DirectListings
   */
  public async currencyPriceForListing(
    listingId: BigNumberish,
    currencyContractAddress: AddressOrEns,
  ): Promise<BigNumberish> {
    const listing = await this.validateListing(BigNumber.from(listingId));

    const resolvedCurrencyAddress = await resolveAddress(
      currencyContractAddress,
    );
    if (resolvedCurrencyAddress === listing.currencyContractAddress) {
      return listing.pricePerToken;
    }

    const isApprovedCurrency = await this.isCurrencyApprovedForListing(
      listingId,
      resolvedCurrencyAddress,
    );

    if (!isApprovedCurrency) {
      throw new Error(
        `Currency ${resolvedCurrencyAddress} is not approved for Listing ${listingId}.`,
      );
    }

    return await this.contractWrapper.read("currencyPriceForListing", [
      listingId,
      resolvedCurrencyAddress,
    ]);
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Create new direct listing
   *
   * @remarks Create a new listing on the marketplace where people can buy an asset directly.
   *
   * @example
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
   * ```
   * @twfeature DirectListings
   */
  createListing = /* @__PURE__ */ buildTransactionFunction(
    async (
      listing: DirectListingInputParams,
    ): Promise<Transaction<TransactionResultWithId>> => {
      const parsedListing = await DirectListingInputParamsSchema.parseAsync(
        listing,
      );

      await handleTokenApproval(
        this.contractWrapper,
        this.getAddress(),
        parsedListing.assetContractAddress,
        parsedListing.tokenId,
        await this.contractWrapper.getSignerAddress(),
      );

      const normalizedPricePerToken = await normalizePriceValue(
        this.contractWrapper.getProvider(),
        parsedListing.pricePerToken,
        parsedListing.currencyContractAddress,
      );

      const block = await this.contractWrapper.getProvider().getBlock("latest");
      const blockTime = block.timestamp;
      if (parsedListing.startTimestamp.lt(blockTime)) {
        parsedListing.startTimestamp = BigNumber.from(blockTime);
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "createListing",
        args: [
          {
            assetContract: parsedListing.assetContractAddress,
            tokenId: parsedListing.tokenId,
            quantity: parsedListing.quantity,
            currency: cleanCurrencyAddress(
              parsedListing.currencyContractAddress,
            ),
            pricePerToken: normalizedPricePerToken,
            startTimestamp: parsedListing.startTimestamp,
            endTimestamp: parsedListing.endTimestamp,
            reserved: parsedListing.isReservedListing,
          } as IDirectListings.ListingParametersStruct,
        ],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<NewListingEvent>(
            "NewListing",
            receipt?.logs,
          );
          return {
            id: event[0].args.listingId,
            receipt,
          };
        },
      });
    },
  );

  /**
   * Create a batch of new listings
   *
   * @remarks Create a batch of new listings on the marketplace
   *
   * @example
   * ```javascript
   * const listings = [...];
   * const tx = await contract.directListings.createListingsBatch(listings);
   * ```
   */
  createListingsBatch = /* @__PURE__ */ buildTransactionFunction(
    async (
      listings: DirectListingInputParams[],
    ): Promise<Transaction<TransactionResultWithId[]>> => {
      const data = (
        await Promise.all(
          listings.map((listing) => this.createListing.prepare(listing)),
        )
      ).map((tx) => tx.encode());

      return Transaction.fromContractWrapper({
        contractWrapper: this
          .contractWrapper as unknown as ContractWrapper<MarketplaceV3>,
        method: "multicall",
        args: [data],
        parse: (receipt) => {
          const events = this.contractWrapper.parseLogs<NewListingEvent>(
            "NewListing",
            receipt?.logs,
          );
          return events.map((event) => {
            return {
              id: event.args.listingId,
              receipt,
            };
          });
        },
      });
    },
  );

  /**
   * Update a direct listing
   *
   * @param listing - the new listing information
   *
   * @example
   * ```javascript
   * // Data of the listing you want to update
   *
   * const listingId = 0; // ID of the listing you want to update
   *
   * const listing = {
   *   // address of the contract the asset you want to list is on
   *   assetContractAddress: "0x...", // should be same as original listing
   *   // token ID of the asset you want to list
   *   tokenId: "0", // should be same as original listing
   *   // how many of the asset you want to list
   *   quantity: 1,
   *   // address of the currency contract that will be used to pay for the listing
   *   currencyContractAddress: NATIVE_TOKEN_ADDRESS,
   *   // The price to pay per unit of NFTs listed.
   *   pricePerToken: 1.5,
   *   // when should the listing open up for offers
   *   startTimestamp: new Date(Date.now()), // can't change this if listing already active
   *   // how long the listing will be open for
   *   endTimestamp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
   *   // Whether the listing is reserved for a specific set of buyers.
   *   isReservedListing: false
   * }
   *
   * const tx = await contract.directListings.updateListing(listingId, listing);
   * const receipt = tx.receipt; // the transaction receipt
   * const id = tx.id; // the id of the newly created listing
   * ```
   * @twfeature DirectListings
   */
  updateListing = /* @__PURE__ */ buildTransactionFunction(
    async (
      listingId: BigNumberish,
      listing: DirectListingInputParams,
    ): Promise<Transaction<TransactionResultWithId>> => {
      const parsedListing = await DirectListingInputParamsSchema.parseAsync(
        listing,
      );

      await handleTokenApproval(
        this.contractWrapper,
        this.getAddress(),
        parsedListing.assetContractAddress,
        parsedListing.tokenId,
        await this.contractWrapper.getSignerAddress(),
      );

      const normalizedPricePerToken = await normalizePriceValue(
        this.contractWrapper.getProvider(),
        parsedListing.pricePerToken,
        parsedListing.currencyContractAddress,
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "updateListing",
        args: [
          listingId,
          {
            assetContract: parsedListing.assetContractAddress,
            tokenId: parsedListing.tokenId,
            quantity: parsedListing.quantity,
            currency: cleanCurrencyAddress(
              parsedListing.currencyContractAddress,
            ),
            pricePerToken: normalizedPricePerToken,
            startTimestamp: parsedListing.startTimestamp,
            endTimestamp: parsedListing.endTimestamp,
            reserved: parsedListing.isReservedListing,
          } as IDirectListings.ListingParametersStruct,
        ],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<UpdatedListingEvent>(
            "UpdatedListing",
            receipt?.logs,
          );
          return {
            id: event[0].args.listingId,
            receipt,
          };
        },
      });
    },
  );

  /**
   * Cancel Direct Listing
   *
   * @remarks Cancel a direct listing on the marketplace
   *
   * @example
   * ```javascript
   * // The listing ID of the direct listing you want to cancel
   * const listingId = 0;
   *
   * await contract.directListings.cancelListing(listingId);
   * ```
   * @twfeature DirectListings
   */
  cancelListing = /* @__PURE__ */ buildTransactionFunction(
    async (listingId: BigNumberish) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "cancelListing",
        args: [listingId],
      });
    },
  );

  /**
   * Buy direct listing for a specific wallet
   *
   * @remarks Buy from a specific direct listing from the marketplace.
   *
   * @example
   * ```javascript
   * // The ID of the listing you want to buy from
   * const listingId = 0;
   * // Quantity of the asset you want to buy
   * const quantityDesired = 1;
   *
   * await contract.directListings.buyFromListing(listingId, quantityDesired, "{{wallet_address}}");
   * ```
   *
   * @param listingId - The listing id to buy
   * @param quantityDesired - the quantity to buy
   * @param receiver - optional receiver of the bought listing if different from the connected wallet
   * @twfeature DirectListings
   */
  buyFromListing = /* @__PURE__ */ buildTransactionFunction(
    async (
      listingId: BigNumberish,
      quantityDesired: BigNumberish,
      receiver?: AddressOrEns,
    ) => {
      if (receiver) {
        receiver = await resolveAddress(receiver);
      }

      const listing = await this.validateListing(BigNumber.from(listingId));
      const { valid, error } = await this.isStillValidListing(
        listing,
        quantityDesired,
      );
      if (!valid) {
        throw new Error(`Listing ${listingId} is no longer valid. ${error}`);
      }
      const buyFor = receiver
        ? receiver
        : await this.contractWrapper.getSignerAddress();
      const quantity = BigNumber.from(quantityDesired);
      const value = BigNumber.from(listing.pricePerToken).mul(quantity);
      const overrides = (await this.contractWrapper.getCallOverrides()) || {};
      await setErc20Allowance(
        this.contractWrapper,
        value,
        listing.currencyContractAddress,
        overrides,
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "buyFromListing",
        args: [
          listingId,
          buyFor,
          quantity,
          listing.currencyContractAddress,
          value,
        ],
        overrides,
      });
    },
  );

  /**
   * Approve buyer for a reserved direct listing
   *
   * @remarks Approve a buyer to buy from a reserved listing.
   *
   * @example
   * ```javascript
   * // The listing ID of the direct listing you want to approve buyer for
   * const listingId = "0";
   *
   * await contract.directListings.approveBuyerForReservedListing(listingId, "{{wallet_address}}");
   * ```
   *
   * @param listingId - The listing id to buy
   * @param buyer - Address of buyer being approved
   * @twfeature DirectListings
   */
  approveBuyerForReservedListing = /* @__PURE__ */ buildTransactionFunction(
    async (listingId: BigNumberish, buyer: AddressOrEns) => {
      const isApproved = await this.isBuyerApprovedForListing(listingId, buyer);

      if (!isApproved) {
        return Transaction.fromContractWrapper({
          contractWrapper: this.contractWrapper,
          method: "approveBuyerForListing",
          args: [listingId, buyer, true],
        });
      } else {
        throw new Error(
          `Buyer ${buyer} already approved for listing ${listingId}.`,
        );
      }
    },
  );

  /**
   * Revoke approval of a buyer for a reserved direct listing
   *
   * @example
   * ```javascript
   * // The listing ID of the direct listing you want to approve buyer for
   * const listingId = "0";
   *
   * await contract.directListings.revokeBuyerApprovalForReservedListing(listingId, "{{wallet_address}}");
   * ```
   *
   * @param listingId - The listing id to buy
   * @param buyer - Address of buyer being approved
   */
  revokeBuyerApprovalForReservedListing =
    /* @__PURE__ */ buildTransactionFunction(
      async (listingId: BigNumberish, buyer: AddressOrEns) => {
        const isApproved = await this.isBuyerApprovedForListing(
          listingId,
          buyer,
        );

        if (isApproved) {
          return Transaction.fromContractWrapper({
            contractWrapper: this.contractWrapper,
            method: "approveBuyerForListing",
            args: [listingId, buyer, false],
          });
        } else {
          throw new Error(
            `Buyer ${buyer} not approved for listing ${listingId}.`,
          );
        }
      },
    );

  /**
   * Approve a currency for a direct listing
   *
   *
   * @example
   * ```javascript
   * // The listing ID of the direct listing you want to approve currency for
   * const listingId = "0";
   *
   * await contract.directListings.approveCurrencyForListing(listingId, currencyContractAddress, pricePerTokenInCurrency);
   * ```
   *
   * @param listingId - The listing id to buy
   * @param currencyContractAddress - Address of currency being approved
   * @param pricePerTokenInCurrency - Price per token in the currency
   * @twfeature DirectListings
   */
  approveCurrencyForListing = /* @__PURE__ */ buildTransactionFunction(
    async (
      listingId: BigNumberish,
      currencyContractAddress: AddressOrEns,
      pricePerTokenInCurrency: BigNumberish,
    ) => {
      const listing = await this.validateListing(BigNumber.from(listingId));

      const resolvedCurrencyAddress = await resolveAddress(
        currencyContractAddress,
      );
      if (resolvedCurrencyAddress === listing.currencyContractAddress) {
        invariant(
          pricePerTokenInCurrency === listing.pricePerToken,
          "Approving listing currency with a different price.",
        );
      }

      const currencyPrice = await this.contractWrapper.read(
        "currencyPriceForListing",
        [listingId, resolvedCurrencyAddress],
      );
      invariant(
        pricePerTokenInCurrency === currencyPrice,
        "Currency already approved with this price.",
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "approveCurrencyForListing",
        args: [listingId, resolvedCurrencyAddress, pricePerTokenInCurrency],
      });
    },
  );

  /**
   * Revoke approval of a currency for a direct listing
   *
   *
   * @example
   * ```javascript
   * // The listing ID of the direct listing you want to revoke currency for
   * const listingId = "0";
   *
   * await contract.directListings.revokeCurrencyApprovalForListing(listingId, currencyContractAddress);
   * ```
   *
   * @param listingId - The listing id to buy
   * @param currencyContractAddress - Address of currency
   * @twfeature DirectListings
   */
  revokeCurrencyApprovalForListing = /* @__PURE__ */ buildTransactionFunction(
    async (listingId: BigNumberish, currencyContractAddress: AddressOrEns) => {
      const listing = await this.validateListing(BigNumber.from(listingId));

      const resolvedCurrencyAddress = await resolveAddress(
        currencyContractAddress,
      );
      if (resolvedCurrencyAddress === listing.currencyContractAddress) {
        throw new Error(`Can't revoke approval for main listing currency.`);
      }

      const currencyPrice = await this.contractWrapper.read(
        "currencyPriceForListing",
        [listingId, resolvedCurrencyAddress],
      );
      invariant(!currencyPrice.isZero(), "Currency not approved.");

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "approveCurrencyForListing",
        args: [listingId, resolvedCurrencyAddress, BigNumber.from(0)],
      });
    },
  );

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  /**
   * Throws error if listing could not be found
   *
   * @param listingId - Listing to check for
   */
  private async validateListing(
    listingId: BigNumber,
  ): Promise<DirectListingV3> {
    try {
      return await this.getListing(listingId);
    } catch (err) {
      console.error(`Error getting the listing with id ${listingId}`);
      throw err;
    }
  }

  /**
   * Helper method maps the auction listing to the direct listing interface.
   *
   * @internal
   * @param listing - The listing to map, as returned from the contract.
   * @returns - The mapped interface.
   */
  private async mapListing(
    listing: IDirectListings.ListingStruct,
  ): Promise<DirectListingV3> {
    let status: Status = Status.UNSET;
    const block = await this.contractWrapper.getProvider().getBlock("latest");
    const blockTime = block.timestamp;
    switch (listing.status) {
      case 1:
        status = BigNumber.from(listing.startTimestamp).gt(blockTime)
          ? Status.Created
          : BigNumber.from(listing.endTimestamp).lt(blockTime)
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
      assetContractAddress: listing.assetContract,
      currencyContractAddress: listing.currency,
      pricePerToken: listing.pricePerToken.toString(),
      currencyValuePerToken: await fetchCurrencyValue(
        this.contractWrapper.getProvider(),
        listing.currency,
        listing.pricePerToken,
      ),
      id: listing.listingId.toString(),
      tokenId: listing.tokenId.toString(),
      quantity: listing.quantity.toString(),
      startTimeInSeconds: BigNumber.from(listing.startTimestamp).toNumber(),
      asset: await fetchTokenMetadataForContract(
        listing.assetContract,
        this.contractWrapper.getProvider(),
        listing.tokenId,
        this.storage,
      ),
      endTimeInSeconds: BigNumber.from(listing.endTimestamp).toNumber(),
      creatorAddress: listing.listingCreator,
      isReservedListing: listing.reserved,
      status: status,
    };
  }

  /**
   * Use this method to check if a direct listing is still valid.
   *
   * Ways a direct listing can become invalid:
   * 1. The asset holder transferred the asset to another wallet
   * 2. The asset holder burned the asset
   * 3. The asset holder removed the approval on the marketplace
   *
   * @internal
   * @param listing - The listing to check.
   * @returns - True if the listing is valid, false otherwise.
   */
  private async isStillValidListing(
    listing: DirectListingV3,
    quantity?: BigNumberish,
  ): Promise<{ valid: boolean; error?: string }> {
    const approved = await isTokenApprovedForTransfer(
      this.contractWrapper.getProvider(),
      this.getAddress(),
      listing.assetContractAddress,
      listing.tokenId,
      listing.creatorAddress,
    );

    if (!approved) {
      return {
        valid: false,
        error: `Token '${listing.tokenId}' from contract '${listing.assetContractAddress}' is not approved for transfer`,
      };
    }

    const provider = this.contractWrapper.getProvider();
    const ERC165Abi = (
      await import("@thirdweb-dev/contracts-js/dist/abis/IERC165.json")
    ).default;
    const erc165 = new Contract(
      listing.assetContractAddress,
      ERC165Abi,
      provider,
    ) as IERC165;
    const isERC721 = await erc165.supportsInterface(InterfaceId_IERC721);
    const isERC1155 = await erc165.supportsInterface(InterfaceId_IERC1155);
    if (isERC721) {
      const ERC721Abi = (
        await import("@thirdweb-dev/contracts-js/dist/abis/IERC721.json")
      ).default;
      const asset = new Contract(
        listing.assetContractAddress,
        ERC721Abi,
        provider,
      ) as IERC721;

      // Handle reverts in case of non-existent tokens
      let owner;
      try {
        owner = await asset.ownerOf(listing.tokenId);
      } catch (e) {}
      const valid =
        owner?.toLowerCase() === listing.creatorAddress.toLowerCase();

      return {
        valid,
        error: valid
          ? undefined
          : `Seller is not the owner of Token '${listing.tokenId}' from contract '${listing.assetContractAddress} anymore'`,
      };
    } else if (isERC1155) {
      const ERC1155Abi = (
        await import("@thirdweb-dev/contracts-js/dist/abis/IERC1155.json")
      ).default;
      const asset = new Contract(
        listing.assetContractAddress,
        ERC1155Abi,
        provider,
      ) as IERC1155;
      const balance = await asset.balanceOf(
        listing.creatorAddress,
        listing.tokenId,
      );
      const valid = balance.gte(quantity || listing.quantity);
      return {
        valid,
        error: valid
          ? undefined
          : `Seller does not have enough balance of Token '${listing.tokenId}' from contract '${listing.assetContractAddress} to fulfill the listing`,
      };
    } else {
      return {
        valid: false,
        error: "Contract does not implement ERC 1155 or ERC 721.",
      };
    }
  }

  private async applyFilter(
    listings: IDirectListings.ListingStructOutput[],
    filter?: MarketplaceFilterWithoutOfferor,
  ) {
    let rawListings = [...listings];

    if (filter) {
      if (filter.seller) {
        const resolvedSeller = await resolveAddress(filter.seller);
        rawListings = rawListings.filter(
          (seller) =>
            seller.listingCreator.toString().toLowerCase() ===
            resolvedSeller?.toString().toLowerCase(),
        );
      }
      if (filter.tokenContract) {
        const resolvedToken = await resolveAddress(filter.tokenContract);
        rawListings = rawListings.filter(
          (tokenContract) =>
            tokenContract.assetContract.toString().toLowerCase() ===
            resolvedToken?.toString().toLowerCase(),
        );
      }

      if (filter.tokenId !== undefined) {
        rawListings = rawListings.filter(
          (tokenContract) =>
            tokenContract.tokenId.toString() === filter?.tokenId?.toString(),
        );
      }
    }

    return filter?.count && filter.count < rawListings.length
      ? rawListings.slice(0, filter.count)
      : rawListings;
  }
}
