import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "buyFromListing" function.
 */

export type BuyFromListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  buyFor: AbiParameterToPrimitiveType<{ type: "address"; name: "_buyFor" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
  expectedTotalPrice: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_expectedTotalPrice";
  }>;
};

export const FN_SELECTOR = "0x704232dc" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_listingId",
  },
  {
    type: "address",
    name: "_buyFor",
  },
  {
    type: "uint256",
    name: "_quantity",
  },
  {
    type: "address",
    name: "_currency",
  },
  {
    type: "uint256",
    name: "_expectedTotalPrice",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "buyFromListing" function.
 * @param options - The options for the buyFromListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeBuyFromListingParams } "thirdweb/extensions/marketplace";
 * const result = encodeBuyFromListingParams({
 *  listingId: ...,
 *  buyFor: ...,
 *  quantity: ...,
 *  currency: ...,
 *  expectedTotalPrice: ...,
 * });
 * ```
 */
export function encodeBuyFromListingParams(options: BuyFromListingParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.listingId,
    options.buyFor,
    options.quantity,
    options.currency,
    options.expectedTotalPrice,
  ]);
}

/**
 * Calls the "buyFromListing" function on the contract.
 * @param options - The options for the "buyFromListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { buyFromListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = buyFromListing({
 *  contract,
 *  listingId: ...,
 *  buyFor: ...,
 *  quantity: ...,
 *  currency: ...,
 *  expectedTotalPrice: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function buyFromListing(
  options: BaseTransactionOptions<
    | BuyFromListingParams
    | {
        asyncParams: () => Promise<BuyFromListingParams>;
      }
  >,
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
              resolvedParams.buyFor,
              resolvedParams.quantity,
              resolvedParams.currency,
              resolvedParams.expectedTotalPrice,
            ] as const;
          }
        : [
            options.listingId,
            options.buyFor,
            options.quantity,
            options.currency,
            options.expectedTotalPrice,
          ],
  });
}
