import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x89e04e0e" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "config",
    type: "tuple",
    internalType: "struct IModuleConfig.ModuleConfig",
    components: [
      {
        name: "registerInstallationCallback",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "requiredInterfaces",
        type: "bytes4[]",
        internalType: "bytes4[]",
      },
      {
        name: "supportedInterfaces",
        type: "bytes4[]",
        internalType: "bytes4[]",
      },
      {
        name: "callbackFunctions",
        type: "tuple[]",
        internalType: "struct IModuleConfig.CallbackFunction[]",
        components: [
          {
            name: "selector",
            type: "bytes4",
            internalType: "bytes4",
          },
        ],
      },
      {
        name: "fallbackFunctions",
        type: "tuple[]",
        internalType: "struct IModuleConfig.FallbackFunction[]",
        components: [
          {
            name: "selector",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "permissionBits",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
  },
] as const;

/**
 * Checks if the `getModuleConfig` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getModuleConfig` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGetModuleConfigSupported } from "thirdweb/extensions/modular";
 *
 * const supported = isGetModuleConfigSupported(["0x..."]);
 * ```
 */
export function isGetModuleConfigSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getModuleConfig function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeGetModuleConfigResult } from "thirdweb/extensions/modular";
 * const result = decodeGetModuleConfigResult("...");
 * ```
 */
export function decodeGetModuleConfigResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getModuleConfig" function on the contract.
 * @param options - The options for the getModuleConfig function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getModuleConfig } from "thirdweb/extensions/modular";
 *
 * const result = await getModuleConfig({
 *  contract,
 * });
 *
 * ```
 */
export async function getModuleConfig(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
