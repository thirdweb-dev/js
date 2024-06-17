import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "isRegistered" function.
 */
export type IsRegisteredParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0xc3c5a547" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "account",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isRegistered` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `isRegistered` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isIsRegisteredSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isIsRegisteredSupported(contract);
 * ```
 */
export async function isIsRegisteredSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isRegistered" function.
 * @param options - The options for the isRegistered function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeIsRegisteredParams } "thirdweb/extensions/erc4337";
 * const result = encodeIsRegisteredParams({
 *  account: ...,
 * });
 * ```
 */
export function encodeIsRegisteredParams(options: IsRegisteredParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account]);
}

/**
 * Encodes the "isRegistered" function into a Hex string with its parameters.
 * @param options - The options for the isRegistered function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeIsRegistered } "thirdweb/extensions/erc4337";
 * const result = encodeIsRegistered({
 *  account: ...,
 * });
 * ```
 */
export function encodeIsRegistered(options: IsRegisteredParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsRegisteredParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isRegistered function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeIsRegisteredResult } from "thirdweb/extensions/erc4337";
 * const result = decodeIsRegisteredResult("...");
 * ```
 */
export function decodeIsRegisteredResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isRegistered" function on the contract.
 * @param options - The options for the isRegistered function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isRegistered } from "thirdweb/extensions/erc4337";
 *
 * const result = await isRegistered({
 *  contract,
 *  account: ...,
 * });
 *
 * ```
 */
export async function isRegistered(
  options: BaseTransactionOptions<IsRegisteredParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.account],
  });
}
