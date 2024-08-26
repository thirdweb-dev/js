import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
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
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getTransferValidationFunction` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGetTransferValidationFunctionSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isGetTransferValidationFunctionSupported(contract);
 * ```
 */
export async function isGetTransferValidationFunctionSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getTransferValidationFunction function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeGetTransferValidationFunctionResult } from "thirdweb/extensions/modular";
 * const result = decodeGetTransferValidationFunctionResult("...");
 * ```
 */
export function decodeGetTransferValidationFunctionResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getTransferValidationFunction" function on the contract.
 * @param options - The options for the getTransferValidationFunction function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getTransferValidationFunction } from "thirdweb/extensions/modular";
 *
 * const result = await getTransferValidationFunction({
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
