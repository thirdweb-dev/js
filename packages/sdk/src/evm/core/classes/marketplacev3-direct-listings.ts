import { DEFAULT_QUERY_ALL_COUNT } from "../../../core/schema/QueryParams";
import { ListingNotFoundError, WrongListingTypeError } from "../../common";
import {
  cleanCurrencyAddress,
  fetchCurrencyValue,
  isNativeToken,
  normalizePriceValue,
  setErc20Allowance,
} from "../../common/currency";
import {
  handleTokenApproval,
  isTokenApprovedForTransfer,
  validateNewListingParam,
} from "../../common/marketplacev3";
import { fetchTokenMetadataForContract } from "../../common/nft";
import {
  InterfaceId_IERC1155,
  InterfaceId_IERC721,
} from "../../constants/contract";
import { ListingType } from "../../enums";
import { MarketplaceFilter } from "../../types";
import { Price } from "../../types/currency";
import { DirectListingV3, NewDirectListingV3 } from "../../types/marketplacev3";
import {
  NetworkOrSignerOrProvider,
  TransactionResult,
  TransactionResultWithId,
} from "../types";
import { ContractWrapper } from "./contract-wrapper";
import type {
  IERC1155,
  IERC165,
  IERC721,
  IDirectListings,
  MarketplaceRouter,
  DirectListingsLogic,
} from "@thirdweb-dev/contracts-js";
import DirectListingsABI from "@thirdweb-dev/contracts-js/dist/abis/DirectListingsLogic.json";
import ERC165Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC165.json";
import ERC721Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC721.json";
import ERC1155Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC1155.json";
import {
  NewListingEvent,
  UpdatedListingEvent,
} from "@thirdweb-dev/contracts-js/dist/declarations/src/DirectListingsLogic";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BigNumber,
  BigNumberish,
  Contract,
  ethers,
  constants,
  utils,
} from "ethers";
import invariant from "tiny-invariant";

/**
 * Handles direct listings
 * @public
 */
export class MarketplaceV3DirectListings {
  private directListings: ContractWrapper<DirectListingsLogic>;
  private entrypoint: ContractWrapper<MarketplaceRouter>;
  private storage: ThirdwebStorage;

  constructor(
    directListings: ContractWrapper<DirectListingsLogic>,
    entrypoint: ContractWrapper<MarketplaceRouter>,
    storage: ThirdwebStorage,
  ) {
    this.directListings = directListings;
    this.entrypoint = entrypoint;
    this.storage = storage;
  }

  onNetworkUpdated(network: NetworkOrSignerOrProvider) {
    this.directListings.updateSignerOrProvider(network);
  }

  getAddress(): string {
    return this.entrypoint.readContract.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get the total number of direct listings
   * @returns Returns the total number of direct listings created.
   * @public
   */
  public async getTotalListings(): Promise<BigNumber> {
    return await this.directListings.readContract.totalListings();
  }

  /**
   * Get all direct listings between start and end Id (both inclusive).
   *
   * @param filter - optional filter parameters
   * @returns the Direct listing object array
   */
  public async getAllListings(
    filter?: MarketplaceFilter,
  ): Promise<DirectListingV3[]> {
    const startIndex = BigNumber.from(filter?.start || 0).toNumber();
    const count = BigNumber.from(
      filter?.count || (await this.getTotalListings()),
    ).toNumber();

    if (count === 0) {
      throw new Error(`No listings exist on the contract.`);
    }

    let rawListings = await this.directListings.readContract.getAllListings(
      startIndex,
      count - 1,
    );

    const filteredListings = this.applyFilter(rawListings, filter);

    return await Promise.all(
      filteredListings.map((listing) => this.mapListing(listing)),
    );
  }

  /**
   * Get all valid direct listings between start and end Id (both inclusive).
   *
   * A valid listing is where the listing creator still owns and has approved Marketplace
   * to transfer the listed NFTs.
   *
   * @param filter - optional filter parameters
   * @returns the Direct listing object array
   */
  public async getAllValidListings(
    filter?: MarketplaceFilter,
  ): Promise<DirectListingV3[]> {
    const startIndex = BigNumber.from(filter?.start || 0).toNumber();
    const count = BigNumber.from(
      filter?.count || (await this.getTotalListings()),
    ).toNumber();

    if (count === 0) {
      throw new Error(`No listings exist on the contract.`);
    }

    let rawListings =
      await this.directListings.readContract.getAllValidListings(
        startIndex,
        count - 1,
      );

    const filteredListings = this.applyFilter(rawListings, filter);

    return await Promise.all(
      filteredListings.map((listing) => this.mapListing(listing)),
    );
  }

  /**
   * Get a direct listing by id
   *
   * @param listingId - the listing id
   * @returns the Direct listing object
   */
  public async getListing(listingId: BigNumberish): Promise<DirectListingV3> {
    const listing = await this.directListings.readContract.getListing(
      listingId,
    );

    return await this.mapListing(listing);
  }

  /**
   * Check whether a buyer is approved for a reserved listing.
   *
   * @param listingId - the listing id
   * @param buyer - buyer address
   */
  public async isBuyerApprovedForListing(
    listingId: BigNumberish,
    buyer: string,
  ): Promise<boolean> {
    const listing = await this.validateListing(BigNumber.from(listingId));

    if (!listing.isReservedListing) {
      throw new Error(`Listing ${listingId} is not a reserved listing.`);
    }

    return await this.directListings.readContract.isBuyerApprovedForListing(
      listingId,
      buyer,
    );
  }

  /**
   * Check whether a currency is approved for a listing.
   *
   * @param listingId - the listing id
   * @param buyer - buyer address
   */
  public async isCurrencyApprovedForListing(
    listingId: BigNumberish,
    buyer: string,
  ): Promise<boolean> {
    const listing = await this.validateListing(BigNumber.from(listingId));

    return await this.directListings.readContract.isBuyerApprovedForListing(
      listingId,
      buyer,
    );
  }

  /**
   * Check price per token for an approved currency.
   *
   * @param listingId - the listing id
   * @param currencyContractAddress - currency contract address
   */
  public async currencyPriceForListing(
    listingId: BigNumberish,
    currencyContractAddress: string,
  ): Promise<BigNumberish> {
    const listing = await this.validateListing(BigNumber.from(listingId));

    if (currencyContractAddress === listing.currencyContractAddress) {
      return listing.pricePerToken;
    }

    const isApprovedCurrency = await this.isCurrencyApprovedForListing(
      listingId,
      currencyContractAddress,
    );

    if (!isApprovedCurrency) {
      throw new Error(
        `Currency ${currencyContractAddress} is not approved for Listing ${listingId}.`,
      );
    }

    return await this.directListings.readContract.currencyPriceForListing(
      listingId,
      currencyContractAddress,
    );
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Create Direct Listing
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
   *   // when should the listing open up for offers
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
   * const id = tx.id; // the id of the newly created listing
   * ```
   */
  public async createListing(
    listing: NewDirectListingV3,
  ): Promise<TransactionResultWithId> {
    validateNewListingParam(listing);

    await handleTokenApproval(
      this.directListings,
      this.getAddress(),
      listing.assetContractAddress,
      listing.tokenId,
      await this.directListings.getSignerAddress(),
    );

    const normalizedPricePerToken = await normalizePriceValue(
      this.directListings.getProvider(),
      listing.pricePerToken,
      listing.currencyContractAddress,
    );

    let listingStartTime = Math.floor(listing.startTimestamp.getTime() / 1000);
    const block = await this.directListings.getProvider().getBlock("latest");
    const blockTime = block.timestamp;
    if (listingStartTime < blockTime) {
      listingStartTime = blockTime;
    }

    let listingEndTime = Math.floor(listing.endTimestamp.getTime() / 1000);

    const receipt = await this.directListings.sendTransaction(
      "createListing",
      [
        {
          assetContract: listing.assetContractAddress,
          tokenId: listing.tokenId,
          quantity: listing.quantity,
          currency: cleanCurrencyAddress(listing.currencyContractAddress),
          pricePerToken: normalizedPricePerToken,
          startTimestamp: BigNumber.from(listingStartTime),
          endTimestamp: BigNumber.from(listingEndTime),
          reserved: listing.isReservedListing,
        } as IDirectListings.ListingParametersStruct,
      ],
      {
        // Higher gas limit for create listing
        gasLimit: 500000,
      },
    );

    const event = this.directListings.parseLogs<NewListingEvent>(
      "NewListing",
      receipt?.logs,
    );
    return {
      id: event[0].args.listingId,
      receipt,
    };
  }

  /**
   * Update a Direct listing with new metadata.
   *
   * Note: cannot update a listing with a new quantity of 0. Use `cancelDirectListing` to remove a listing instead.
   *
   * @param listing - the new listing information
   */
  public async updateListing(
    listingId: BigNumberish,
    listing: NewDirectListingV3,
  ): Promise<TransactionResultWithId> {
    validateNewListingParam(listing);

    await handleTokenApproval(
      this.directListings,
      this.getAddress(),
      listing.assetContractAddress,
      listing.tokenId,
      await this.directListings.getSignerAddress(),
    );

    const normalizedPricePerToken = await normalizePriceValue(
      this.directListings.getProvider(),
      listing.pricePerToken,
      listing.currencyContractAddress,
    );

    let listingStartTime = Math.floor(listing.startTimestamp.getTime() / 1000);
    let listingEndTime = Math.floor(listing.endTimestamp.getTime() / 1000);

    const receipt = await this.directListings.sendTransaction(
      "updateListing",
      [
        listingId,
        {
          assetContract: listing.assetContractAddress,
          tokenId: listing.tokenId,
          quantity: listing.quantity,
          currency: cleanCurrencyAddress(listing.currencyContractAddress),
          pricePerToken: normalizedPricePerToken,
          startTimestamp: BigNumber.from(listingStartTime),
          endTimestamp: BigNumber.from(listingEndTime),
          reserved: listing.isReservedListing,
        } as IDirectListings.ListingParametersStruct,
      ],
      {
        // Higher gas limit for create listing
        gasLimit: 500000,
      },
    );

    const event = this.directListings.parseLogs<UpdatedListingEvent>(
      "UpdatedListing",
      receipt?.logs,
    );
    return {
      id: event[0].args.listingId,
      receipt,
    };
  }

  /**
   * Cancel Direct Listing
   *
   * @remarks Cancel a direct listing on the marketplace
   *
   * @example
   * ```javascript
   * // The listing ID of the direct listing you want to cancel
   * const listingId = "0";
   *
   * await contract.direct.cancelListing(listingId);
   * ```
   */
  public async cancelListing(
    listingId: BigNumberish,
  ): Promise<TransactionResult> {
    return {
      receipt: await this.directListings.sendTransaction("cancelListing", [
        listingId,
      ]),
    };
  }

  /**
   * Buy from a Listing
   *
   * @remarks Buy a specific direct listing from the marketplace.
   *
   * @example
   * ```javascript
   * // The listing ID of the asset you want to buy
   * const listingId = 0;
   * // Quantity of the asset you want to buy
   * const quantityDesired = 1;
   *
   * await contract.direct.buyoutListing(listingId, quantityDesired);
   * ```
   *
   * @param listingId - The listing id to buy
   * @param quantityDesired - the quantity to buy
   * @param receiver - optional receiver of the bought listing if different from the connected wallet
   */
  public async buyFromListing(
    listingId: BigNumberish,
    quantityDesired: BigNumberish,
    receiver?: string,
  ): Promise<TransactionResult> {
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
      : await this.directListings.getSignerAddress();
    const quantity = BigNumber.from(quantityDesired);
    const value = BigNumber.from(listing.pricePerToken).mul(quantity);
    const overrides = (await this.directListings.getCallOverrides()) || {};
    await setErc20Allowance(
      this.directListings,
      value,
      listing.currencyContractAddress,
      overrides,
    );
    return {
      receipt: await this.directListings.sendTransaction(
        "buyFromListing",
        [listingId, buyFor, quantity, listing.currencyContractAddress, value],
        overrides,
      ),
    };
  }

  /**
   * Approve buyer for reserved listing.
   *
   * @remarks Approve a buyer to buy from a reserved listing.
   *
   * @example
   * ```javascript
   * // The listing ID of the direct listing you want approve buyer for
   * const listingId = "0";
   *
   * await contract.direct.approveBuyerForReservedListing(listingId, buyer);
   * ```
   *
   * @param listingId - The listing id to buy
   * @param buyer - Address of buyer being approved
   */
  public async approveBuyerForReservedListing(
    listingId: BigNumberish,
    buyer: string,
  ): Promise<TransactionResult> {
    const isApproved = await this.isBuyerApprovedForListing(listingId, buyer);

    if (!isApproved) {
      return {
        receipt: await this.directListings.sendTransaction(
          "approveBuyerForListing",
          [listingId, buyer, true],
        ),
      };
    } else {
      throw new Error(
        `Buyer ${buyer} already approved for listing ${listingId}.`,
      );
    }
  }

  /**
   * Revoke approval of a buyer for reserved listing.
   *
   * @example
   * ```javascript
   * // The listing ID of the direct listing you want approve buyer for
   * const listingId = "0";
   *
   * await contract.direct.revokeBuyerApprovalForReservedListing(listingId, buyer);
   * ```
   *
   * @param listingId - The listing id to buy
   * @param buyer - Address of buyer being approved
   */
  public async revokeBuyerApprovalForReservedListing(
    listingId: BigNumberish,
    buyer: string,
  ): Promise<TransactionResult> {
    const isApproved = await this.isBuyerApprovedForListing(listingId, buyer);

    if (isApproved) {
      return {
        receipt: await this.directListings.sendTransaction(
          "approveBuyerForListing",
          [listingId, buyer, false],
        ),
      };
    } else {
      throw new Error(`Buyer ${buyer} not approved for listing ${listingId}.`);
    }
  }

  /**
   * Approve a currency for a listing.
   *
   *
   * @example
   * ```javascript
   * // The listing ID of the direct listing you want approve currency for
   * const listingId = "0";
   *
   * await contract.direct.approveCurrencyForListing(listingId, currencyContractAddress, pricePerTokenInCurrency);
   * ```
   *
   * @param listingId - The listing id to buy
   * @param currencyContractAddress - Address of currency being approved
   * @param pricePerTokenInCurrency - Price per token in the currency
   */
  public async approveCurrencyForListing(
    listingId: BigNumberish,
    currencyContractAddress: string,
    pricePerTokenInCurrency: BigNumberish,
  ): Promise<TransactionResult> {
    const listing = await this.validateListing(BigNumber.from(listingId));

    if (currencyContractAddress === listing.currencyContractAddress) {
      invariant(
        pricePerTokenInCurrency === listing.pricePerToken,
        "Approving listing currency with a different price.",
      );
    }

    const currencyPrice =
      await this.directListings.readContract.currencyPriceForListing(
        listingId,
        currencyContractAddress,
      );
    invariant(
      pricePerTokenInCurrency === currencyPrice,
      "Currency already approved with this price.",
    );

    return {
      receipt: await this.directListings.sendTransaction(
        "approveCurrencyForListing",
        [listingId, currencyContractAddress, pricePerTokenInCurrency],
      ),
    };
  }

  /**
   * Revoke approval of a currency for a listing.
   *
   *
   * @example
   * ```javascript
   * // The listing ID of the direct listing you want to revoke currency for
   * const listingId = "0";
   *
   * await contract.direct.revokeCurrencyApprovalForListing(listingId, currencyContractAddress);
   * ```
   *
   * @param listingId - The listing id to buy
   * @param currencyContractAddress - Address of currency
   */
  public async revokeCurrencyApprovalForListing(
    listingId: BigNumberish,
    currencyContractAddress: string,
  ): Promise<TransactionResult> {
    const listing = await this.validateListing(BigNumber.from(listingId));

    if (currencyContractAddress === listing.currencyContractAddress) {
      throw new Error(`Can't revoke approval for main listing currency.`);
    }

    const currencyPrice =
      await this.directListings.readContract.currencyPriceForListing(
        listingId,
        currencyContractAddress,
      );
    invariant(!currencyPrice.isZero(), "Currency not approved.");

    return {
      receipt: await this.directListings.sendTransaction(
        "approveCurrencyForListing",
        [listingId, currencyContractAddress, BigNumber.from(0)],
      ),
    };
  }

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
  public async mapListing(
    listing: IDirectListings.ListingStruct,
  ): Promise<DirectListingV3> {
    return {
      assetContractAddress: listing.assetContract,
      currencyContractAddress: listing.currency,
      pricePerToken: listing.pricePerToken,
      currencyValuePerToken: await fetchCurrencyValue(
        this.directListings.getProvider(),
        listing.currency,
        listing.pricePerToken,
      ),
      id: listing.listingId.toString(),
      tokenId: listing.tokenId,
      quantity: listing.quantity,
      startTimeInSeconds: listing.startTimestamp,
      asset: await fetchTokenMetadataForContract(
        listing.assetContract,
        this.directListings.getProvider(),
        listing.tokenId,
        this.storage,
      ),
      endTimeInSeconds: listing.endTimestamp,
      listingCreatorAddress: listing.listingCreator,
      isReservedListing: listing.reserved,
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
  public async isStillValidListing(
    listing: DirectListingV3,
    quantity?: BigNumberish,
  ): Promise<{ valid: boolean; error?: string }> {
    const approved = await isTokenApprovedForTransfer(
      this.directListings.getProvider(),
      this.getAddress(),
      listing.assetContractAddress,
      listing.tokenId,
      listing.listingCreatorAddress,
    );

    if (!approved) {
      return {
        valid: false,
        error: `Token '${listing.tokenId}' from contract '${listing.assetContractAddress}' is not approved for transfer`,
      };
    }

    const provider = this.directListings.getProvider();
    const erc165 = new Contract(
      listing.assetContractAddress,
      ERC165Abi,
      provider,
    ) as IERC165;
    const isERC721 = await erc165.supportsInterface(InterfaceId_IERC721);
    const isERC1155 = await erc165.supportsInterface(InterfaceId_IERC1155);
    if (isERC721) {
      const asset = new Contract(
        listing.assetContractAddress,
        ERC721Abi,
        provider,
      ) as IERC721;
      const valid =
        (await asset.ownerOf(listing.tokenId)).toLowerCase() ===
        listing.listingCreatorAddress.toLowerCase();
      return {
        valid,
        error: valid
          ? undefined
          : `Seller is not the owner of Token '${listing.tokenId}' from contract '${listing.assetContractAddress} anymore'`,
      };
    } else if (isERC1155) {
      const asset = new Contract(
        listing.assetContractAddress,
        ERC1155Abi,
        provider,
      ) as IERC1155;
      const balance = await asset.balanceOf(
        listing.listingCreatorAddress,
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

  private applyFilter(
    listings: IDirectListings.ListingStructOutput[],
    filter?: MarketplaceFilter,
  ) {
    let rawListings = [...listings];

    if (filter) {
      if (filter.seller) {
        rawListings = rawListings.filter(
          (seller) =>
            seller.listingCreator.toString().toLowerCase() ===
            filter?.seller?.toString().toLowerCase(),
        );
      }
      if (filter.tokenContract) {
        rawListings = rawListings.filter(
          (tokenContract) =>
            tokenContract.assetContract.toString().toLowerCase() ===
            filter?.tokenContract?.toString().toLowerCase(),
        );
      }

      if (filter.tokenId !== undefined) {
        rawListings = rawListings.filter(
          (tokenContract) =>
            tokenContract.tokenId.toString() === filter?.tokenId?.toString(),
        );
      }
    }

    return rawListings;
  }
}
