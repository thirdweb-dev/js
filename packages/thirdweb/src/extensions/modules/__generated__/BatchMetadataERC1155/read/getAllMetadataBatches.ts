import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xe6c23512" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "tuple[]",
    components: [
      {
        type: "uint256",
        name: "startTokenIdInclusive",
      },
      {
        type: "uint256",
        name: "endTokenIdInclusive",
      },
      {
        type: "string",
        name: "baseURI",
      },
    ],
  },
] as const;

/**
 * Checks if the `getAllMetadataBatches` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAllMetadataBatches` method is supported.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const supported = BatchMetadataERC1155.isGetAllMetadataBatchesSupported(["0x..."]);
 * ```
 */
export function isGetAllMetadataBatchesSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getAllMetadataBatches function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const result = BatchMetadataERC1155.decodeGetAllMetadataBatchesResultResult("...");
 * ```
 */
export function decodeGetAllMetadataBatchesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllMetadataBatches" function on the contract.
 * @param options - The options for the getAllMetadataBatches function.
 * @returns The parsed result of the function call.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 *
 * const result = await BatchMetadataERC1155.getAllMetadataBatches({
 *  contract,
 * });
 *
 * ```
 */
export async function getAllMetadataBatches(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
