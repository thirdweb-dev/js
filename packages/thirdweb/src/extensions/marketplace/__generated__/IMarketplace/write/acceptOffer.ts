import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "acceptOffer" function.
 */

type AcceptOfferParamsInternal = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  offeror: AbiParameterToPrimitiveType<{ type: "address"; name: "_offeror" }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
  totalPrice: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_totalPrice";
  }>;
};

export type AcceptOfferParams = Prettify<
  | AcceptOfferParamsInternal
  | {
      asyncParams: () => Promise<AcceptOfferParamsInternal>;
    }
>;
/**
 * Calls the "acceptOffer" function on the contract.
 * @param options - The options for the "acceptOffer" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { acceptOffer } from "thirdweb/extensions/marketplace";
 *
 * const transaction = acceptOffer({
 *  listingId: ...,
 *  offeror: ...,
 *  currency: ...,
 *  totalPrice: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function acceptOffer(
  options: BaseTransactionOptions<AcceptOfferParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xb13c0e63",
      [
        {
          type: "uint256",
          name: "_listingId",
        },
        {
          type: "address",
          name: "_offeror",
        },
        {
          type: "address",
          name: "_currency",
        },
        {
          type: "uint256",
          name: "_totalPrice",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [
          resolvedParams.listingId,
          resolvedParams.offeror,
          resolvedParams.currency,
          resolvedParams.totalPrice,
        ] as const;
      }

      return [
        options.listingId,
        options.offeror,
        options.currency,
        options.totalPrice,
      ] as const;
    },
  });
}
