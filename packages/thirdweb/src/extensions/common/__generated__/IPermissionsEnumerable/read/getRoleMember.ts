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

const METHOD = [
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
    },
  ],
] as const;

/**
 * Calls the "getRoleMember" function on the contract.
 * @param options - The options for the getRoleMember function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```
 * import { getRoleMember } from "thirdweb/extensions/common";
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
    method: METHOD,
    params: [options.role, options.index],
  });
}
