import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "cancel" function.
 */
export type CancelParams = {
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
 * Calls the cancel function on the contract.
 * @param options - The options for the cancel function.
 * @returns A prepared transaction object.
 * @extension ILOYALTYPOINTS
 * @example
 * ```
 * import { cancel } from "thirdweb/extensions/ILoyaltyPoints";
 *
 * const transaction = cancel({
 *  owner: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function cancel(options: BaseTransactionOptions<CancelParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x98590ef9",
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
