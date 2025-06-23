import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isAdmin" function.
 */
export type IsAdminParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

export const FN_SELECTOR = "0x24d7806c" as const;
const FN_INPUTS = [
  {
    name: "signer",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isAdmin` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isAdmin` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isIsAdminSupported } from "thirdweb/extensions/erc4337";
 * const supported = isIsAdminSupported(["0x..."]);
 * ```
 */
export function isIsAdminSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
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
 * import { encodeIsAdminParams } from "thirdweb/extensions/erc4337";
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
 * import { encodeIsAdmin } from "thirdweb/extensions/erc4337";
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
 * const result = decodeIsAdminResultResult("...");
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
