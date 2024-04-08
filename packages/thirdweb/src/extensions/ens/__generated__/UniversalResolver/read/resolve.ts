import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "resolve" function.
 */
export type ResolveParams = {
  name: AbiParameterToPrimitiveType<{ type: "bytes"; name: "name" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

export const FN_SELECTOR = "0x9061b923" as const;
const FN_INPUTS = [
  {
    type: "bytes",
    name: "name",
  },
  {
    type: "bytes",
    name: "data",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes",
  },
  {
    type: "address",
  },
] as const;

/**
 * Encodes the parameters for the "resolve" function.
 * @param options - The options for the resolve function.
 * @returns The encoded ABI parameters.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeResolveParams } "thirdweb/extensions/ens";
 * const result = encodeResolveParams({
 *  name: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeResolveParams(options: ResolveParams) {
  return encodeAbiParameters(FN_INPUTS, [options.name, options.data]);
}

/**
 * Decodes the result of the resolve function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ENS
 * @example
 * ```ts
 * import { decodeResolveResult } from "thirdweb/extensions/ens";
 * const result = decodeResolveResult("...");
 * ```
 */
export function decodeResolveResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "resolve" function on the contract.
 * @param options - The options for the resolve function.
 * @returns The parsed result of the function call.
 * @extension ENS
 * @example
 * ```ts
 * import { resolve } from "thirdweb/extensions/ens";
 *
 * const result = await resolve({
 *  name: ...,
 *  data: ...,
 * });
 *
 * ```
 */
export async function resolve(options: BaseTransactionOptions<ResolveParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.name, options.data],
  });
}
