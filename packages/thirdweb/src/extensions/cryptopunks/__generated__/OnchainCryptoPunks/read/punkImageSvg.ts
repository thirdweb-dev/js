import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "punkImageSvg" function.
 */
export type PunkImageSvgParams = {
  index: AbiParameterToPrimitiveType<{ type: "uint16"; name: "index" }>;
};

export const FN_SELECTOR = "0x74beb047" as const;
const FN_INPUTS = [
  {
    type: "uint16",
    name: "index",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
    name: "svg",
  },
] as const;

/**
 * Checks if the `punkImageSvg` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `punkImageSvg` method is supported.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { isPunkImageSvgSupported } from "thirdweb/extensions/cryptopunks";
 *
 * const supported = await isPunkImageSvgSupported(contract);
 * ```
 */
export async function isPunkImageSvgSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "punkImageSvg" function.
 * @param options - The options for the punkImageSvg function.
 * @returns The encoded ABI parameters.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { encodePunkImageSvgParams } "thirdweb/extensions/cryptopunks";
 * const result = encodePunkImageSvgParams({
 *  index: ...,
 * });
 * ```
 */
export function encodePunkImageSvgParams(options: PunkImageSvgParams) {
  return encodeAbiParameters(FN_INPUTS, [options.index]);
}

/**
 * Encodes the "punkImageSvg" function into a Hex string with its parameters.
 * @param options - The options for the punkImageSvg function.
 * @returns The encoded hexadecimal string.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { encodePunkImageSvg } "thirdweb/extensions/cryptopunks";
 * const result = encodePunkImageSvg({
 *  index: ...,
 * });
 * ```
 */
export function encodePunkImageSvg(options: PunkImageSvgParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePunkImageSvgParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the punkImageSvg function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { decodePunkImageSvgResult } from "thirdweb/extensions/cryptopunks";
 * const result = decodePunkImageSvgResult("...");
 * ```
 */
export function decodePunkImageSvgResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "punkImageSvg" function on the contract.
 * @param options - The options for the punkImageSvg function.
 * @returns The parsed result of the function call.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { punkImageSvg } from "thirdweb/extensions/cryptopunks";
 *
 * const result = await punkImageSvg({
 *  contract,
 *  index: ...,
 * });
 *
 * ```
 */
export async function punkImageSvg(
  options: BaseTransactionOptions<PunkImageSvgParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.index],
  });
}
