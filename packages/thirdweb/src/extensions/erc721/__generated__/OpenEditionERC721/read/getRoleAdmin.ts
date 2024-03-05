import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getRoleAdmin" function.
 */
export type GetRoleAdminParams = {
  role: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "role";
    type: "bytes32";
  }>;
};

/**
 * Calls the "getRoleAdmin" function on the contract.
 * @param options - The options for the getRoleAdmin function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { getRoleAdmin } from "thirdweb/extensions/erc721";
 *
 * const result = await getRoleAdmin({
 *  role: ...,
 * });
 *
 * ```
 */
export async function getRoleAdmin(
  options: BaseTransactionOptions<GetRoleAdminParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x248a9ca3",
      [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
    ],
    params: [options.role],
  });
}
