import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x89e04e0e" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "tuple",
    name: "config",
    components: [
      {
        type: "bool",
        name: "registerInstallationCallback",
      },
      {
        type: "bytes4[]",
        name: "requiredInterfaces",
      },
      {
        type: "bytes4[]",
        name: "supportedInterfaces",
      },
      {
        type: "tuple[]",
        name: "callbackFunctions",
        components: [
          {
            type: "bytes4",
            name: "selector",
          },
        ],
      },
      {
        type: "tuple[]",
        name: "fallbackFunctions",
        components: [
          {
            type: "bytes4",
            name: "selector",
          },
          {
            type: "uint256",
            name: "permissionBits",
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
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 * const supported = BatchMetadataERC721.isGetModuleConfigSupported(["0x..."]);
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
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 * const result = BatchMetadataERC721.decodeGetModuleConfigResultResult("...");
 * ```
 */
export function decodeGetModuleConfigResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getModuleConfig" function on the contract.
 * @param options - The options for the getModuleConfig function.
 * @returns The parsed result of the function call.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 *
 * const result = await BatchMetadataERC721.getModuleConfig({
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
