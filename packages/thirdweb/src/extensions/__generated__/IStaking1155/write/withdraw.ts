import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "withdraw" function.
 */
export type WithdrawParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  amount: AbiParameterToPrimitiveType<{
    internalType: "uint64";
    name: "amount";
    type: "uint64";
  }>;
};

/**
 * Calls the withdraw function on the contract.
 * @param options - The options for the withdraw function.
 * @returns A prepared transaction object.
 * @extension ISTAKING1155
 * @example
 * ```
 * import { withdraw } from "thirdweb/extensions/IStaking1155";
 *
 * const transaction = withdraw({
 *  tokenId: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdraw(options: BaseTransactionOptions<WithdrawParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xc434dcfe",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "uint64",
          name: "amount",
          type: "uint64",
        },
      ],
      [],
    ],
    params: [options.tokenId, options.amount],
  });
}
