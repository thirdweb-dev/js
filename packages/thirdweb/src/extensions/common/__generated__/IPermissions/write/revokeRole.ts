import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "revokeRole" function.
 */

type RevokeRoleParamsInternal = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export type RevokeRoleParams = Prettify<
  | RevokeRoleParamsInternal
  | {
      asyncParams: () => Promise<RevokeRoleParamsInternal>;
    }
>;
const METHOD = [
  "0xd547741f",
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
] as const;

/**
 * Calls the "revokeRole" function on the contract.
 * @param options - The options for the "revokeRole" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { revokeRole } from "thirdweb/extensions/common";
 *
 * const transaction = revokeRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function revokeRole(options: BaseTransactionOptions<RevokeRoleParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.role, resolvedParams.account] as const;
          }
        : [options.role, options.account],
  });
}
