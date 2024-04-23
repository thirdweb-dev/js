import type { Address } from "abitype";
import { isNativeTokenAddress } from "../../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { makeOffer as makeOfferGenerated } from "../../__generated__/IOffers/write/makeOffer.js";

export type MakeOfferParams = {
  /**
   * The address of the asset contract to offer on.
   */
  assetContractAddress: Address;
  /**
   * The ID of the token to make an offer for.
   */
  tokenId: bigint;
  /**
   * The address of the currency contract to make an offer with. (ERC20 or native token address)
   */
  currencyContractAddress: Address;
  /**
   * The datetime when the offer expires.
   */
  offerExpiresAt: Date;
  /**
   * The quantity of the asset to make an offer for.
   * @default 1
   */
  quantity?: bigint;
} & (
  | {
      /**
       * The total offer amount for the NFT(s) in wei.
       */
      totalOfferWei: bigint;
    }
  | {
      /**
       * The total offer amount for the NFT(s) in the currency's "Ether" unit
       */
      totalOffer: string;
    }
);

/**
 * Makes an offer for any asset (ERC721 or ERC1155).
 *
 * @param options - The options for making the offer.
 * @returns A transaction object that can be sent to make the offer.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { makeOffer } from "thirdweb/extensions/marketplace";
 *
 * const offerTx = makeOffer({
 *  contract,
 *  assetContractAddress: "0x1234567890123456789012345678901234567890",
 *  tokenId: 1n,
 *  currencyContractAddress: "0x1234567890123456789012345678901234567890",
 *  offerExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
 *  totalOffer: "1.0",
 * });
 * ```
 *
 */
export function makeOffer(options: BaseTransactionOptions<MakeOfferParams>) {
  return makeOfferGenerated({
    contract: options.contract,
    asyncParams: async () => {
      const [normalizedPrice, currency] = await Promise.all([
        (async () => {
          // if we already have the bid amount in wei, use that
          if ("totalOfferWei" in options) {
            return options.totalOfferWei;
          }
          // otherwise load the utility function and convert the amount
          const { convertErc20Amount } = await import(
            "../../../../utils/extensions/convert-erc20-amount.js"
          );
          return await convertErc20Amount({
            amount: options.totalOffer,
            chain: options.contract.chain,
            erc20Address: options.currencyContractAddress,
            client: options.contract.client,
          });
        })(),
        (async () => {
          // if it's not a native token address offer -> simply return the currency address
          if (!isNativeTokenAddress(options.currencyContractAddress)) {
            return options.currencyContractAddress;
          }
          // otherwise determine the wrapped native token address for the chain

          // TODO: add known wrapped native token addresses for each chain on the chain config

          const { getDeployedInfraContract } = await import(
            "../../../../contract/deployment/utils/infra.js"
          );
          // predict the address for the wrapped token
          const WETH9 = await getDeployedInfraContract({
            chain: options.contract.chain,
            client: options.contract.client,
            constructorParams: [],
            contractId: "WETH9",
          });

          if (!WETH9?.address) {
            throw new Error(
              "WETH9 contract not found on the chain, how did the marketplace get deployed in the first place?",
            );
          }
          return WETH9.address;
        })(),
      ]);

      const expirationTimestamp = BigInt(
        Math.floor(options.offerExpiresAt.getTime() / 1000),
      );

      return {
        params: {
          assetContract: options.assetContractAddress,
          currency,
          expirationTimestamp,
          quantity: options.quantity ?? 1n,
          tokenId: options.tokenId,
          totalPrice: normalizedPrice,
        },
      };
    },
  });
}
