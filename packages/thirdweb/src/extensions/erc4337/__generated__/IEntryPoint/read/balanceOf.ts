import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "balanceOf" function.
 */
export type BalanceOfParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0x70a08231" as const;
const FN_INPUTS = [
  {
    name: "account",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `balanceOf` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `balanceOf` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isBalanceOfSupported } from "thirdweb/extensions/erc4337";
 * const supported = isBalanceOfSupported(["0x..."]);
 * ```
 */
export function isBalanceOfSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "balanceOf" function.
 * @param options - The options for the balanceOf function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeBalanceOfParams } from "thirdweb/extensions/erc4337";
 * const result = encodeBalanceOfParams({
 *  account: ...,
 * });
 * ```
 */
export function encodeBalanceOfParams(options: BalanceOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account]);
}

/**
 * Encodes the "balanceOf" function into a Hex string with its parameters.
 * @param options - The options for the balanceOf function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeBalanceOf } from "thirdweb/extensions/erc4337";
 * const result = encodeBalanceOf({
 *  account: ...,
 * });
 * ```
 */
export function encodeBalanceOf(options: BalanceOfParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeBalanceOfParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the balanceOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeBalanceOfResult } from "thirdweb/extensions/erc4337";
 * const result = decodeBalanceOfResultResult("...");
 * ```
 */
export function decodeBalanceOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "balanceOf" function on the contract.
 * @param options - The options for the balanceOf function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { balanceOf } from "thirdweb/extensions/erc4337";
 *
 * const result = await balanceOf({
 *  contract,
 *  account: ...,
 * });
 *
 * ```
 */
export async function balanceOf(
  options: BaseTransactionOptions<BalanceOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.account],
  });
}
