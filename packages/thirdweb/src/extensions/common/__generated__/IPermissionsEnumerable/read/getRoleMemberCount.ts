import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getRoleMemberCount" function.
 */
export type GetRoleMemberCountParams = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
};

const METHOD = [
  "0xca15c873",
  [
    {
      type: "bytes32",
      name: "role",
    },
  ],
  [
    {
      type: "uint256",
    },
  ],
] as const;

/**
 * Calls the "getRoleMemberCount" function on the contract.
 * @param options - The options for the getRoleMemberCount function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```
 * import { getRoleMemberCount } from "thirdweb/extensions/common";
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
    method: METHOD,
    params: [options.role],
  });
}
