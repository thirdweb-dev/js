import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "approveBuyerForListing" function.
 */

export type ApproveBuyerForListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  buyer: AbiParameterToPrimitiveType<{ type: "address"; name: "_buyer" }>;
  toApprove: AbiParameterToPrimitiveType<{ type: "bool"; name: "_toApprove" }>;
};

export const FN_SELECTOR = "0x48dd77df" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_listingId",
  },
  {
    type: "address",
    name: "_buyer",
  },
  {
    type: "bool",
    name: "_toApprove",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "approveBuyerForListing" function.
 * @param options - The options for the approveBuyerForListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeApproveBuyerForListingParams } "thirdweb/extensions/marketplace";
 * const result = encodeApproveBuyerForListingParams({
 *  listingId: ...,
 *  buyer: ...,
 *  toApprove: ...,
 * });
 * ```
 */
export function encodeApproveBuyerForListingParams(
  options: ApproveBuyerForListingParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.listingId,
    options.buyer,
    options.toApprove,
  ]);
}

/**
 * Calls the "approveBuyerForListing" function on the contract.
 * @param options - The options for the "approveBuyerForListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { approveBuyerForListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = approveBuyerForListing({
 *  contract,
 *  listingId: ...,
 *  buyer: ...,
 *  toApprove: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function approveBuyerForListing(
  options: BaseTransactionOptions<
    | ApproveBuyerForListingParams
    | {
        asyncParams: () => Promise<ApproveBuyerForListingParams>;
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
              resolvedParams.buyer,
              resolvedParams.toApprove,
            ] as const;
          }
        : [options.listingId, options.buyer, options.toApprove],
  });
}
