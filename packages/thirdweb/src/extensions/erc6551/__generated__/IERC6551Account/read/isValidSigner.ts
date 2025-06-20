import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isValidSigner" function.
 */
export type IsValidSignerParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
  context: AbiParameterToPrimitiveType<{ type: "bytes"; name: "context" }>;
};

export const FN_SELECTOR = "0x523e3260" as const;
const FN_INPUTS = [
  {
    name: "signer",
    type: "address",
  },
  {
    name: "context",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "magicValue",
    type: "bytes4",
  },
] as const;

/**
 * Checks if the `isValidSigner` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isValidSigner` method is supported.
 * @extension ERC6551
 * @example
 * ```ts
 * import { isIsValidSignerSupported } from "thirdweb/extensions/erc6551";
 * const supported = isIsValidSignerSupported(["0x..."]);
 * ```
 */
export function isIsValidSignerSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isValidSigner" function.
 * @param options - The options for the isValidSigner function.
 * @returns The encoded ABI parameters.
 * @extension ERC6551
 * @example
 * ```ts
 * import { encodeIsValidSignerParams } from "thirdweb/extensions/erc6551";
 * const result = encodeIsValidSignerParams({
 *  signer: ...,
 *  context: ...,
 * });
 * ```
 */
export function encodeIsValidSignerParams(options: IsValidSignerParams) {
  return encodeAbiParameters(FN_INPUTS, [options.signer, options.context]);
}

/**
 * Encodes the "isValidSigner" function into a Hex string with its parameters.
 * @param options - The options for the isValidSigner function.
 * @returns The encoded hexadecimal string.
 * @extension ERC6551
 * @example
 * ```ts
 * import { encodeIsValidSigner } from "thirdweb/extensions/erc6551";
 * const result = encodeIsValidSigner({
 *  signer: ...,
 *  context: ...,
 * });
 * ```
 */
export function encodeIsValidSigner(options: IsValidSignerParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsValidSignerParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isValidSigner function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC6551
 * @example
 * ```ts
 * import { decodeIsValidSignerResult } from "thirdweb/extensions/erc6551";
 * const result = decodeIsValidSignerResultResult("...");
 * ```
 */
export function decodeIsValidSignerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isValidSigner" function on the contract.
 * @param options - The options for the isValidSigner function.
 * @returns The parsed result of the function call.
 * @extension ERC6551
 * @example
 * ```ts
 * import { isValidSigner } from "thirdweb/extensions/erc6551";
 *
 * const result = await isValidSigner({
 *  contract,
 *  signer: ...,
 *  context: ...,
 * });
 *
 * ```
 */
export async function isValidSigner(
  options: BaseTransactionOptions<IsValidSignerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.signer, options.context],
  });
}
