import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

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
const FN_SELECTOR = "0xb13c0e63" as const;
const FN_INPUTS = [
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
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "acceptOffer" function.
 * @param options - The options for the acceptOffer function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { encodeAcceptOfferParams } "thirdweb/extensions/marketplace";
 * const result = encodeAcceptOfferParams({
 *  listingId: ...,
 *  offeror: ...,
 *  currency: ...,
 *  totalPrice: ...,
 * });
 * ```
 */
export function encodeAcceptOfferParams(options: AcceptOfferParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [
    options.listingId,
    options.offeror,
    options.currency,
    options.totalPrice,
  ]);
}

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
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.listingId,
              resolvedParams.offeror,
              resolvedParams.currency,
              resolvedParams.totalPrice,
            ] as const;
          }
        : [
            options.listingId,
            options.offeror,
            options.currency,
            options.totalPrice,
          ],
  });
}
