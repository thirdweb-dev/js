import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "punkImage" function.
 */
export type PunkImageParams = {
  index: AbiParameterToPrimitiveType<{ type: "uint16"; name: "index" }>;
};

export const FN_SELECTOR = "0x3e5e0a96" as const;
const FN_INPUTS = [
  {
    type: "uint16",
    name: "index",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes",
  },
] as const;

/**
 * Checks if the `punkImage` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `punkImage` method is supported.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { isPunkImageSupported } from "thirdweb/extensions/cryptopunks";
 *
 * const supported = await isPunkImageSupported(contract);
 * ```
 */
export async function isPunkImageSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "punkImage" function.
 * @param options - The options for the punkImage function.
 * @returns The encoded ABI parameters.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { encodePunkImageParams } "thirdweb/extensions/cryptopunks";
 * const result = encodePunkImageParams({
 *  index: ...,
 * });
 * ```
 */
export function encodePunkImageParams(options: PunkImageParams) {
  return encodeAbiParameters(FN_INPUTS, [options.index]);
}

/**
 * Encodes the "punkImage" function into a Hex string with its parameters.
 * @param options - The options for the punkImage function.
 * @returns The encoded hexadecimal string.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { encodePunkImage } "thirdweb/extensions/cryptopunks";
 * const result = encodePunkImage({
 *  index: ...,
 * });
 * ```
 */
export function encodePunkImage(options: PunkImageParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePunkImageParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the punkImage function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { decodePunkImageResult } from "thirdweb/extensions/cryptopunks";
 * const result = decodePunkImageResult("...");
 * ```
 */
export function decodePunkImageResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "punkImage" function on the contract.
 * @param options - The options for the punkImage function.
 * @returns The parsed result of the function call.
 * @extension CRYPTOPUNKS
 * @example
 * ```ts
 * import { punkImage } from "thirdweb/extensions/cryptopunks";
 *
 * const result = await punkImage({
 *  contract,
 *  index: ...,
 * });
 *
 * ```
 */
export async function punkImage(
  options: BaseTransactionOptions<PunkImageParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.index],
  });
}
