import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "cancelDirectListing" function.
 */

export type CancelDirectListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
};

export const FN_SELECTOR = "0x7506c84a" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_listingId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "cancelDirectListing" function.
 * @param options - The options for the cancelDirectListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCancelDirectListingParams } "thirdweb/extensions/marketplace";
 * const result = encodeCancelDirectListingParams({
 *  listingId: ...,
 * });
 * ```
 */
export function encodeCancelDirectListingParams(
  options: CancelDirectListingParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.listingId]);
}

/**
 * Calls the "cancelDirectListing" function on the contract.
 * @param options - The options for the "cancelDirectListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { cancelDirectListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = cancelDirectListing({
 *  contract,
 *  listingId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function cancelDirectListing(
  options: BaseTransactionOptions<
    | CancelDirectListingParams
    | {
        asyncParams: () => Promise<CancelDirectListingParams>;
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
            return [resolvedParams.listingId] as const;
          }
        : [options.listingId],
  });
}
