import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "punkAttributes" function.
 */
export type PunkAttributesParams = {
  index: AbiParameterToPrimitiveType<{ type: "uint16"; name: "index" }>;
};

export const FN_SELECTOR = "0x76dfe297" as const;
const FN_INPUTS = [
  {
    type: "uint16",
    name: "index",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
    name: "text",
  },
] as const;

/**
 * Checks if the `punkAttributes` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `punkAttributes` method is supported.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { isPunkAttributesSupported } from "thirdweb/extensions/cryptopunks";
 *
 * const supported = await isPunkAttributesSupported(contract);
 * ```
 */
export async function isPunkAttributesSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "punkAttributes" function.
 * @param options - The options for the punkAttributes function.
 * @returns The encoded ABI parameters.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { encodePunkAttributesParams } "thirdweb/extensions/cryptopunks";
 * const result = encodePunkAttributesParams({
 *  index: ...,
 * });
 * ```
 */
export function encodePunkAttributesParams(options: PunkAttributesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.index]);
}

/**
 * Encodes the "punkAttributes" function into a Hex string with its parameters.
 * @param options - The options for the punkAttributes function.
 * @returns The encoded hexadecimal string.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { encodePunkAttributes } "thirdweb/extensions/cryptopunks";
 * const result = encodePunkAttributes({
 *  index: ...,
 * });
 * ```
 */
export function encodePunkAttributes(options: PunkAttributesParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePunkAttributesParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the punkAttributes function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { decodePunkAttributesResult } from "thirdweb/extensions/cryptopunks";
 * const result = decodePunkAttributesResult("...");
 * ```
 */
export function decodePunkAttributesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "punkAttributes" function on the contract.
 * @param options - The options for the punkAttributes function.
 * @returns The parsed result of the function call.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { punkAttributes } from "thirdweb/extensions/cryptopunks";
 *
 * const result = await punkAttributes({
 *  contract,
 *  index: ...,
 * });
 *
 * ```
 */
export async function punkAttributes(
  options: BaseTransactionOptions<PunkAttributesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.index],
  });
}
