import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xf147db8a" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "selector",
        type: "bytes4",
      },
      {
        name: "mode",
        type: "uint8",
      },
    ],
    type: "tuple[]",
  },
] as const;

/**
 * Checks if the `getSupportedCallbackFunctions` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getSupportedCallbackFunctions` method is supported.
 * @extension MODULES
 * @example
 * ```ts
 * import { isGetSupportedCallbackFunctionsSupported } from "thirdweb/extensions/modules";
 * const supported = isGetSupportedCallbackFunctionsSupported(["0x..."]);
 * ```
 */
export function isGetSupportedCallbackFunctionsSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getSupportedCallbackFunctions function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULES
 * @example
 * ```ts
 * import { decodeGetSupportedCallbackFunctionsResult } from "thirdweb/extensions/modules";
 * const result = decodeGetSupportedCallbackFunctionsResultResult("...");
 * ```
 */
export function decodeGetSupportedCallbackFunctionsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getSupportedCallbackFunctions" function on the contract.
 * @param options - The options for the getSupportedCallbackFunctions function.
 * @returns The parsed result of the function call.
 * @extension MODULES
 * @example
 * ```ts
 * import { getSupportedCallbackFunctions } from "thirdweb/extensions/modules";
 *
 * const result = await getSupportedCallbackFunctions({
 *  contract,
 * });
 *
 * ```
 */
export async function getSupportedCallbackFunctions(
  options: BaseTransactionOptions,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
