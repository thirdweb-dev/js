import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getPool" function.
 */
export type GetPoolParams = {
  tokenA: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenA" }>;
  tokenB: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenB" }>;
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
};

export const FN_SELECTOR = "0x1698ee82" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "tokenA",
  },
  {
    type: "address",
    name: "tokenB",
  },
  {
    type: "uint24",
    name: "fee",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "pool",
  },
] as const;

/**
 * Checks if the `getPool` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getPool` method is supported.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { isGetPoolSupported } from "thirdweb/extensions/uniswap";
 *
 * const supported = await isGetPoolSupported(contract);
 * ```
 */
export async function isGetPoolSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getPool" function.
 * @param options - The options for the getPool function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeGetPoolParams } "thirdweb/extensions/uniswap";
 * const result = encodeGetPoolParams({
 *  tokenA: ...,
 *  tokenB: ...,
 *  fee: ...,
 * });
 * ```
 */
export function encodeGetPoolParams(options: GetPoolParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenA,
    options.tokenB,
    options.fee,
  ]);
}

/**
 * Encodes the "getPool" function into a Hex string with its parameters.
 * @param options - The options for the getPool function.
 * @returns The encoded hexadecimal string.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeGetPool } "thirdweb/extensions/uniswap";
 * const result = encodeGetPool({
 *  tokenA: ...,
 *  tokenB: ...,
 *  fee: ...,
 * });
 * ```
 */
export function encodeGetPool(options: GetPoolParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetPoolParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getPool function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { decodeGetPoolResult } from "thirdweb/extensions/uniswap";
 * const result = decodeGetPoolResult("...");
 * ```
 */
export function decodeGetPoolResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getPool" function on the contract.
 * @param options - The options for the getPool function.
 * @returns The parsed result of the function call.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { getPool } from "thirdweb/extensions/uniswap";
 *
 * const result = await getPool({
 *  contract,
 *  tokenA: ...,
 *  tokenB: ...,
 *  fee: ...,
 * });
 *
 * ```
 */
export async function getPool(options: BaseTransactionOptions<GetPoolParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenA, options.tokenB, options.fee],
  });
}
