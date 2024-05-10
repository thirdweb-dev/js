import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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
 * Checks if the `name` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `name` method is supported.
 * @extension ENS
 * @example
 * ```ts
 * import { isNameSupported } from "thirdweb/extensions/ens";
 *
 * const supported = await isNameSupported(contract);
 * ```
 */
export async function isNameSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

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
 * Encodes the "name" function into a Hex string with its parameters.
 * @param options - The options for the name function.
 * @returns The encoded hexadecimal string.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeName } "thirdweb/extensions/ens";
 * const result = encodeName({
 *  name: ...,
 * });
 * ```
 */
export function encodeName(options: NameParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeNameParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
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
 *  contract,
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
