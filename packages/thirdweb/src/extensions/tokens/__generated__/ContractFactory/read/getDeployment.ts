import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getDeployment" function.
 */
export type GetDeploymentParams = {
  id: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "id" }>;
  version: AbiParameterToPrimitiveType<{ type: "uint256"; name: "version" }>;
};

export const FN_SELECTOR = "0x0a29517f" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "id",
  },
  {
    type: "uint256",
    name: "version",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `getDeployment` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getDeployment` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isGetDeploymentSupported } from "thirdweb/extensions/tokens";
 * const supported = isGetDeploymentSupported(["0x..."]);
 * ```
 */
export function isGetDeploymentSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getDeployment" function.
 * @param options - The options for the getDeployment function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeGetDeploymentParams } from "thirdweb/extensions/tokens";
 * const result = encodeGetDeploymentParams({
 *  id: ...,
 *  version: ...,
 * });
 * ```
 */
export function encodeGetDeploymentParams(options: GetDeploymentParams) {
  return encodeAbiParameters(FN_INPUTS, [options.id, options.version]);
}

/**
 * Encodes the "getDeployment" function into a Hex string with its parameters.
 * @param options - The options for the getDeployment function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeGetDeployment } from "thirdweb/extensions/tokens";
 * const result = encodeGetDeployment({
 *  id: ...,
 *  version: ...,
 * });
 * ```
 */
export function encodeGetDeployment(options: GetDeploymentParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetDeploymentParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getDeployment function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeGetDeploymentResult } from "thirdweb/extensions/tokens";
 * const result = decodeGetDeploymentResultResult("...");
 * ```
 */
export function decodeGetDeploymentResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getDeployment" function on the contract.
 * @param options - The options for the getDeployment function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getDeployment } from "thirdweb/extensions/tokens";
 *
 * const result = await getDeployment({
 *  contract,
 *  id: ...,
 *  version: ...,
 * });
 *
 * ```
 */
export async function getDeployment(
  options: BaseTransactionOptions<GetDeploymentParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.id, options.version],
  });
}
