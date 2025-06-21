import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isValidSignature" function.
 */
export type IsValidSignatureParams = {
  hash: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "hash" }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
};

export const FN_SELECTOR = "0x1626ba7e" as const;
const FN_INPUTS = [
  {
    name: "hash",
    type: "bytes32",
  },
  {
    name: "signature",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes4",
  },
] as const;

/**
 * Checks if the `isValidSignature` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isValidSignature` method is supported.
 * @extension ERC1271
 * @example
 * ```ts
 * import { isIsValidSignatureSupported } from "thirdweb/extensions/erc1271";
 * const supported = isIsValidSignatureSupported(["0x..."]);
 * ```
 */
export function isIsValidSignatureSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isValidSignature" function.
 * @param options - The options for the isValidSignature function.
 * @returns The encoded ABI parameters.
 * @extension ERC1271
 * @example
 * ```ts
 * import { encodeIsValidSignatureParams } from "thirdweb/extensions/erc1271";
 * const result = encodeIsValidSignatureParams({
 *  hash: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeIsValidSignatureParams(options: IsValidSignatureParams) {
  return encodeAbiParameters(FN_INPUTS, [options.hash, options.signature]);
}

/**
 * Encodes the "isValidSignature" function into a Hex string with its parameters.
 * @param options - The options for the isValidSignature function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1271
 * @example
 * ```ts
 * import { encodeIsValidSignature } from "thirdweb/extensions/erc1271";
 * const result = encodeIsValidSignature({
 *  hash: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeIsValidSignature(options: IsValidSignatureParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsValidSignatureParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isValidSignature function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1271
 * @example
 * ```ts
 * import { decodeIsValidSignatureResult } from "thirdweb/extensions/erc1271";
 * const result = decodeIsValidSignatureResultResult("...");
 * ```
 */
export function decodeIsValidSignatureResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isValidSignature" function on the contract.
 * @param options - The options for the isValidSignature function.
 * @returns The parsed result of the function call.
 * @extension ERC1271
 * @example
 * ```ts
 * import { isValidSignature } from "thirdweb/extensions/erc1271";
 *
 * const result = await isValidSignature({
 *  contract,
 *  hash: ...,
 *  signature: ...,
 * });
 *
 * ```
 */
export async function isValidSignature(
  options: BaseTransactionOptions<IsValidSignatureParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.hash, options.signature],
  });
}
