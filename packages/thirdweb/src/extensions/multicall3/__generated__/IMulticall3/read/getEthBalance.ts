import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getEthBalance" function.
 */
export type GetEthBalanceParams = {
  addr: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "addr";
    type: "address";
  }>;
};

export const FN_SELECTOR = "0x4d2301cc" as const;
const FN_INPUTS = [
  {
    internalType: "address",
    name: "addr",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    internalType: "uint256",
    name: "balance",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getEthBalance` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getEthBalance` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isGetEthBalanceSupported } from "thirdweb/extensions/multicall3";
 *
 * const supported = await isGetEthBalanceSupported(contract);
 * ```
 */
export async function isGetEthBalanceSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
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
 * import { encodeGetEthBalanceParams } "thirdweb/extensions/multicall3";
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
 * import { encodeGetEthBalance } "thirdweb/extensions/multicall3";
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
 * const result = decodeGetEthBalanceResult("...");
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
