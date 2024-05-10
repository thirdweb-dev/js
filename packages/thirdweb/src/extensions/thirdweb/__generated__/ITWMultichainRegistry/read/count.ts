import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "count" function.
 */
export type CountParams = {
  deployer: AbiParameterToPrimitiveType<{ type: "address"; name: "_deployer" }>;
};

export const FN_SELECTOR = "0x05d85eda" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_deployer",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "deploymentCount",
  },
] as const;

/**
 * Checks if the `count` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `count` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isCountSupported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = await isCountSupported(contract);
 * ```
 */
export async function isCountSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "count" function.
 * @param options - The options for the count function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeCountParams } "thirdweb/extensions/thirdweb";
 * const result = encodeCountParams({
 *  deployer: ...,
 * });
 * ```
 */
export function encodeCountParams(options: CountParams) {
  return encodeAbiParameters(FN_INPUTS, [options.deployer]);
}

/**
 * Encodes the "count" function into a Hex string with its parameters.
 * @param options - The options for the count function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeCount } "thirdweb/extensions/thirdweb";
 * const result = encodeCount({
 *  deployer: ...,
 * });
 * ```
 */
export function encodeCount(options: CountParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCountParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the count function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeCountResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeCountResult("...");
 * ```
 */
export function decodeCountResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "count" function on the contract.
 * @param options - The options for the count function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { count } from "thirdweb/extensions/thirdweb";
 *
 * const result = await count({
 *  contract,
 *  deployer: ...,
 * });
 *
 * ```
 */
export async function count(options: BaseTransactionOptions<CountParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.deployer],
  });
}
