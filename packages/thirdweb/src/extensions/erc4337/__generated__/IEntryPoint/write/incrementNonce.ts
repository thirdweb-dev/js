import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "incrementNonce" function.
 */
export type IncrementNonceParams = {
  key: AbiParameterToPrimitiveType<{
    internalType: "uint192";
    name: "key";
    type: "uint192";
  }>;
};

/**
 * Calls the "incrementNonce" function on the contract.
 * @param options - The options for the "incrementNonce" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { incrementNonce } from "thirdweb/extensions/erc4337";
 *
 * const transaction = incrementNonce({
 *  key: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function incrementNonce(
  options: BaseTransactionOptions<IncrementNonceParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x0bd28e3b",
      [
        {
          internalType: "uint192",
          name: "key",
          type: "uint192",
        },
      ],
      [],
    ],
    params: [options.key],
  });
}
