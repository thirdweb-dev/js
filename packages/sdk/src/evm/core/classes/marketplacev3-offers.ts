import { DEFAULT_QUERY_ALL_COUNT } from "../../../core/schema/QueryParams";
import {
  fetchCurrencyValue,
  isNativeToken,
  normalizePriceValue,
  setErc20Allowance,
} from "../../common/currency";
import { handleTokenApproval } from "../../common/marketplacev3";
import { fetchTokenMetadataForContract } from "../../common/nft";
import { NATIVE_TOKENS, SUPPORTED_CHAIN_ID } from "../../constants";
import {
  OfferInputParams,
  OfferInputParamsSchema,
} from "../../schema/marketplacev3/offer";
import { MarketplaceFilter } from "../../types";
import { OfferV3 } from "../../types/marketplacev3";
import { TransactionResult, TransactionResultWithId } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import type { IERC20, IOffers, OffersLogic } from "@thirdweb-dev/contracts-js";
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import { NewOfferEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/OffersLogic";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish } from "ethers";

/**
 * Handles marketplace offers
 * @public
 */
export class MarketplaceV3Offers {
  private contractWrapper: ContractWrapper<OffersLogic>;
  private storage: ThirdwebStorage;

  constructor(
    contractWrapper: ContractWrapper<OffersLogic>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get the total number of offers
   * @returns Returns the total number of offers created.
   * @public
   *
   * @example
   * ```javascript
   * const totalOffers = await contract.offers.getTotalCount();
   * ```
   */
  public async getTotalCount(): Promise<BigNumber> {
    return await this.contractWrapper.readContract.totalOffers();
  }

  /**
   * Get all offers.
   *
   * @example
   * ```javascript
   * const offers = await contract.offers.getAll();
   * ```
   *
   * @param filter - optional filter parameters
   * @returns the Offer object array
   */
  public async getAll(filter?: MarketplaceFilter): Promise<OfferV3[]> {
    const totalOffers = await this.getTotalCount();

    let start = BigNumber.from(filter?.start || 0).toNumber();
    let end = totalOffers.toNumber();

    if (end === 0) {
      throw new Error(`No offers exist on the contract.`);
    }

    let rawOffers: IOffers.OfferStructOutput[] = [];
    let partialOffers: any[] = [];
    while (end - start > DEFAULT_QUERY_ALL_COUNT) {
      partialOffers.push(
        this.contractWrapper.readContract.getAllOffers(
          start,
          start + DEFAULT_QUERY_ALL_COUNT - 1,
        ),
      );
      start += DEFAULT_QUERY_ALL_COUNT;
    }
    partialOffers.push(
      await this.contractWrapper.readContract.getAllOffers(start, end - 1),
    );
    rawOffers = (await Promise.all(partialOffers)).flat();

    const filteredOffers = this.applyFilter(rawOffers, filter);

    return await Promise.all(
      filteredOffers.map((offer) => this.mapOffer(offer)),
    );
  }

  /**
   * Get all valid offers.
   *
   * @example
   * ```javascript
   * const offers = await contract.offers.getAllValid();
   * ```
   *
   * @param filter - optional filter parameters
   * @returns the Offer object array
   */
  public async getAllValid(filter?: MarketplaceFilter): Promise<OfferV3[]> {
    const totalOffers = await this.getTotalCount();

    let start = BigNumber.from(filter?.start || 0).toNumber();
    let end = totalOffers.toNumber();

    if (end === 0) {
      throw new Error(`No offers exist on the contract.`);
    }

    let rawOffers: IOffers.OfferStructOutput[] = [];
    let partialOffers: any[] = [];
    while (end - start > DEFAULT_QUERY_ALL_COUNT) {
      partialOffers.push(
        this.contractWrapper.readContract.getAllOffers(
          start,
          start + DEFAULT_QUERY_ALL_COUNT - 1,
        ),
      );
      start += DEFAULT_QUERY_ALL_COUNT;
    }
    partialOffers.push(
      await this.contractWrapper.readContract.getAllOffers(start, end - 1),
    );
    rawOffers = (await Promise.all(partialOffers)).flat();

    const filteredOffers = this.applyFilter(rawOffers, filter);

    return await Promise.all(
      filteredOffers.map((offer) => this.mapOffer(offer)),
    );
  }

  /**
   * Get a offer by id
   *
   * @example
   * ```javascript
   * const offerId = 0;
   * const offer = await contract.offers.getOffer(offerId);
   * ```
   *
   * @param offerId - the listing id
   * @returns the Direct listing object
   */
  public async getOffer(offerId: BigNumberish): Promise<OfferV3> {
    const offer = await this.contractWrapper.readContract.getOffer(offerId);

    return await this.mapOffer(offer);
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Make Offer
   *
   * @remarks Make an offer on the marketplace for an asset.
   *
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
   * ```
   */
  public async makeOffer(
    offer: OfferInputParams,
  ): Promise<TransactionResultWithId> {
    const parsedOffer = OfferInputParamsSchema.parse(offer);

    const chainId = await this.contractWrapper.getChainID();
    const currency = isNativeToken(parsedOffer.currencyContractAddress)
      ? NATIVE_TOKENS[chainId as SUPPORTED_CHAIN_ID].wrapped.address
      : parsedOffer.currencyContractAddress;

    const normalizedTotalPrice = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      parsedOffer.totalPrice,
      currency,
    );

    const overrides = await this.contractWrapper.getCallOverrides();
    await setErc20Allowance(
      this.contractWrapper,
      normalizedTotalPrice,
      currency,
      overrides,
    );

    const receipt = await this.contractWrapper.sendTransaction(
      "makeOffer",
      [
        {
          assetContract: parsedOffer.assetContractAddress,
          tokenId: parsedOffer.tokenId,
          quantity: parsedOffer.quantity,
          currency: currency,
          totalPrice: normalizedTotalPrice,
          expirationTimestamp: parsedOffer.endTimestamp,
        } as IOffers.OfferParamsStruct,
      ],
      {
        // Higher gas limit for create listing
        gasLimit: 500000,
      },
    );

    const event = this.contractWrapper.parseLogs<NewOfferEvent>(
      "NewOffer",
      receipt?.logs,
    );
    return {
      id: event[0].args.offerId,
      receipt,
    };
  }

  /**
   * Cancel Offer
   *
   * @remarks Cancel an offer on the marketplace
   *
   * @example
   * ```javascript
   * // The ID of the offer you want to cancel
   * const offerId = "0";
   *
   * await contract.offers.cancelOffer(offerId);
   * ```
   */
  public async cancelOffer(offerId: BigNumberish): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("cancelOffer", [
        offerId,
      ]),
    };
  }

  /**
   * Accept an offer
   *
   * @example
   * ```javascript
   * // The ID of the offer you want to accept
   * const offerId = 0;
   *
   * await contract.offers.acceptOffer(offerId);
   * ```
   *
   * @param offerId - The offer id
   */
  public async acceptOffer(offerId: BigNumberish): Promise<TransactionResult> {
    const offer = await this.validateOffer(BigNumber.from(offerId));
    const { valid, error } = await this.isStillValidOffer(offer);
    if (!valid) {
      throw new Error(`Offer ${offerId} is no longer valid. ${error}`);
    }
    const overrides = (await this.contractWrapper.getCallOverrides()) || {};

    await handleTokenApproval(
      this.contractWrapper,
      this.getAddress(),
      offer.assetContractAddress,
      offer.tokenId,
      await this.contractWrapper.getSignerAddress(),
    );

    return {
      receipt: await this.contractWrapper.sendTransaction(
        "acceptOffer",
        [offerId],
        overrides,
      ),
    };
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  /**
   * Throws error if offer could not be found
   *
   * @param offerId - offer to check for
   */
  private async validateOffer(offerId: BigNumber): Promise<OfferV3> {
    try {
      return await this.getOffer(offerId);
    } catch (err) {
      console.error(`Error getting the offer with id ${offerId}`);
      throw err;
    }
  }

  /**
   * Helper method maps the offer to the offer interface.
   *
   * @internal
   * @param offer - The offer to map, as returned from the contract.
   * @returns - The mapped interface.
   */
  public async mapOffer(offer: IOffers.OfferStruct): Promise<OfferV3> {
    return {
      id: offer.offerId.toString(),
      offerorAddress: offer.offeror,
      assetContractAddress: offer.assetContract,
      currencyContractAddress: offer.currency,
      tokenId: offer.tokenId,
      quantity: offer.quantity,
      totalPrice: offer.totalPrice,
      currencyValue: await fetchCurrencyValue(
        this.contractWrapper.getProvider(),
        offer.currency,
        offer.totalPrice,
      ),
      asset: await fetchTokenMetadataForContract(
        offer.assetContract,
        this.contractWrapper.getProvider(),
        offer.tokenId,
        this.storage,
      ),
      endTimeInSeconds: offer.expirationTimestamp,
    };
  }

  /**
   * Use this method to check if an offer is still valid.
   *
   * Ways an offer can become invalid:
   * 1. The offer has expired
   * 2. The offeror doesn't have enough balance of currency tokens
   * 3. The offeror removed the approval of currency tokens on the marketplace
   *
   * @internal
   * @param offer - The offer to check.
   * @returns - True if the offer is valid, false otherwise.
   */
  public async isStillValidOffer(
    offer: OfferV3,
  ): Promise<{ valid: boolean; error?: string }> {
    const now = BigNumber.from(Math.floor(Date.now() / 1000));
    if (now.gt(offer.endTimeInSeconds)) {
      return {
        valid: false,
        error: `Offer with ID ${offer.id} has expired`,
      };
    }
    const chainId = await this.contractWrapper.getChainID();
    const currency = isNativeToken(offer.currencyContractAddress)
      ? NATIVE_TOKENS[chainId as SUPPORTED_CHAIN_ID].wrapped.address
      : offer.currencyContractAddress;

    const provider = this.contractWrapper.getProvider();
    const erc20 = new ContractWrapper<IERC20>(provider, currency, ERC20Abi, {});

    const offerorBalance = await erc20.readContract.balanceOf(
      offer.offerorAddress,
    );
    if (offerorBalance.lt(offer.totalPrice)) {
      return {
        valid: false,
        error: `Offeror ${offer.offerorAddress} doesn't have enough balance of token ${currency}`,
      };
    }

    const offerorAllowance = await erc20.readContract.allowance(
      offer.offerorAddress,
      this.getAddress(),
    );
    if (offerorAllowance.lt(offer.totalPrice)) {
      return {
        valid: false,
        error: `Offeror ${offer.offerorAddress} hasn't approved enough amount of token ${currency}`,
      };
    }

    return {
      valid: true,
      error: "",
    };
  }

  private applyFilter(
    offers: IOffers.OfferStructOutput[],
    filter?: MarketplaceFilter,
  ) {
    let rawOffers = [...offers];

    if (filter) {
      if (filter.offeror) {
        rawOffers = rawOffers.filter(
          (offeror) =>
            offeror.offeror.toString().toLowerCase() ===
            filter?.offeror?.toString().toLowerCase(),
        );
      }
      if (filter.tokenContract) {
        rawOffers = rawOffers.filter(
          (tokenContract) =>
            tokenContract.assetContract.toString().toLowerCase() ===
            filter?.tokenContract?.toString().toLowerCase(),
        );
      }

      if (filter.tokenId !== undefined) {
        rawOffers = rawOffers.filter(
          (tokenContract) =>
            tokenContract.tokenId.toString() === filter?.tokenId?.toString(),
        );
      }
    }

    return filter?.count && filter.count < rawOffers.length
      ? rawOffers.slice(0, filter.count)
      : rawOffers;
  }
}
