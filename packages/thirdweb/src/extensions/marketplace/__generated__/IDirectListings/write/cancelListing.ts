import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "cancelListing" function.
 */

export type CancelListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
};

export const FN_SELECTOR = "0x305a67a8" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_listingId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "cancelListing" function.
 * @param options - The options for the cancelListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCancelListingParams } "thirdweb/extensions/marketplace";
 * const result = encodeCancelListingParams({
 *  listingId: ...,
 * });
 * ```
 */
export function encodeCancelListingParams(options: CancelListingParams) {
  return encodeAbiParameters(FN_INPUTS, [options.listingId]);
}

/**
 * Calls the "cancelListing" function on the contract.
 * @param options - The options for the "cancelListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { cancelListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = cancelListing({
 *  contract,
 *  listingId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function cancelListing(
  options: BaseTransactionOptions<
    | CancelListingParams
    | {
        asyncParams: () => Promise<CancelListingParams>;
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
