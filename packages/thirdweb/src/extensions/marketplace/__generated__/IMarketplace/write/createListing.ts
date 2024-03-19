import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "createListing" function.
 */

type CreateListingParamsInternal = {
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_params";
    components: [
      { type: "address"; name: "assetContract" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "startTime" },
      { type: "uint256"; name: "secondsUntilEndTime" },
      { type: "uint256"; name: "quantityToList" },
      { type: "address"; name: "currencyToAccept" },
      { type: "uint256"; name: "reservePricePerToken" },
      { type: "uint256"; name: "buyoutPricePerToken" },
      { type: "uint8"; name: "listingType" },
    ];
  }>;
};

export type CreateListingParams = Prettify<
  | CreateListingParamsInternal
  | {
      asyncParams: () => Promise<CreateListingParamsInternal>;
    }
>;
/**
 * Calls the "createListing" function on the contract.
 * @param options - The options for the "createListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { createListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = createListing({
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createListing(
  options: BaseTransactionOptions<CreateListingParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x296f4e16",
      [
        {
          type: "tuple",
          name: "_params",
          components: [
            {
              type: "address",
              name: "assetContract",
            },
            {
              type: "uint256",
              name: "tokenId",
            },
            {
              type: "uint256",
              name: "startTime",
            },
            {
              type: "uint256",
              name: "secondsUntilEndTime",
            },
            {
              type: "uint256",
              name: "quantityToList",
            },
            {
              type: "address",
              name: "currencyToAccept",
            },
            {
              type: "uint256",
              name: "reservePricePerToken",
            },
            {
              type: "uint256",
              name: "buyoutPricePerToken",
            },
            {
              type: "uint8",
              name: "listingType",
            },
          ],
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.params] as const;
      }

      return [options.params] as const;
    },
  });
}
