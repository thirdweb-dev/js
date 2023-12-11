import type { IERC20, IOffers, OffersLogic } from "@thirdweb-dev/contracts-js";
import { NewOfferEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/OffersLogic";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish } from "ethers";
import { fetchCurrencyValue } from "../../../../common/currency/fetchCurrencyValue";
import { isNativeToken } from "../../../../common/currency/isNativeToken";
import { normalizePriceValue } from "../../../../common/currency/normalizePriceValue";
import { setErc20Allowance } from "../../../../common/currency/setErc20Allowance";
import { resolveAddress } from "../../../../common/ens/resolveAddress";
import {
  getAllInBatches,
  handleTokenApproval,
} from "../../../../common/marketplace";
import { fetchTokenMetadataForContract } from "../../../../common/nft";
import { buildTransactionFunction } from "../../../../common/transactions";
import { SUPPORTED_CHAIN_ID } from "../../../../constants/chains/SUPPORTED_CHAIN_ID";
import { NATIVE_TOKENS } from "../../../../constants/currency";
import { FEATURE_OFFERS } from "../../../../constants/thirdweb-features";
import { Status } from "../../../../enums/marketplace/Status";
import {
  OfferInputParams,
  OfferInputParamsSchema,
} from "../../../../schema/marketplacev3/offer";
import type { MarketplaceFilterWithoutSeller } from "../../../../types/marketplace/MarketPlaceFilter";
import { OfferV3 } from "../../../../types/marketplacev3/OfferV3";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../../../types";
import { ContractEncoder } from "../../contract-encoder";
import { ContractEvents } from "../../contract-events";
import { ContractInterceptor } from "../../contract-interceptor";
import { ContractWrapper } from "../contract-wrapper";
import { GasCostEstimator } from "../../gas-cost-estimator";
import { Transaction } from "../../transactions";

/**
 * Handles marketplace offers
 * @public
 */
export class MarketplaceV3Offers<TContract extends OffersLogic>
  implements DetectableFeature
{
  featureName = FEATURE_OFFERS.name;
  private contractWrapper: ContractWrapper<OffersLogic>;
  private storage: ThirdwebStorage;

  // utilities
  public events: ContractEvents<OffersLogic>;
  public interceptor: ContractInterceptor<OffersLogic>;
  public encoder: ContractEncoder<OffersLogic>;
  public estimator: GasCostEstimator<OffersLogic>;

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
   * Get the total number of offers
   *
   * @returns Returns the total number of offers created.
   * @public
   *
   * @example
   * ```javascript
   * const totalOffers = await contract.offers.getTotalCount();
   * ```
   * @twfeature Offers
   */
  public async getTotalCount(): Promise<BigNumber> {
    return await this.contractWrapper.read("totalOffers", []);
  }

  /**
   * Get all offers
   *
   * @example
   * ```javascript
   * const offers = await contract.offers.getAll();
   * ```
   *
   * @param filter - optional filter parameters
   * @returns the Offer object array
   * @twfeature Offers
   */
  public async getAll(
    filter?: MarketplaceFilterWithoutSeller,
  ): Promise<OfferV3[]> {
    const totalOffers = await this.getTotalCount();

    const start = BigNumber.from(filter?.start || 0).toNumber();
    const end = totalOffers.toNumber();

    if (end === 0) {
      throw new Error(`No offers exist on the contract.`);
    }

    let rawOffers: IOffers.OfferStructOutput[] = [];
    const batches = await getAllInBatches(start, end, (startId, endId) =>
      this.contractWrapper.read("getAllOffers", [startId, endId]),
    );
    rawOffers = batches.flat();

    const filteredOffers = await this.applyFilter(rawOffers, filter);

    return await Promise.all(
      filteredOffers.map((offer) => this.mapOffer(offer)),
    );
  }

  /**
   * Get all valid offers
   *
   * @example
   * ```javascript
   * const offers = await contract.offers.getAllValid();
   * ```
   *
   * @param filter - optional filter parameters
   * @returns the Offer object array
   * @twfeature Offers
   */
  public async getAllValid(
    filter?: MarketplaceFilterWithoutSeller,
  ): Promise<OfferV3[]> {
    const totalOffers = await this.getTotalCount();

    const start = BigNumber.from(filter?.start || 0).toNumber();
    const end = totalOffers.toNumber();

    if (end === 0) {
      throw new Error(`No offers exist on the contract.`);
    }

    let rawOffers: IOffers.OfferStructOutput[] = [];
    const batches = await getAllInBatches(start, end, (startId, endId) =>
      this.contractWrapper.read("getAllValidOffers", [startId, endId]),
    );
    rawOffers = batches.flat();

    const filteredOffers = await this.applyFilter(rawOffers, filter);

    return await Promise.all(
      filteredOffers.map((offer) => this.mapOffer(offer)),
    );
  }

  /**
   * Get a single offer
   *
   * @example
   * ```javascript
   * const offerId = 0;
   * const offer = await contract.offers.getOffer(offerId);
   * ```
   *
   * @param offerId - the listing id
   * @returns the Direct listing object
   * @twfeature Offers
   */
  public async getOffer(offerId: BigNumberish): Promise<OfferV3> {
    const offer = await this.contractWrapper.read("getOffer", [offerId]);

    return await this.mapOffer(offer);
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Make an offer
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
   * @param offer - the offer data
   * @returns the transaction receipt and the id of the newly created offer
   * @twfeature Offers
   */
  makeOffer = /* @__PURE__ */ buildTransactionFunction(
    async (
      offer: OfferInputParams,
    ): Promise<Transaction<TransactionResultWithId>> => {
      const parsedOffer = await OfferInputParamsSchema.parseAsync(offer);

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

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "makeOffer",
        args: [
          {
            assetContract: parsedOffer.assetContractAddress,
            tokenId: parsedOffer.tokenId,
            quantity: parsedOffer.quantity,
            currency: currency,
            totalPrice: normalizedTotalPrice,
            expirationTimestamp: parsedOffer.endTimestamp,
          } as IOffers.OfferParamsStruct,
        ],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<NewOfferEvent>(
            "NewOffer",
            receipt?.logs,
          );
          return {
            id: event[0].args.offerId,
            receipt,
          };
        },
      });
    },
  );

  /**
   * Cancel an offer
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
   * @param offerId - the offer id
   * @returns the transaction receipt
   * @twfeature Offers
   */
  cancelOffer = /* @__PURE__ */ buildTransactionFunction(
    async (offerId: BigNumberish) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "cancelOffer",
        args: [offerId],
      });
    },
  );

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
   * @returns the transaction receipt
   * @twfeature Offers
   */
  acceptOffer = /* @__PURE__ */ buildTransactionFunction(
    async (offerId: BigNumberish) => {
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

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "acceptOffer",
        args: [offerId],
        overrides,
      });
    },
  );

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
  private async mapOffer(offer: IOffers.OfferStruct): Promise<OfferV3> {
    let status: Status = Status.UNSET;
    const block = await this.contractWrapper.getProvider().getBlock("latest");
    const blockTime = block.timestamp;
    switch (offer.status) {
      case 1:
        status = BigNumber.from(offer.expirationTimestamp).lt(blockTime)
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
      id: offer.offerId.toString(),
      offerorAddress: offer.offeror,
      assetContractAddress: offer.assetContract,
      currencyContractAddress: offer.currency,
      tokenId: offer.tokenId.toString(),
      quantity: offer.quantity.toString(),
      totalPrice: offer.totalPrice.toString(),
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
      endTimeInSeconds: BigNumber.from(offer.expirationTimestamp).toNumber(),
      status: status,
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
  private async isStillValidOffer(
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
    const ERC20Abi = (
      await import("@thirdweb-dev/contracts-js/dist/abis/IERC20.json")
    ).default;
    const erc20 = new ContractWrapper<IERC20>(
      provider,
      currency,
      ERC20Abi,
      {},
      this.storage,
    );

    const offerorBalance = await erc20.read("balanceOf", [
      offer.offerorAddress,
    ]);
    if (offerorBalance.lt(offer.totalPrice)) {
      return {
        valid: false,
        error: `Offeror ${offer.offerorAddress} doesn't have enough balance of token ${currency}`,
      };
    }

    const offerorAllowance = await erc20.read("allowance", [
      offer.offerorAddress,
      this.getAddress(),
    ]);
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

  private async applyFilter(
    offers: IOffers.OfferStructOutput[],
    filter?: MarketplaceFilterWithoutSeller,
  ) {
    let rawOffers = [...offers];

    if (filter) {
      if (filter.offeror) {
        const resolvedOfferor = await resolveAddress(filter.offeror);
        rawOffers = rawOffers.filter(
          (offeror) =>
            offeror.offeror.toString().toLowerCase() ===
            resolvedOfferor?.toString().toLowerCase(),
        );
      }
      if (filter.tokenContract) {
        const resolvedToken = await resolveAddress(filter.tokenContract);
        rawOffers = rawOffers.filter(
          (tokenContract) =>
            tokenContract.assetContract.toString().toLowerCase() ===
            resolvedToken?.toString().toLowerCase(),
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
