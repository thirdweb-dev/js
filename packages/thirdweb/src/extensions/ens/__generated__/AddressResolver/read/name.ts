import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "name" function.
 */
export type NameParams = {
  name: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "name" }>;
};

export const FN_SELECTOR = "0x691f3431" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "name",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Encodes the parameters for the "name" function.
 * @param options - The options for the name function.
 * @returns The encoded ABI parameters.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeNameParams } "thirdweb/extensions/ens";
 * const result = encodeNameParams({
 *  name: ...,
 * });
 * ```
 */
export function encodeNameParams(options: NameParams) {
  return encodeAbiParameters(FN_INPUTS, [options.name]);
}

/**
 * Decodes the result of the name function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ENS
 * @example
 * ```ts
 * import { decodeNameResult } from "thirdweb/extensions/ens";
 * const result = decodeNameResult("...");
 * ```
 */
export function decodeNameResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "name" function on the contract.
 * @param options - The options for the name function.
 * @returns The parsed result of the function call.
 * @extension ENS
 * @example
 * ```ts
 * import { name } from "thirdweb/extensions/ens";
 *
 * const result = await name({
 *  name: ...,
 * });
 *
 * ```
 */
export async function name(options: BaseTransactionOptions<NameParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.name],
  });
}
