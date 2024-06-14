import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x5357aa5e" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "_installedExtensions",
    type: "tuple[]",
    internalType: "struct IModularCore.InstalledExtension[]",
    components: [
      {
        name: "implementation",
        type: "address",
        internalType: "address",
      },
      {
        name: "config",
        type: "tuple",
        internalType: "struct IExtensionConfig.ExtensionConfig",
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
            internalType: "struct IExtensionConfig.CallbackFunction[]",
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
            internalType: "struct IExtensionConfig.FallbackFunction[]",
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
    ],
  },
] as const;

/**
 * Checks if the `getInstalledExtensions` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getInstalledExtensions` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGetInstalledExtensionsSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isGetInstalledExtensionsSupported(contract);
 * ```
 */
export async function isGetInstalledExtensionsSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getInstalledExtensions function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeGetInstalledExtensionsResult } from "thirdweb/extensions/modular";
 * const result = decodeGetInstalledExtensionsResult("...");
 * ```
 */
export function decodeGetInstalledExtensionsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getInstalledExtensions" function on the contract.
 * @param options - The options for the getInstalledExtensions function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getInstalledExtensions } from "thirdweb/extensions/modular";
 *
 * const result = await getInstalledExtensions({
 *  contract,
 * });
 *
 * ```
 */
export async function getInstalledExtensions(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
