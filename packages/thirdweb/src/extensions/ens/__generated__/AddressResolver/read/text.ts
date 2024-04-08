import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "text" function.
 */
export type TextParams = {
  name: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "name" }>;
  key: AbiParameterToPrimitiveType<{ type: "string"; name: "key" }>;
};

export const FN_SELECTOR = "0x59d1d43c" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "name",
  },
  {
    type: "string",
    name: "key",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Encodes the parameters for the "text" function.
 * @param options - The options for the text function.
 * @returns The encoded ABI parameters.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeTextParams } "thirdweb/extensions/ens";
 * const result = encodeTextParams({
 *  name: ...,
 *  key: ...,
 * });
 * ```
 */
export function encodeTextParams(options: TextParams) {
  return encodeAbiParameters(FN_INPUTS, [options.name, options.key]);
}

/**
 * Decodes the result of the text function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ENS
 * @example
 * ```ts
 * import { decodeTextResult } from "thirdweb/extensions/ens";
 * const result = decodeTextResult("...");
 * ```
 */
export function decodeTextResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "text" function on the contract.
 * @param options - The options for the text function.
 * @returns The parsed result of the function call.
 * @extension ENS
 * @example
 * ```ts
 * import { text } from "thirdweb/extensions/ens";
 *
 * const result = await text({
 *  name: ...,
 *  key: ...,
 * });
 *
 * ```
 */
export async function text(options: BaseTransactionOptions<TextParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.name, options.key],
  });
}
