import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "batchRent" function.
 */
export type BatchRentParams = {
  fids: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "fids" }>;
  units: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "units" }>;
};

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
    method: [
      "0xa82c356e",
      [
        {
          type: "uint256[]",
          name: "fids",
        },
        {
          type: "uint256[]",
          name: "units",
        },
      ],
      [],
    ],
    params: [options.fids, options.units],
  });
}
