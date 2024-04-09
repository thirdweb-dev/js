import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "batchRent" function.
 */

export type BatchRentParams = {
  fids: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "fids" }>;
  units: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "units" }>;
};

export const FN_SELECTOR = "0xa82c356e" as const;
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
 * ```ts
 * import { encodeBatchRentParams } "thirdweb/extensions/farcaster";
 * const result = encodeBatchRentParams({
 *  fids: ...,
 *  units: ...,
 * });
 * ```
 */
export function encodeBatchRentParams(options: BatchRentParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fids, options.units]);
}

/**
 * Calls the "batchRent" function on the contract.
 * @param options - The options for the "batchRent" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { batchRent } from "thirdweb/extensions/farcaster";
 *
 * const transaction = batchRent({
 *  contract,
 *  fids: ...,
 *  units: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function batchRent(
  options: BaseTransactionOptions<
    | BatchRentParams
    | {
        asyncParams: () => Promise<BatchRentParams>;
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
            return [resolvedParams.fids, resolvedParams.units] as const;
          }
        : [options.fids, options.units],
  });
}
