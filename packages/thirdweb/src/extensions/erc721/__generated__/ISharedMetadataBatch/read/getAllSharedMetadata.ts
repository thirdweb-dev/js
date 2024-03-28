import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

const FN_SELECTOR = "0xfc3c2a73" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "tuple[]",
    name: "metadata",
    components: [
      {
        type: "bytes32",
        name: "id",
      },
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
            name: "description",
          },
          {
            type: "string",
            name: "imageURI",
          },
          {
            type: "string",
            name: "animationURI",
          },
        ],
      },
    ],
  },
] as const;

/**
 * Decodes the result of the getAllSharedMetadata function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeGetAllSharedMetadataResult } from "thirdweb/extensions/erc721";
 * const result = decodeGetAllSharedMetadataResult("...");
 * ```
 */
export function decodeGetAllSharedMetadataResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllSharedMetadata" function on the contract.
 * @param options - The options for the getAllSharedMetadata function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { getAllSharedMetadata } from "thirdweb/extensions/erc721";
 *
 * const result = await getAllSharedMetadata();
 *
 * ```
 */
export async function getAllSharedMetadata(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
