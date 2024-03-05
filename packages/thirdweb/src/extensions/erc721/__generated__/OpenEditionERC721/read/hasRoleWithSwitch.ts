import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "hasRoleWithSwitch" function.
 */
export type HasRoleWithSwitchParams = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

/**
 * Calls the "hasRoleWithSwitch" function on the contract.
 * @param options - The options for the hasRoleWithSwitch function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { hasRoleWithSwitch } from "thirdweb/extensions/erc721";
 *
 * const result = await hasRoleWithSwitch({
 *  role: ...,
 *  account: ...,
 * });
 *
 * ```
 */
export async function hasRoleWithSwitch(
  options: BaseTransactionOptions<HasRoleWithSwitchParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xa32fa5b3",
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
