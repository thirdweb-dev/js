import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "cancel" function.
 */
export type CancelParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the cancel function on the contract.
 * @param options - The options for the cancel function.
 * @returns A prepared transaction object.
 * @extension ILOYALTYCARD
 * @example
 * ```
 * import { cancel } from "thirdweb/extensions/ILoyaltyCard";
 *
 * const transaction = cancel({
 *  tokenId: ...,
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
      "0x40e58ee5",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.tokenId],
  });
}
