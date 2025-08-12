import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isWildcardSigner" function.
 */
export type IsWildcardSignerParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

export const FN_SELECTOR = "0x16c258a7" as const;
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
 * Checks if the `isWildcardSigner` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isWildcardSigner` method is supported.
 * @extension ERC7702
 * @example
 * ```ts
 * import { isIsWildcardSignerSupported } from "thirdweb/extensions/erc7702";
 * const supported = isIsWildcardSignerSupported(["0x..."]);
 * ```
 */
export function isIsWildcardSignerSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isWildcardSigner" function.
 * @param options - The options for the isWildcardSigner function.
 * @returns The encoded ABI parameters.
 * @extension ERC7702
 * @example
 * ```ts
 * import { encodeIsWildcardSignerParams } from "thirdweb/extensions/erc7702";
 * const result = encodeIsWildcardSignerParams({
 *  signer: ...,
 * });
 * ```
 */
export function encodeIsWildcardSignerParams(options: IsWildcardSignerParams) {
  return encodeAbiParameters(FN_INPUTS, [options.signer]);
}

/**
 * Encodes the "isWildcardSigner" function into a Hex string with its parameters.
 * @param options - The options for the isWildcardSigner function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7702
 * @example
 * ```ts
 * import { encodeIsWildcardSigner } from "thirdweb/extensions/erc7702";
 * const result = encodeIsWildcardSigner({
 *  signer: ...,
 * });
 * ```
 */
export function encodeIsWildcardSigner(options: IsWildcardSignerParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsWildcardSignerParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isWildcardSigner function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7702
 * @example
 * ```ts
 * import { decodeIsWildcardSignerResult } from "thirdweb/extensions/erc7702";
 * const result = decodeIsWildcardSignerResultResult("...");
 * ```
 */
export function decodeIsWildcardSignerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isWildcardSigner" function on the contract.
 * @param options - The options for the isWildcardSigner function.
 * @returns The parsed result of the function call.
 * @extension ERC7702
 * @example
 * ```ts
 * import { isWildcardSigner } from "thirdweb/extensions/erc7702";
 *
 * const result = await isWildcardSigner({
 *  contract,
 *  signer: ...,
 * });
 *
 * ```
 */
export async function isWildcardSigner(
  options: BaseTransactionOptions<IsWildcardSignerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.signer],
  });
}
