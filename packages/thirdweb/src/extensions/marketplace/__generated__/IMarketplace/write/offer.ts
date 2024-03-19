import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "offer" function.
 */

type OfferParamsInternal = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  quantityWanted: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_quantityWanted";
  }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
  pricePerToken: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_pricePerToken";
  }>;
  expirationTimestamp: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_expirationTimestamp";
  }>;
};

export type OfferParams = Prettify<
  | OfferParamsInternal
  | {
      asyncParams: () => Promise<OfferParamsInternal>;
    }
>;
/**
 * Calls the "offer" function on the contract.
 * @param options - The options for the "offer" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { offer } from "thirdweb/extensions/marketplace";
 *
 * const transaction = offer({
 *  listingId: ...,
 *  quantityWanted: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  expirationTimestamp: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function offer(options: BaseTransactionOptions<OfferParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x5fef45e7",
      [
        {
          type: "uint256",
          name: "_listingId",
        },
        {
          type: "uint256",
          name: "_quantityWanted",
        },
        {
          type: "address",
          name: "_currency",
        },
        {
          type: "uint256",
          name: "_pricePerToken",
        },
        {
          type: "uint256",
          name: "_expirationTimestamp",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [
          resolvedParams.listingId,
          resolvedParams.quantityWanted,
          resolvedParams.currency,
          resolvedParams.pricePerToken,
          resolvedParams.expirationTimestamp,
        ] as const;
      }

      return [
        options.listingId,
        options.quantityWanted,
        options.currency,
        options.pricePerToken,
        options.expirationTimestamp,
      ] as const;
    },
  });
}
