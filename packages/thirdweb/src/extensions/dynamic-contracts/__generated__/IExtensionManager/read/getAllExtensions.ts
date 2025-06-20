import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x4a00cc48" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        components: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "metadataURI",
            type: "string",
          },
          {
            name: "implementation",
            type: "address",
          },
        ],
        name: "metadata",
        type: "tuple",
      },
      {
        components: [
          {
            name: "functionSelector",
            type: "bytes4",
          },
          {
            name: "functionSignature",
            type: "string",
          },
        ],
        name: "functions",
        type: "tuple[]",
      },
    ],
    type: "tuple[]",
  },
] as const;

/**
 * Checks if the `getAllExtensions` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAllExtensions` method is supported.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { isGetAllExtensionsSupported } from "thirdweb/extensions/dynamic-contracts";
 * const supported = isGetAllExtensionsSupported(["0x..."]);
 * ```
 */
export function isGetAllExtensionsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getAllExtensions function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { decodeGetAllExtensionsResult } from "thirdweb/extensions/dynamic-contracts";
 * const result = decodeGetAllExtensionsResultResult("...");
 * ```
 */
export function decodeGetAllExtensionsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllExtensions" function on the contract.
 * @param options - The options for the getAllExtensions function.
 * @returns The parsed result of the function call.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { getAllExtensions } from "thirdweb/extensions/dynamic-contracts";
 *
 * const result = await getAllExtensions({
 *  contract,
 * });
 *
 * ```
 */
export async function getAllExtensions(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
