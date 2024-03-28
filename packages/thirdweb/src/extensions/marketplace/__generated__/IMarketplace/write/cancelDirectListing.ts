import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "cancelDirectListing" function.
 */

type CancelDirectListingParamsInternal = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
};

export type CancelDirectListingParams = Prettify<
  | CancelDirectListingParamsInternal
  | {
      asyncParams: () => Promise<CancelDirectListingParamsInternal>;
    }
>;
const FN_SELECTOR = "0x7506c84a" as const;
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
 * ```
 * import { encodeCancelDirectListingParams } "thirdweb/extensions/marketplace";
 * const result = encodeCancelDirectListingParams({
 *  listingId: ...,
 * });
 * ```
 */
export function encodeCancelDirectListingParams(
  options: CancelDirectListingParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.listingId]);
}

/**
 * Calls the "cancelDirectListing" function on the contract.
 * @param options - The options for the "cancelDirectListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { cancelDirectListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = cancelDirectListing({
 *  listingId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function cancelDirectListing(
  options: BaseTransactionOptions<CancelDirectListingParams>,
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
