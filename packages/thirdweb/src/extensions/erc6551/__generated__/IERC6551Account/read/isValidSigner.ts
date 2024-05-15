import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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
    type: "address",
    name: "signer",
  },
  {
    type: "bytes",
    name: "context",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes4",
    name: "magicValue",
  },
] as const;

/**
 * Checks if the `isValidSigner` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `isValidSigner` method is supported.
 * @extension ERC6551
 * @example
 * ```ts
 * import { isIsValidSignerSupported } from "thirdweb/extensions/erc6551";
 *
 * const supported = await isIsValidSignerSupported(contract);
 * ```
 */
export async function isIsValidSignerSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
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
 * import { encodeIsValidSignerParams } "thirdweb/extensions/erc6551";
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
 * import { encodeIsValidSigner } "thirdweb/extensions/erc6551";
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
 * const result = decodeIsValidSignerResult("...");
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
