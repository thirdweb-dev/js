import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "encryptDecrypt" function.
 */
export type EncryptDecryptParams = {
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
};

/**
 * Calls the "encryptDecrypt" function on the contract.
 * @param options - The options for the encryptDecrypt function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { encryptDecrypt } from "thirdweb/extensions/erc721";
 *
 * const result = await encryptDecrypt({
 *  data: ...,
 *  key: ...,
 * });
 *
 * ```
 */
export async function encryptDecrypt(
  options: BaseTransactionOptions<EncryptDecryptParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xe7150322",
      [
        {
          type: "bytes",
          name: "data",
        },
        {
          type: "bytes",
          name: "key",
        },
      ],
      [
        {
          type: "bytes",
          name: "result",
        },
      ],
    ],
    params: [options.data, options.key],
  });
}
