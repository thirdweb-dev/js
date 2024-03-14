import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "register" function.
 */
export type RegisterParams = {
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
};

/**
 * Calls the "register" function on the contract.
 * @param options - The options for the "register" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { register } from "thirdweb/extensions/farcaster";
 *
 * const transaction = register({
 *  recovery: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function register(options: BaseTransactionOptions<RegisterParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x4420e486",
      [
        {
          type: "address",
          name: "recovery",
        },
      ],
      [
        {
          type: "uint256",
          name: "fid",
        },
        {
          type: "uint256",
          name: "overpayment",
        },
      ],
    ],
    params: [options.recovery],
  });
}
