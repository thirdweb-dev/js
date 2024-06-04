import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "allowance" function.
 */
export type AllowanceParams = {
  owner: AbiParameterToPrimitiveType<{
    name: "owner";
    type: "address";
    internalType: "address";
  }>;
  spender: AbiParameterToPrimitiveType<{
    name: "spender";
    type: "address";
    internalType: "address";
  }>;
};

export const FN_SELECTOR = "0xdd62ed3e" as const;
const FN_INPUTS = [
  {
    name: "owner",
    type: "address",
    internalType: "address",
  },
  {
    name: "spender",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "result",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Checks if the `allowance` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `allowance` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isAllowanceSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isAllowanceSupported(contract);
 * ```
 */
export async function isAllowanceSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "allowance" function.
 * @param options - The options for the allowance function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeAllowanceParams } "thirdweb/extensions/modular";
 * const result = encodeAllowanceParams({
 *  owner: ...,
 *  spender: ...,
 * });
 * ```
 */
export function encodeAllowanceParams(options: AllowanceParams) {
  return encodeAbiParameters(FN_INPUTS, [options.owner, options.spender]);
}

/**
 * Encodes the "allowance" function into a Hex string with its parameters.
 * @param options - The options for the allowance function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeAllowance } "thirdweb/extensions/modular";
 * const result = encodeAllowance({
 *  owner: ...,
 *  spender: ...,
 * });
 * ```
 */
export function encodeAllowance(options: AllowanceParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAllowanceParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the allowance function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeAllowanceResult } from "thirdweb/extensions/modular";
 * const result = decodeAllowanceResult("...");
 * ```
 */
export function decodeAllowanceResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "allowance" function on the contract.
 * @param options - The options for the allowance function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { allowance } from "thirdweb/extensions/modular";
 *
 * const result = await allowance({
 *  contract,
 *  owner: ...,
 *  spender: ...,
 * });
 *
 * ```
 */
export async function allowance(
  options: BaseTransactionOptions<AllowanceParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owner, options.spender],
  });
}
