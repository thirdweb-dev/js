import type {
  IERC1155,
  IERC165,
  IERC721,
  IMarketplace,
  Marketplace,
} from "@thirdweb-dev/contracts-js";
import ERC1155Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC1155.json";
import ERC165Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC165.json";
import ERC721Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC721.json";
import { ListingAddedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/Marketplace";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BigNumber,
  Contract,
  constants,
  utils,
  type BigNumberish,
} from "ethers";
import invariant from "tiny-invariant";
import { cleanCurrencyAddress } from "../../common/currency/cleanCurrencyAddress";
import { fetchCurrencyValue } from "../../common/currency/fetchCurrencyValue";
import { isNativeToken } from "../../common/currency/isNativeToken";
import { normalizePriceValue } from "../../common/currency/normalizePriceValue";
import { setErc20Allowance } from "../../common/currency/setErc20Allowance";
import { resolveAddress } from "../../common/ens/resolveAddress";
import {
  ListingNotFoundError,
  WrongListingTypeError,
} from "../../common/error";
import {
  handleTokenApproval,
  isTokenApprovedForTransfer,
  mapOffer,
  validateNewListingParam,
} from "../../common/marketplace";
import { fetchTokenMetadataForContract } from "../../common/nft";
import { buildTransactionFunction } from "../../common/transactions";
import {
  InterfaceId_IERC1155,
  InterfaceId_IERC721,
} from "../../constants/contract";
import { ListingType } from "../../enums/marketplace/ListingType";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { Price } from "../../types/currency";
import { TransactionResultWithId } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import { DirectListing } from "../../types/marketplace/DirectListing";
import { Offer } from "../../types/marketplace/Offer";
import { NewDirectListing } from "../../types/marketplace/NewDirectListing";

/**
 * Handles direct listings
 * @public
 */
export class MarketplaceDirect {
  private contractWrapper: ContractWrapper<Marketplace>;
  private storage: ThirdwebStorage;

  constructor(
    contractWrapper: ContractWrapper<Marketplace>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  getAddress(): string {
    return this.contractWrapper.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get a direct listing by id
   *
   * @param listingId - the listing id
   * @returns the Direct listing object
   */
  public async getListing(listingId: BigNumberish): Promise<DirectListing> {
    const listing = await this.contractWrapper.read("listings", [listingId]);

    if (listing.assetContract === constants.AddressZero) {
      throw new ListingNotFoundError(this.getAddress(), listingId.toString());
    }

    if (listing.listingType !== ListingType.Direct) {
      throw new WrongListingTypeError(
        this.getAddress(),
        listingId.toString(),
        "Auction",
        "Direct",
      );
    }

    return await this.mapListing(listing);
  }

  /**
   * Get the active offer on a listing
   * @param listingId - the listing id
   * @param address - the address that made the offer
   */
  public async getActiveOffer(
    listingId: BigNumberish,
    address: AddressOrEns,
  ): Promise<Offer | undefined> {
    await this.validateListing(BigNumber.from(listingId));
    invariant(utils.isAddress(address), "Address must be a valid address");
    const offers = await this.contractWrapper.read("offers", [
      listingId,
      await resolveAddress(address),
    ]);
    if (offers.offeror === constants.AddressZero) {
      return undefined;
    }
    return await mapOffer(
      this.contractWrapper.getProvider(),
      BigNumber.from(listingId),
      offers,
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
  createListing = /* @__PURE__ */ buildTransactionFunction(
    async (listing: NewDirectListing) => {
      validateNewListingParam(listing);

      const resolvedAssetAddress = await resolveAddress(
        listing.assetContractAddress,
      );
      const resolvedCurrencyAddress = await resolveAddress(
        listing.currencyContractAddress,
      );

      await handleTokenApproval(
        this.contractWrapper,
        this.getAddress(),
        resolvedAssetAddress,
        listing.tokenId,
        await this.contractWrapper.getSignerAddress(),
      );

      const normalizedPricePerToken = await normalizePriceValue(
        this.contractWrapper.getProvider(),
        listing.buyoutPricePerToken,
        resolvedCurrencyAddress,
      );

      let listingStartTime = Math.floor(
        listing.startTimestamp.getTime() / 1000,
      );
      const block = await this.contractWrapper.getProvider().getBlock("latest");
      const blockTime = block.timestamp;
      if (listingStartTime < blockTime) {
        listingStartTime = blockTime;
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "createListing",
        args: [
          {
            assetContract: resolvedAssetAddress,
            tokenId: listing.tokenId,
            buyoutPricePerToken: normalizedPricePerToken,
            currencyToAccept: cleanCurrencyAddress(resolvedCurrencyAddress),
            listingType: ListingType.Direct,
            quantityToList: listing.quantity,
            reservePricePerToken: normalizedPricePerToken,
            secondsUntilEndTime: listing.listingDurationInSeconds,
            startTime: BigNumber.from(listingStartTime),
          } as IMarketplace.ListingParametersStruct,
        ],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<ListingAddedEvent>(
            "ListingAdded",
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
   * const tx = await contract.direct.createListingsBatch(listings);
   * ```
   */
  createListingsBatch = /* @__PURE__ */ buildTransactionFunction(
    async (
      listings: NewDirectListing[],
    ): Promise<Transaction<TransactionResultWithId[]>> => {
      const data = (
        await Promise.all(
          listings.map((listing) => this.createListing.prepare(listing)),
        )
      ).map((tx) => tx.encode());

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [data],
        parse: (receipt) => {
          const events = this.contractWrapper.parseLogs<ListingAddedEvent>(
            "ListingAdded",
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
   * Make an offer for a Direct Listing
   *
   * @remarks Make an offer on a direct listing
   *
   * @example
   * ```javascript
   * import { ChainId, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
   *
   * // The listing ID of the asset you want to offer on
   * const listingId = 0;
   * // The price you are willing to offer per token
   * const pricePerToken = 1;
   * // The quantity of tokens you want to receive for this offer
   * const quantity = 1;
   * // The address of the currency you are making the offer in (must be ERC-20)
   * const currencyContractAddress = NATIVE_TOKENS[ChainId.Rinkeby].wrapped.address
   *
   * await contract.direct.makeOffer(
   *   listingId,
   *   quantity,
   *   currencyContractAddress,
   *   pricePerToken
   * );
   * ```
   */
  makeOffer = /* @__PURE__ */ buildTransactionFunction(
    async (
      listingId: BigNumberish,
      quantityDesired: BigNumberish,
      currencyContractAddress: AddressOrEns,
      pricePerToken: Price,
      expirationDate?: Date,
    ) => {
      if (isNativeToken(currencyContractAddress)) {
        throw new Error(
          "You must use the wrapped native token address when making an offer with a native token",
        );
      }

      const normalizedPrice = await normalizePriceValue(
        this.contractWrapper.getProvider(),
        pricePerToken,
        currencyContractAddress,
      );

      try {
        await this.getListing(listingId);
      } catch (err) {
        console.error("Failed to get listing, err =", err);
        throw new Error(`Error getting the listing with id ${listingId}`);
      }

      const quantity = BigNumber.from(quantityDesired);
      const value = BigNumber.from(normalizedPrice).mul(quantity);
      const overrides = (await this.contractWrapper.getCallOverrides()) || {};
      await setErc20Allowance(
        this.contractWrapper,
        value,
        currencyContractAddress,
        overrides,
      );

      let expirationTimestamp = constants.MaxUint256;
      if (expirationDate) {
        expirationTimestamp = BigNumber.from(
          Math.floor(expirationDate.getTime() / 1000),
        );
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "offer",
        args: [
          listingId,
          quantityDesired,
          currencyContractAddress,
          normalizedPrice,
          expirationTimestamp,
        ],
        overrides,
      });
    },
  );

  /**
   * Accept an offer on a direct listing
   *
   * @remarks Accept an offer on a direct listing
   *
   * @example
   * ```javascript
   * // The listing ID of the asset you want to bid on
   * const listingId = 0;
   * // The price you are willing to bid for a single token of the listing
   * const offeror = "0x...";
   *
   * await contract.direct.acceptOffer(listingId, offeror);
   * ```
   */
  acceptOffer = /* @__PURE__ */ buildTransactionFunction(
    async (listingId: BigNumberish, addressOfOfferor: AddressOrEns) => {
      /**
       * TODO:
       * - Provide better error handling if offer is too low.
       */
      await this.validateListing(BigNumber.from(listingId));
      const resolvedAddress = await resolveAddress(addressOfOfferor);
      const offer = await this.contractWrapper.read("offers", [
        listingId,
        resolvedAddress,
      ]);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "acceptOffer",
        args: [listingId, resolvedAddress, offer.currency, offer.pricePerToken],
      });
    },
  );

  /**
   * Buy a Listing
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
  buyoutListing = /* @__PURE__ */ buildTransactionFunction(
    async (
      listingId: BigNumberish,
      quantityDesired: BigNumberish,
      receiver?: AddressOrEns,
    ) => {
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
      const value = BigNumber.from(listing.buyoutPrice).mul(quantity);
      const overrides = (await this.contractWrapper.getCallOverrides()) || {};
      await setErc20Allowance(
        this.contractWrapper,
        value,
        listing.currencyContractAddress,
        overrides,
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "buy",
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
   * Update a Direct listing with new metadata.
   *
   * Note: cannot update a listing with a new quantity of 0. Use `cancelDirectListing` to remove a listing instead.
   *
   * @param listing - the new listing information
   */
  updateListing = /* @__PURE__ */ buildTransactionFunction(
    async (listing: DirectListing) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "updateListing",
        args: [
          listing.id,
          listing.quantity,
          listing.buyoutPrice, // reserve price, doesn't matter for direct listing
          listing.buyoutPrice,
          await resolveAddress(listing.currencyContractAddress),
          listing.startTimeInSeconds,
          listing.secondsUntilEnd,
        ],
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
   * const listingId = "0";
   *
   * await contract.direct.cancelListing(listingId);
   * ```
   */
  cancelListing = /* @__PURE__ */ buildTransactionFunction(
    async (listingId: BigNumberish) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "cancelDirectListing",
        args: [listingId],
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
  private async validateListing(listingId: BigNumber): Promise<DirectListing> {
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
    listing: IMarketplace.ListingStruct,
  ): Promise<DirectListing> {
    return {
      assetContractAddress: listing.assetContract,
      buyoutPrice: BigNumber.from(listing.buyoutPricePerToken),
      currencyContractAddress: listing.currency,
      buyoutCurrencyValuePerToken: await fetchCurrencyValue(
        this.contractWrapper.getProvider(),
        listing.currency,
        listing.buyoutPricePerToken,
      ),
      id: listing.listingId.toString(),
      tokenId: listing.tokenId,
      quantity: listing.quantity,
      startTimeInSeconds: listing.startTime,
      asset: await fetchTokenMetadataForContract(
        listing.assetContract,
        this.contractWrapper.getProvider(),
        listing.tokenId,
        this.storage,
      ),
      secondsUntilEnd: listing.endTime,
      sellerAddress: listing.tokenOwner,
      type: ListingType.Direct,
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
    listing: DirectListing,
    quantity?: BigNumberish,
  ): Promise<{ valid: boolean; error?: string }> {
    const approved = await isTokenApprovedForTransfer(
      this.contractWrapper.getProvider(),
      this.getAddress(),
      listing.assetContractAddress,
      listing.tokenId,
      listing.sellerAddress,
    );

    if (!approved) {
      return {
        valid: false,
        error: `Token '${listing.tokenId}' from contract '${listing.assetContractAddress}' is not approved for transfer`,
      };
    }

    const provider = this.contractWrapper.getProvider();
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

      // Handle reverts in case of non-existent tokens
      let owner;
      try {
        owner = await asset.ownerOf(listing.tokenId);
      } catch (e) {}
      const valid =
        owner?.toLowerCase() === listing.sellerAddress.toLowerCase();

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
        listing.sellerAddress,
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
}
