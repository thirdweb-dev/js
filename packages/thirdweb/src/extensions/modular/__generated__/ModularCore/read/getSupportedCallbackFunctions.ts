import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xf147db8a" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "tuple[]",
    internalType: "struct IModularCore.SupportedCallbackFunction[]",
    components: [
      {
        name: "selector",
        type: "bytes4",
        internalType: "bytes4",
      },
      {
        name: "mode",
        type: "uint8",
        internalType: "enum IModularCore.CallbackMode",
      },
    ],
  },
] as const;

/**
 * Checks if the `getSupportedCallbackFunctions` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getSupportedCallbackFunctions` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGetSupportedCallbackFunctionsSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isGetSupportedCallbackFunctionsSupported(contract);
 * ```
 */
export async function isGetSupportedCallbackFunctionsSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getSupportedCallbackFunctions function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeGetSupportedCallbackFunctionsResult } from "thirdweb/extensions/modular";
 * const result = decodeGetSupportedCallbackFunctionsResult("...");
 * ```
 */
export function decodeGetSupportedCallbackFunctionsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getSupportedCallbackFunctions" function on the contract.
 * @param options - The options for the getSupportedCallbackFunctions function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getSupportedCallbackFunctions } from "thirdweb/extensions/modular";
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
