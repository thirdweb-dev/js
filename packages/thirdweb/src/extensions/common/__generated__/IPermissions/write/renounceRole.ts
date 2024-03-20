import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "renounceRole" function.
 */

type RenounceRoleParamsInternal = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export type RenounceRoleParams = Prettify<
  | RenounceRoleParamsInternal
  | {
      asyncParams: () => Promise<RenounceRoleParamsInternal>;
    }
>;
const FN_SELECTOR = "0x36568abe" as const;
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
 * Encodes the parameters for the "renounceRole" function.
 * @param options - The options for the renounceRole function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```
 * import { encodeRenounceRoleParams } "thirdweb/extensions/common";
 * const result = encodeRenounceRoleParams({
 *  role: ...,
 *  account: ...,
 * });
 * ```
 */
export function encodeRenounceRoleParams(options: RenounceRoleParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [options.role, options.account]);
}

/**
 * Calls the "renounceRole" function on the contract.
 * @param options - The options for the "renounceRole" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { renounceRole } from "thirdweb/extensions/common";
 *
 * const transaction = renounceRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function renounceRole(
  options: BaseTransactionOptions<RenounceRoleParams>,
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
