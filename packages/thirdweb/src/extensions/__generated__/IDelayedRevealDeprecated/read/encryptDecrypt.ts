import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "encryptDecrypt" function.
 */
export type EncryptDecryptParams = {
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "data";
    type: "bytes";
  }>;
  key: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "key";
    type: "bytes";
  }>;
};

/**
 * Calls the encryptDecrypt function on the contract.
 * @param options - The options for the encryptDecrypt function.
 * @returns The parsed result of the function call.
 * @extension IDELAYEDREVEALDEPRECATED
 * @example
 * ```
 * import { encryptDecrypt } from "thirdweb/extensions/IDelayedRevealDeprecated";
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
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "key",
          type: "bytes",
        },
      ],
      [
        {
          internalType: "bytes",
          name: "result",
          type: "bytes",
        },
      ],
    ],
    params: [options.data, options.key],
  });
}
