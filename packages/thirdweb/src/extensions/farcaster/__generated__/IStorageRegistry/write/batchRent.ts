import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

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
const METHOD = [
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
] as const;

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
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.fids, resolvedParams.units] as const;
          }
        : [options.fids, options.units],
  });
}
