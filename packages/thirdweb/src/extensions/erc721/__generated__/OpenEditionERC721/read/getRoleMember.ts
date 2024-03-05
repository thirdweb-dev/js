import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getRoleMember" function.
 */
export type GetRoleMemberParams = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "index" }>;
};

/**
 * Calls the "getRoleMember" function on the contract.
 * @param options - The options for the getRoleMember function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { getRoleMember } from "thirdweb/extensions/erc721";
 *
 * const result = await getRoleMember({
 *  role: ...,
 *  index: ...,
 * });
 *
 * ```
 */
export async function getRoleMember(
  options: BaseTransactionOptions<GetRoleMemberParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x9010d07c",
      [
        {
          type: "bytes32",
          name: "role",
        },
        {
          type: "uint256",
          name: "index",
        },
      ],
      [
        {
          type: "address",
          name: "member",
        },
      ],
    ],
    params: [options.role, options.index],
  });
}
