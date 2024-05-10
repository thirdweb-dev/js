import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "isTrustedForwarder" function.
 */
export type IsTrustedForwarderParams = {
  forwarder: AbiParameterToPrimitiveType<{
    type: "address";
    name: "forwarder";
  }>;
};

export const FN_SELECTOR = "0x572b6c05" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "forwarder",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isTrustedForwarder` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `isTrustedForwarder` method is supported.
 * @extension ERC2771
 * @example
 * ```ts
 * import { isIsTrustedForwarderSupported } from "thirdweb/extensions/erc2771";
 *
 * const supported = await isIsTrustedForwarderSupported(contract);
 * ```
 */
export async function isIsTrustedForwarderSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isTrustedForwarder" function.
 * @param options - The options for the isTrustedForwarder function.
 * @returns The encoded ABI parameters.
 * @extension ERC2771
 * @example
 * ```ts
 * import { encodeIsTrustedForwarderParams } "thirdweb/extensions/erc2771";
 * const result = encodeIsTrustedForwarderParams({
 *  forwarder: ...,
 * });
 * ```
 */
export function encodeIsTrustedForwarderParams(
  options: IsTrustedForwarderParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.forwarder]);
}

/**
 * Encodes the "isTrustedForwarder" function into a Hex string with its parameters.
 * @param options - The options for the isTrustedForwarder function.
 * @returns The encoded hexadecimal string.
 * @extension ERC2771
 * @example
 * ```ts
 * import { encodeIsTrustedForwarder } "thirdweb/extensions/erc2771";
 * const result = encodeIsTrustedForwarder({
 *  forwarder: ...,
 * });
 * ```
 */
export function encodeIsTrustedForwarder(options: IsTrustedForwarderParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsTrustedForwarderParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isTrustedForwarder function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC2771
 * @example
 * ```ts
 * import { decodeIsTrustedForwarderResult } from "thirdweb/extensions/erc2771";
 * const result = decodeIsTrustedForwarderResult("...");
 * ```
 */
export function decodeIsTrustedForwarderResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isTrustedForwarder" function on the contract.
 * @param options - The options for the isTrustedForwarder function.
 * @returns The parsed result of the function call.
 * @extension ERC2771
 * @example
 * ```ts
 * import { isTrustedForwarder } from "thirdweb/extensions/erc2771";
 *
 * const result = await isTrustedForwarder({
 *  contract,
 *  forwarder: ...,
 * });
 *
 * ```
 */
export async function isTrustedForwarder(
  options: BaseTransactionOptions<IsTrustedForwarderParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.forwarder],
  });
}
