import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "delegates" function.
 */
export type DelegatesParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0x587cde1e" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "account",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `delegates` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `delegates` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isDelegatesSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = await isDelegatesSupported(contract);
 * ```
 */
export async function isDelegatesSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "delegates" function.
 * @param options - The options for the delegates function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeDelegatesParams } "thirdweb/extensions/erc20";
 * const result = encodeDelegatesParams({
 *  account: ...,
 * });
 * ```
 */
export function encodeDelegatesParams(options: DelegatesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account]);
}

/**
 * Encodes the "delegates" function into a Hex string with its parameters.
 * @param options - The options for the delegates function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeDelegates } "thirdweb/extensions/erc20";
 * const result = encodeDelegates({
 *  account: ...,
 * });
 * ```
 */
export function encodeDelegates(options: DelegatesParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDelegatesParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the delegates function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC20
 * @example
 * ```ts
 * import { decodeDelegatesResult } from "thirdweb/extensions/erc20";
 * const result = decodeDelegatesResult("...");
 * ```
 */
export function decodeDelegatesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "delegates" function on the contract.
 * @param options - The options for the delegates function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```ts
 * import { delegates } from "thirdweb/extensions/erc20";
 *
 * const result = await delegates({
 *  contract,
 *  account: ...,
 * });
 *
 * ```
 */
export async function delegates(
  options: BaseTransactionOptions<DelegatesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.account],
  });
}
