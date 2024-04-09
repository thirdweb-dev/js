import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "grantRole" function.
 */

export type GrantRoleParams = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0x2f2ff15d" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "role",
  },
  {
    type: "address",
    name: "account",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "grantRole" function.
 * @param options - The options for the grantRole function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeGrantRoleParams } "thirdweb/extensions/common";
 * const result = encodeGrantRoleParams({
 *  role: ...,
 *  account: ...,
 * });
 * ```
 */
export function encodeGrantRoleParams(options: GrantRoleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.role, options.account]);
}

/**
 * Calls the "grantRole" function on the contract.
 * @param options - The options for the "grantRole" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { grantRole } from "thirdweb/extensions/common";
 *
 * const transaction = grantRole({
 *  contract,
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function grantRole(
  options: BaseTransactionOptions<
    | GrantRoleParams
    | {
        asyncParams: () => Promise<GrantRoleParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.role, resolvedParams.account] as const;
          }
        : [options.role, options.account],
  });
}
