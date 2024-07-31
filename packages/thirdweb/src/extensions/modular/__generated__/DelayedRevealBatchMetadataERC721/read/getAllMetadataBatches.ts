import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xe6c23512" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "tuple[]",
    internalType:
      "struct DelayedRevealBatchMetadataERC721.DelayedRevealMetadataBatch[]",
    components: [
      {
        name: "startTokenIdInclusive",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "endTokenIdInclusive",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "baseURI",
        type: "string",
        internalType: "string",
      },
      {
        name: "encryptedData",
        type: "bytes",
        internalType: "bytes",
      },
    ],
  },
] as const;

/**
 * Checks if the `getAllMetadataBatches` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getAllMetadataBatches` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGetAllMetadataBatchesSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isGetAllMetadataBatchesSupported(contract);
 * ```
 */
export async function isGetAllMetadataBatchesSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getAllMetadataBatches function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeGetAllMetadataBatchesResult } from "thirdweb/extensions/modular";
 * const result = decodeGetAllMetadataBatchesResult("...");
 * ```
 */
export function decodeGetAllMetadataBatchesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllMetadataBatches" function on the contract.
 * @param options - The options for the getAllMetadataBatches function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getAllMetadataBatches } from "thirdweb/extensions/modular";
 *
 * const result = await getAllMetadataBatches({
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
