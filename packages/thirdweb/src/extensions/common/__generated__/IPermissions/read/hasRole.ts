import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "hasRole" function.
 */
export type HasRoleParams = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

/**
 * Calls the "hasRole" function on the contract.
 * @param options - The options for the hasRole function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```
 * import { hasRole } from "thirdweb/extensions/common";
 *
 * const result = await hasRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * ```
 */
export async function hasRole(options: BaseTransactionOptions<HasRoleParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0x91d14854",
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
      [
        {
          type: "bool",
        },
      ],
    ],
    params: [options.role, options.account],
  });
}
