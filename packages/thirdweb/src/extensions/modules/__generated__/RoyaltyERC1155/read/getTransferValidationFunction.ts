import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x0d705df6" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "bytes4",
    name: "functionSignature",
  },
  {
    type: "bool",
    name: "isViewFunction",
  },
] as const;

/**
 * Checks if the `getTransferValidationFunction` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getTransferValidationFunction` method is supported.
 * @module RoyaltyERC1155
 * @example
 * ```ts
 * import { RoyaltyERC1155 } from "thirdweb/modules";
 * const supported = RoyaltyERC1155.isGetTransferValidationFunctionSupported(["0x..."]);
 * ```
 */
export function isGetTransferValidationFunctionSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getTransferValidationFunction function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @module RoyaltyERC1155
 * @example
 * ```ts
 * import { RoyaltyERC1155 } from "thirdweb/modules";
 * const result = RoyaltyERC1155.decodeGetTransferValidationFunctionResultResult("...");
 * ```
 */
export function decodeGetTransferValidationFunctionResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getTransferValidationFunction" function on the contract.
 * @param options - The options for the getTransferValidationFunction function.
 * @returns The parsed result of the function call.
 * @module RoyaltyERC1155
 * @example
 * ```ts
 * import { RoyaltyERC1155 } from "thirdweb/modules";
 *
 * const result = await RoyaltyERC1155.getTransferValidationFunction({
 *  contract,
 * });
 *
 * ```
 */
export async function getTransferValidationFunction(
  options: BaseTransactionOptions,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
