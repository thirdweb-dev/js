import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "encryptedBaseURI" function.
 */
export type EncryptedBaseURIParams = {
  identifier: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "identifier";
    type: "uint256";
  }>;
};

/**
 * Calls the encryptedBaseURI function on the contract.
 * @param options - The options for the encryptedBaseURI function.
 * @returns The parsed result of the function call.
 * @extension IDELAYEDREVEALDEPRECATED
 * @example
 * ```
 * import { encryptedBaseURI } from "thirdweb/extensions/IDelayedRevealDeprecated";
 *
 * const result = await encryptedBaseURI({
 *  identifier: ...,
 * });
 *
 * ```
 */
export async function encryptedBaseURI(
  options: BaseTransactionOptions<EncryptedBaseURIParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x82909959",
      [
        {
          internalType: "uint256",
          name: "identifier",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
    ],
    params: [options.identifier],
  });
}
