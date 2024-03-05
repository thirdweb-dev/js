import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "reveal" function.
 */
export type RevealParams = {
  identifier: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "identifier";
    type: "uint256";
  }>;
  key: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "key";
    type: "bytes";
  }>;
};

/**
 * Calls the reveal function on the contract.
 * @param options - The options for the reveal function.
 * @returns A prepared transaction object.
 * @extension IDELAYEDREVEALDEPRECATED
 * @example
 * ```
 * import { reveal } from "thirdweb/extensions/IDelayedRevealDeprecated";
 *
 * const transaction = reveal({
 *  identifier: ...,
 *  key: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function reveal(options: BaseTransactionOptions<RevealParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xce805642",
      [
        {
          internalType: "uint256",
          name: "identifier",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "key",
          type: "bytes",
        },
      ],
      [
        {
          internalType: "string",
          name: "revealedURI",
          type: "string",
        },
      ],
    ],
    params: [options.identifier, options.key],
  });
}
