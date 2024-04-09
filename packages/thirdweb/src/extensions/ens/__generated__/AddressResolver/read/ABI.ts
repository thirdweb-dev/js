import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

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
