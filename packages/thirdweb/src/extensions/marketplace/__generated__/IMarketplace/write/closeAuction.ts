import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "closeAuction" function.
 */

type CloseAuctionParamsInternal = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  closeFor: AbiParameterToPrimitiveType<{ type: "address"; name: "_closeFor" }>;
};

export type CloseAuctionParams = Prettify<
  | CloseAuctionParamsInternal
  | {
      asyncParams: () => Promise<CloseAuctionParamsInternal>;
    }
>;
const FN_SELECTOR = "0x6bab66ae" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_listingId",
  },
  {
    type: "address",
    name: "_closeFor",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "closeAuction" function.
 * @param options - The options for the closeAuction function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { encodeCloseAuctionParams } "thirdweb/extensions/marketplace";
 * const result = encodeCloseAuctionParams({
 *  listingId: ...,
 *  closeFor: ...,
 * });
 * ```
 */
export function encodeCloseAuctionParams(options: CloseAuctionParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [options.listingId, options.closeFor]);
}

/**
 * Calls the "closeAuction" function on the contract.
 * @param options - The options for the "closeAuction" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { closeAuction } from "thirdweb/extensions/marketplace";
 *
 * const transaction = closeAuction({
 *  listingId: ...,
 *  closeFor: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function closeAuction(
  options: BaseTransactionOptions<CloseAuctionParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.listingId, resolvedParams.closeFor] as const;
          }
        : [options.listingId, options.closeFor],
  });
}
