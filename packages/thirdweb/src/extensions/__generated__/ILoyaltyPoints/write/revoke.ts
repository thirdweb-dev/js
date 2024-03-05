import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "revoke" function.
 */
export type RevokeParams = {
  owner: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "owner";
    type: "address";
  }>;
  amount: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "amount";
    type: "uint256";
  }>;
};

/**
 * Calls the revoke function on the contract.
 * @param options - The options for the revoke function.
 * @returns A prepared transaction object.
 * @extension ILOYALTYPOINTS
 * @example
 * ```
 * import { revoke } from "thirdweb/extensions/ILoyaltyPoints";
 *
 * const transaction = revoke({
 *  owner: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function revoke(options: BaseTransactionOptions<RevokeParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xeac449d9",
      [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.owner, options.amount],
  });
}
