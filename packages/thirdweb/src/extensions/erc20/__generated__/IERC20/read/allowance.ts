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
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
  spender: AbiParameterToPrimitiveType<{ type: "address"; name: "spender" }>;
};

export const FN_SELECTOR = "0xdd62ed3e" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "owner",
  },
  {
    type: "address",
    name: "spender",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `allowance` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `allowance` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isAllowanceSupported } from "thirdweb/extensions/erc20";
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
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeAllowanceParams } "thirdweb/extensions/erc20";
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
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeAllowance } "thirdweb/extensions/erc20";
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
 * @extension ERC20
 * @example
 * ```ts
 * import { decodeAllowanceResult } from "thirdweb/extensions/erc20";
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
 * @extension ERC20
 * @example
 * ```ts
 * import { allowance } from "thirdweb/extensions/erc20";
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
