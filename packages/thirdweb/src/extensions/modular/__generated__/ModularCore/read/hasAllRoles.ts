import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "hasAllRoles" function.
 */
export type HasAllRolesParams = {
  user: AbiParameterToPrimitiveType<{
    name: "user";
    type: "address";
    internalType: "address";
  }>;
  roles: AbiParameterToPrimitiveType<{
    name: "roles";
    type: "uint256";
    internalType: "uint256";
  }>;
};

export const FN_SELECTOR = "0x1cd64df4" as const;
const FN_INPUTS = [
  {
    name: "user",
    type: "address",
    internalType: "address",
  },
  {
    name: "roles",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "bool",
    internalType: "bool",
  },
] as const;

/**
 * Checks if the `hasAllRoles` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `hasAllRoles` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isHasAllRolesSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isHasAllRolesSupported(contract);
 * ```
 */
export async function isHasAllRolesSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "hasAllRoles" function.
 * @param options - The options for the hasAllRoles function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeHasAllRolesParams } "thirdweb/extensions/modular";
 * const result = encodeHasAllRolesParams({
 *  user: ...,
 *  roles: ...,
 * });
 * ```
 */
export function encodeHasAllRolesParams(options: HasAllRolesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.user, options.roles]);
}

/**
 * Encodes the "hasAllRoles" function into a Hex string with its parameters.
 * @param options - The options for the hasAllRoles function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeHasAllRoles } "thirdweb/extensions/modular";
 * const result = encodeHasAllRoles({
 *  user: ...,
 *  roles: ...,
 * });
 * ```
 */
export function encodeHasAllRoles(options: HasAllRolesParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeHasAllRolesParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the hasAllRoles function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeHasAllRolesResult } from "thirdweb/extensions/modular";
 * const result = decodeHasAllRolesResult("...");
 * ```
 */
export function decodeHasAllRolesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "hasAllRoles" function on the contract.
 * @param options - The options for the hasAllRoles function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { hasAllRoles } from "thirdweb/extensions/modular";
 *
 * const result = await hasAllRoles({
 *  contract,
 *  user: ...,
 *  roles: ...,
 * });
 *
 * ```
 */
export async function hasAllRoles(
  options: BaseTransactionOptions<HasAllRolesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.user, options.roles],
  });
}
