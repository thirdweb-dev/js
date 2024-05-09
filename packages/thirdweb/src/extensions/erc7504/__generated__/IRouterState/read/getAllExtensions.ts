import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x4a00cc48" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "tuple[]",
    name: "allExtensions",
    components: [
      {
        type: "tuple",
        name: "metadata",
        components: [
          {
            type: "string",
            name: "name",
          },
          {
            type: "string",
            name: "metadataURI",
          },
          {
            type: "address",
            name: "implementation",
          },
        ],
      },
      {
        type: "tuple[]",
        name: "functions",
        components: [
          {
            type: "bytes4",
            name: "functionSelector",
          },
          {
            type: "string",
            name: "functionSignature",
          },
        ],
      },
    ],
  },
] as const;

/**
 * Checks if the `getAllExtensions` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getAllExtensions` method is supported.
 * @extension ERC7504
 * @example
 * ```ts
 * import { isGetAllExtensionsSupported } from "thirdweb/extensions/erc7504";
 *
 * const supported = await isGetAllExtensionsSupported(contract);
 * ```
 */
export async function isGetAllExtensionsSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getAllExtensions function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7504
 * @example
 * ```ts
 * import { decodeGetAllExtensionsResult } from "thirdweb/extensions/erc7504";
 * const result = decodeGetAllExtensionsResult("...");
 * ```
 */
export function decodeGetAllExtensionsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllExtensions" function on the contract.
 * @param options - The options for the getAllExtensions function.
 * @returns The parsed result of the function call.
 * @extension ERC7504
 * @example
 * ```ts
 * import { getAllExtensions } from "thirdweb/extensions/erc7504";
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
