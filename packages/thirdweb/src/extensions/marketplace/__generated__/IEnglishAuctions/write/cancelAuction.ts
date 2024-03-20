import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "cancelAuction" function.
 */

type CancelAuctionParamsInternal = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
};

export type CancelAuctionParams = Prettify<
  | CancelAuctionParamsInternal
  | {
      asyncParams: () => Promise<CancelAuctionParamsInternal>;
    }
>;
const FN_SELECTOR = "0x96b5a755" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_auctionId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "cancelAuction" function.
 * @param options - The options for the cancelAuction function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { encodeCancelAuctionParams } "thirdweb/extensions/marketplace";
 * const result = encodeCancelAuctionParams({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeCancelAuctionParams(
  options: CancelAuctionParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId]);
}

/**
 * Calls the "cancelAuction" function on the contract.
 * @param options - The options for the "cancelAuction" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { cancelAuction } from "thirdweb/extensions/marketplace";
 *
 * const transaction = cancelAuction({
 *  auctionId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function cancelAuction(
  options: BaseTransactionOptions<CancelAuctionParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.auctionId] as const;
          }
        : [options.auctionId],
  });
}
