import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

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
