import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "hasRole" function.
 */
export type HasRoleParams = {
  role: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "role";
    type: "bytes32";
  }>;
  account: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "account";
    type: "address";
  }>;
};

/**
 * Calls the "hasRole" function on the contract.
 * @param options - The options for the hasRole function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { hasRole } from "thirdweb/extensions/erc721";
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
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [options.role, options.account],
  });
}
