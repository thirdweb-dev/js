import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "remove" function.
 */
export type RemoveParams = {
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
};

/**
 * Calls the "remove" function on the contract.
 * @param options - The options for the "remove" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { remove } from "thirdweb/extensions/farcaster";
 *
 * const transaction = remove({
 *  key: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function remove(options: BaseTransactionOptions<RemoveParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x58edef4c",
      [
        {
          type: "bytes",
          name: "key",
        },
      ],
      [],
    ],
    params: [options.key],
  });
}
