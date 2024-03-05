import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "revoke" function.
 */
export type RevokeParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the revoke function on the contract.
 * @param options - The options for the revoke function.
 * @returns A prepared transaction object.
 * @extension ILOYALTYCARD
 * @example
 * ```
 * import { revoke } from "thirdweb/extensions/ILoyaltyCard";
 *
 * const transaction = revoke({
 *  tokenId: ...,
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
      "0x20c5429b",
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
