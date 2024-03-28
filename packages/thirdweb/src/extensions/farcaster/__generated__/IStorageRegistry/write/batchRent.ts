import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "batchRent" function.
 */

type BatchRentParamsInternal = {
  fids: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "fids" }>;
  units: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "units" }>;
};

export type BatchRentParams = Prettify<
  | BatchRentParamsInternal
  | {
      asyncParams: () => Promise<BatchRentParamsInternal>;
    }
>;
const FN_SELECTOR = "0xa82c356e" as const;
const FN_INPUTS = [
  {
    type: "uint256[]",
    name: "fids",
  },
  {
    type: "uint256[]",
    name: "units",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "batchRent" function.
 * @param options - The options for the batchRent function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```
 * import { encodeBatchRentParams } "thirdweb/extensions/farcaster";
 * const result = encodeBatchRentParams({
 *  fids: ...,
 *  units: ...,
 * });
 * ```
 */
export function encodeBatchRentParams(options: BatchRentParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [options.fids, options.units]);
}

/**
 * Calls the "batchRent" function on the contract.
 * @param options - The options for the "batchRent" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { batchRent } from "thirdweb/extensions/farcaster";
 *
 * const transaction = batchRent({
 *  fids: ...,
 *  units: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function batchRent(options: BaseTransactionOptions<BatchRentParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.fids, resolvedParams.units] as const;
          }
        : [options.fids, options.units],
  });
}
