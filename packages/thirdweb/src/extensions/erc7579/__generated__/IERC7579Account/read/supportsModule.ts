import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "supportsModule" function.
 */
export type SupportsModuleParams = {
  moduleTypeId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "moduleTypeId";
  }>;
};

export const FN_SELECTOR = "0xf2dc691d" as const;
const FN_INPUTS = [
  {
    name: "moduleTypeId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `supportsModule` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `supportsModule` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isSupportsModuleSupported } from "thirdweb/extensions/erc7579";
 * const supported = isSupportsModuleSupported(["0x..."]);
 * ```
 */
export function isSupportsModuleSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "supportsModule" function.
 * @param options - The options for the supportsModule function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeSupportsModuleParams } from "thirdweb/extensions/erc7579";
 * const result = encodeSupportsModuleParams({
 *  moduleTypeId: ...,
 * });
 * ```
 */
export function encodeSupportsModuleParams(options: SupportsModuleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.moduleTypeId]);
}

/**
 * Encodes the "supportsModule" function into a Hex string with its parameters.
 * @param options - The options for the supportsModule function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeSupportsModule } from "thirdweb/extensions/erc7579";
 * const result = encodeSupportsModule({
 *  moduleTypeId: ...,
 * });
 * ```
 */
export function encodeSupportsModule(options: SupportsModuleParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSupportsModuleParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the supportsModule function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decodeSupportsModuleResult } from "thirdweb/extensions/erc7579";
 * const result = decodeSupportsModuleResultResult("...");
 * ```
 */
export function decodeSupportsModuleResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "supportsModule" function on the contract.
 * @param options - The options for the supportsModule function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { supportsModule } from "thirdweb/extensions/erc7579";
 *
 * const result = await supportsModule({
 *  contract,
 *  moduleTypeId: ...,
 * });
 *
 * ```
 */
export async function supportsModule(
  options: BaseTransactionOptions<SupportsModuleParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.moduleTypeId],
  });
}
