import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getEthBalance" function.
 */
export type GetEthBalanceParams = {
  addr: AbiParameterToPrimitiveType<{ type: "address"; name: "addr" }>;
};

export const FN_SELECTOR = "0x4d2301cc" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "addr",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "balance",
  },
] as const;

/**
 * Checks if the `getEthBalance` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getEthBalance` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isGetEthBalanceSupported } from "thirdweb/extensions/multicall3";
 * const supported = isGetEthBalanceSupported(["0x..."]);
 * ```
 */
export function isGetEthBalanceSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getEthBalance" function.
 * @param options - The options for the getEthBalance function.
 * @returns The encoded ABI parameters.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { encodeGetEthBalanceParams } from "thirdweb/extensions/multicall3";
 * const result = encodeGetEthBalanceParams({
 *  addr: ...,
 * });
 * ```
 */
export function encodeGetEthBalanceParams(options: GetEthBalanceParams) {
  return encodeAbiParameters(FN_INPUTS, [options.addr]);
}

/**
 * Encodes the "getEthBalance" function into a Hex string with its parameters.
 * @param options - The options for the getEthBalance function.
 * @returns The encoded hexadecimal string.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { encodeGetEthBalance } from "thirdweb/extensions/multicall3";
 * const result = encodeGetEthBalance({
 *  addr: ...,
 * });
 * ```
 */
export function encodeGetEthBalance(options: GetEthBalanceParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetEthBalanceParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getEthBalance function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { decodeGetEthBalanceResult } from "thirdweb/extensions/multicall3";
 * const result = decodeGetEthBalanceResultResult("...");
 * ```
 */
export function decodeGetEthBalanceResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getEthBalance" function on the contract.
 * @param options - The options for the getEthBalance function.
 * @returns The parsed result of the function call.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { getEthBalance } from "thirdweb/extensions/multicall3";
 *
 * const result = await getEthBalance({
 *  contract,
 *  addr: ...,
 * });
 *
 * ```
 */
export async function getEthBalance(
  options: BaseTransactionOptions<GetEthBalanceParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.addr],
  });
}
