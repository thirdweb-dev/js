import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isModuleInstalled" function.
 */
export type IsModuleInstalledParams = {
  moduleTypeId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "moduleTypeId";
  }>;
  module: AbiParameterToPrimitiveType<{ type: "address"; name: "module" }>;
  additionalContext: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "additionalContext";
  }>;
};

export const FN_SELECTOR = "0x112d3a7d" as const;
const FN_INPUTS = [
  {
    name: "moduleTypeId",
    type: "uint256",
  },
  {
    name: "module",
    type: "address",
  },
  {
    name: "additionalContext",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isModuleInstalled` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isModuleInstalled` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isIsModuleInstalledSupported } from "thirdweb/extensions/erc7579";
 * const supported = isIsModuleInstalledSupported(["0x..."]);
 * ```
 */
export function isIsModuleInstalledSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isModuleInstalled" function.
 * @param options - The options for the isModuleInstalled function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeIsModuleInstalledParams } from "thirdweb/extensions/erc7579";
 * const result = encodeIsModuleInstalledParams({
 *  moduleTypeId: ...,
 *  module: ...,
 *  additionalContext: ...,
 * });
 * ```
 */
export function encodeIsModuleInstalledParams(
  options: IsModuleInstalledParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.moduleTypeId,
    options.module,
    options.additionalContext,
  ]);
}

/**
 * Encodes the "isModuleInstalled" function into a Hex string with its parameters.
 * @param options - The options for the isModuleInstalled function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeIsModuleInstalled } from "thirdweb/extensions/erc7579";
 * const result = encodeIsModuleInstalled({
 *  moduleTypeId: ...,
 *  module: ...,
 *  additionalContext: ...,
 * });
 * ```
 */
export function encodeIsModuleInstalled(options: IsModuleInstalledParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsModuleInstalledParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isModuleInstalled function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decodeIsModuleInstalledResult } from "thirdweb/extensions/erc7579";
 * const result = decodeIsModuleInstalledResultResult("...");
 * ```
 */
export function decodeIsModuleInstalledResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isModuleInstalled" function on the contract.
 * @param options - The options for the isModuleInstalled function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isModuleInstalled } from "thirdweb/extensions/erc7579";
 *
 * const result = await isModuleInstalled({
 *  contract,
 *  moduleTypeId: ...,
 *  module: ...,
 *  additionalContext: ...,
 * });
 *
 * ```
 */
export async function isModuleInstalled(
  options: BaseTransactionOptions<IsModuleInstalledParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.moduleTypeId, options.module, options.additionalContext],
  });
}
