import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "isAdmin" function.
 */
export type IsAdminParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

export const FN_SELECTOR = "0x24d7806c" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "signer",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isAdmin` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `isAdmin` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isIsAdminSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isIsAdminSupported(contract);
 * ```
 */
export async function isIsAdminSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isAdmin" function.
 * @param options - The options for the isAdmin function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeIsAdminParams } "thirdweb/extensions/erc4337";
 * const result = encodeIsAdminParams({
 *  signer: ...,
 * });
 * ```
 */
export function encodeIsAdminParams(options: IsAdminParams) {
  return encodeAbiParameters(FN_INPUTS, [options.signer]);
}

/**
 * Encodes the "isAdmin" function into a Hex string with its parameters.
 * @param options - The options for the isAdmin function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeIsAdmin } "thirdweb/extensions/erc4337";
 * const result = encodeIsAdmin({
 *  signer: ...,
 * });
 * ```
 */
export function encodeIsAdmin(options: IsAdminParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsAdminParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isAdmin function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeIsAdminResult } from "thirdweb/extensions/erc4337";
 * const result = decodeIsAdminResult("...");
 * ```
 */
export function decodeIsAdminResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isAdmin" function on the contract.
 * @param options - The options for the isAdmin function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isAdmin } from "thirdweb/extensions/erc4337";
 *
 * const result = await isAdmin({
 *  contract,
 *  signer: ...,
 * });
 *
 * ```
 */
export async function isAdmin(options: BaseTransactionOptions<IsAdminParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.signer],
  });
}
