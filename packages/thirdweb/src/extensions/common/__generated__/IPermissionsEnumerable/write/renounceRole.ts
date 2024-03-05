import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "renounceRole" function.
 */
export type RenounceRoleParams = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

/**
 * Calls the "renounceRole" function on the contract.
 * @param options - The options for the "renounceRole" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { renounceRole } from "thirdweb/extensions/common";
 *
 * const transaction = renounceRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function renounceRole(
  options: BaseTransactionOptions<RenounceRoleParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x36568abe",
      [
        {
          type: "bytes32",
          name: "role",
        },
        {
          type: "address",
          name: "account",
        },
      ],
      [],
    ],
    params: [options.role, options.account],
  });
}
