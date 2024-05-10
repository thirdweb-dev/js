import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "ABI" function.
 */
export type ABIParams = {
  name: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "name" }>;
  contentTypes: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "contentTypes";
  }>;
};

export const FN_SELECTOR = "0x2203ab56" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "name",
  },
  {
    type: "uint256",
    name: "contentTypes",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
  {
    type: "bytes",
  },
] as const;

/**
 * Checks if the `ABI` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `ABI` method is supported.
 * @extension ENS
 * @example
 * ```ts
 * import { isABISupported } from "thirdweb/extensions/ens";
 *
 * const supported = await isABISupported(contract);
 * ```
 */
export async function isABISupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "ABI" function.
 * @param options - The options for the ABI function.
 * @returns The encoded ABI parameters.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeABIParams } "thirdweb/extensions/ens";
 * const result = encodeABIParams({
 *  name: ...,
 *  contentTypes: ...,
 * });
 * ```
 */
export function encodeABIParams(options: ABIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.name, options.contentTypes]);
}

/**
 * Encodes the "ABI" function into a Hex string with its parameters.
 * @param options - The options for the ABI function.
 * @returns The encoded hexadecimal string.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeABI } "thirdweb/extensions/ens";
 * const result = encodeABI({
 *  name: ...,
 *  contentTypes: ...,
 * });
 * ```
 */
export function encodeABI(options: ABIParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeABIParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the ABI function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ENS
 * @example
 * ```ts
 * import { decodeABIResult } from "thirdweb/extensions/ens";
 * const result = decodeABIResult("...");
 * ```
 */
export function decodeABIResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "ABI" function on the contract.
 * @param options - The options for the ABI function.
 * @returns The parsed result of the function call.
 * @extension ENS
 * @example
 * ```ts
 * import { ABI } from "thirdweb/extensions/ens";
 *
 * const result = await ABI({
 *  contract,
 *  name: ...,
 *  contentTypes: ...,
 * });
 *
 * ```
 */
export async function ABI(options: BaseTransactionOptions<ABIParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.name, options.contentTypes],
  });
}
