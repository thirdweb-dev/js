import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "payee" function.
 */
export type PayeeParams = {
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "index" }>;
};

export const FN_SELECTOR = "0x8b83209b" as const;
const FN_INPUTS = [
  {
    name: "index",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `payee` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `payee` method is supported.
 * @extension SPLIT
 * @example
 * ```ts
 * import { isPayeeSupported } from "thirdweb/extensions/split";
 * const supported = isPayeeSupported(["0x..."]);
 * ```
 */
export function isPayeeSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "payee" function.
 * @param options - The options for the payee function.
 * @returns The encoded ABI parameters.
 * @extension SPLIT
 * @example
 * ```ts
 * import { encodePayeeParams } from "thirdweb/extensions/split";
 * const result = encodePayeeParams({
 *  index: ...,
 * });
 * ```
 */
export function encodePayeeParams(options: PayeeParams) {
  return encodeAbiParameters(FN_INPUTS, [options.index]);
}

/**
 * Encodes the "payee" function into a Hex string with its parameters.
 * @param options - The options for the payee function.
 * @returns The encoded hexadecimal string.
 * @extension SPLIT
 * @example
 * ```ts
 * import { encodePayee } from "thirdweb/extensions/split";
 * const result = encodePayee({
 *  index: ...,
 * });
 * ```
 */
export function encodePayee(options: PayeeParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePayeeParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the payee function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension SPLIT
 * @example
 * ```ts
 * import { decodePayeeResult } from "thirdweb/extensions/split";
 * const result = decodePayeeResultResult("...");
 * ```
 */
export function decodePayeeResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "payee" function on the contract.
 * @param options - The options for the payee function.
 * @returns The parsed result of the function call.
 * @extension SPLIT
 * @example
 * ```ts
 * import { payee } from "thirdweb/extensions/split";
 *
 * const result = await payee({
 *  contract,
 *  index: ...,
 * });
 *
 * ```
 */
export async function payee(options: BaseTransactionOptions<PayeeParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.index],
  });
}
