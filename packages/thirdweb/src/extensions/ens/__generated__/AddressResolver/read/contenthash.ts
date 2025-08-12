import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "contenthash" function.
 */
export type ContenthashParams = {
  name: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "name" }>;
};

export const FN_SELECTOR = "0xbc1c58d1" as const;
const FN_INPUTS = [
  {
    name: "name",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes",
  },
] as const;

/**
 * Checks if the `contenthash` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `contenthash` method is supported.
 * @extension ENS
 * @example
 * ```ts
 * import { isContenthashSupported } from "thirdweb/extensions/ens";
 * const supported = isContenthashSupported(["0x..."]);
 * ```
 */
export function isContenthashSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "contenthash" function.
 * @param options - The options for the contenthash function.
 * @returns The encoded ABI parameters.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeContenthashParams } from "thirdweb/extensions/ens";
 * const result = encodeContenthashParams({
 *  name: ...,
 * });
 * ```
 */
export function encodeContenthashParams(options: ContenthashParams) {
  return encodeAbiParameters(FN_INPUTS, [options.name]);
}

/**
 * Encodes the "contenthash" function into a Hex string with its parameters.
 * @param options - The options for the contenthash function.
 * @returns The encoded hexadecimal string.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeContenthash } from "thirdweb/extensions/ens";
 * const result = encodeContenthash({
 *  name: ...,
 * });
 * ```
 */
export function encodeContenthash(options: ContenthashParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeContenthashParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the contenthash function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ENS
 * @example
 * ```ts
 * import { decodeContenthashResult } from "thirdweb/extensions/ens";
 * const result = decodeContenthashResultResult("...");
 * ```
 */
export function decodeContenthashResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "contenthash" function on the contract.
 * @param options - The options for the contenthash function.
 * @returns The parsed result of the function call.
 * @extension ENS
 * @example
 * ```ts
 * import { contenthash } from "thirdweb/extensions/ens";
 *
 * const result = await contenthash({
 *  contract,
 *  name: ...,
 * });
 *
 * ```
 */
export async function contenthash(
  options: BaseTransactionOptions<ContenthashParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.name],
  });
}
