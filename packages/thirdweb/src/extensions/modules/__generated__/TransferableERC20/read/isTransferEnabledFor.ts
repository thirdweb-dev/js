import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isTransferEnabledFor" function.
 */
export type IsTransferEnabledForParams = {
  target: AbiParameterToPrimitiveType<{ type: "address"; name: "target" }>;
};

export const FN_SELECTOR = "0x735d0538" as const;
const FN_INPUTS = [
  {
    name: "target",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isTransferEnabledFor` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isTransferEnabledFor` method is supported.
 * @modules TransferableERC20
 * @example
 * ```ts
 * import { TransferableERC20 } from "thirdweb/modules";
 * const supported = TransferableERC20.isIsTransferEnabledForSupported(["0x..."]);
 * ```
 */
export function isIsTransferEnabledForSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isTransferEnabledFor" function.
 * @param options - The options for the isTransferEnabledFor function.
 * @returns The encoded ABI parameters.
 * @modules TransferableERC20
 * @example
 * ```ts
 * import { TransferableERC20 } from "thirdweb/modules";
 * const result = TransferableERC20.encodeIsTransferEnabledForParams({
 *  target: ...,
 * });
 * ```
 */
export function encodeIsTransferEnabledForParams(
  options: IsTransferEnabledForParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.target]);
}

/**
 * Encodes the "isTransferEnabledFor" function into a Hex string with its parameters.
 * @param options - The options for the isTransferEnabledFor function.
 * @returns The encoded hexadecimal string.
 * @modules TransferableERC20
 * @example
 * ```ts
 * import { TransferableERC20 } from "thirdweb/modules";
 * const result = TransferableERC20.encodeIsTransferEnabledFor({
 *  target: ...,
 * });
 * ```
 */
export function encodeIsTransferEnabledFor(
  options: IsTransferEnabledForParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsTransferEnabledForParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isTransferEnabledFor function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @modules TransferableERC20
 * @example
 * ```ts
 * import { TransferableERC20 } from "thirdweb/modules";
 * const result = TransferableERC20.decodeIsTransferEnabledForResultResult("...");
 * ```
 */
export function decodeIsTransferEnabledForResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isTransferEnabledFor" function on the contract.
 * @param options - The options for the isTransferEnabledFor function.
 * @returns The parsed result of the function call.
 * @modules TransferableERC20
 * @example
 * ```ts
 * import { TransferableERC20 } from "thirdweb/modules";
 *
 * const result = await TransferableERC20.isTransferEnabledFor({
 *  contract,
 *  target: ...,
 * });
 *
 * ```
 */
export async function isTransferEnabledFor(
  options: BaseTransactionOptions<IsTransferEnabledForParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.target],
  });
}
