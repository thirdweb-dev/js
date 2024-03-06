import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "grantRole" function.
 */
export type GrantRoleParams = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

/**
 * Calls the "grantRole" function on the contract.
 * @param options - The options for the "grantRole" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { grantRole } from "thirdweb/extensions/common";
 *
 * const transaction = grantRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function grantRole(options: BaseTransactionOptions<GrantRoleParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x2f2ff15d",
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
