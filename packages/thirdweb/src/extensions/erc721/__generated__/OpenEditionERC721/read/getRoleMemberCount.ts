import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getRoleMemberCount" function.
 */
export type GetRoleMemberCountParams = {
  role: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "role";
    type: "bytes32";
  }>;
};

/**
 * Calls the "getRoleMemberCount" function on the contract.
 * @param options - The options for the getRoleMemberCount function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { getRoleMemberCount } from "thirdweb/extensions/erc721";
 *
 * const result = await getRoleMemberCount({
 *  role: ...,
 * });
 *
 * ```
 */
export async function getRoleMemberCount(
  options: BaseTransactionOptions<GetRoleMemberCountParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xca15c873",
      [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "count",
          type: "uint256",
        },
      ],
    ],
    params: [options.role],
  });
}
