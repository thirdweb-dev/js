import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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
 * Checks if the `resolve` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `resolve` method is supported.
 * @extension ENS
 * @example
 * ```ts
 * import { isResolveSupported } from "thirdweb/extensions/ens";
 *
 * const supported = await isResolveSupported(contract);
 * ```
 */
export async function isResolveSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

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
 * Encodes the "resolve" function into a Hex string with its parameters.
 * @param options - The options for the resolve function.
 * @returns The encoded hexadecimal string.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeResolve } "thirdweb/extensions/ens";
 * const result = encodeResolve({
 *  name: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeResolve(options: ResolveParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeResolveParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
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
 *  contract,
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
