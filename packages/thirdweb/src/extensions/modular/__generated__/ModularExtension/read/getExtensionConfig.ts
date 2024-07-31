import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x7c173ecc" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "",
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
] as const;

/**
 * Checks if the `getExtensionConfig` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getExtensionConfig` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGetExtensionConfigSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isGetExtensionConfigSupported(contract);
 * ```
 */
export async function isGetExtensionConfigSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getExtensionConfig function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeGetExtensionConfigResult } from "thirdweb/extensions/modular";
 * const result = decodeGetExtensionConfigResult("...");
 * ```
 */
export function decodeGetExtensionConfigResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getExtensionConfig" function on the contract.
 * @param options - The options for the getExtensionConfig function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getExtensionConfig } from "thirdweb/extensions/modular";
 *
 * const result = await getExtensionConfig({
 *  contract,
 * });
 *
 * ```
 */
export async function getExtensionConfig(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
