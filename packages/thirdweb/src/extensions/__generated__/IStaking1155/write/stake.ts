import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "stake" function.
 */
export type StakeParams = {
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
 * Calls the stake function on the contract.
 * @param options - The options for the stake function.
 * @returns A prepared transaction object.
 * @extension ISTAKING1155
 * @example
 * ```
 * import { stake } from "thirdweb/extensions/IStaking1155";
 *
 * const transaction = stake({
 *  tokenId: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function stake(options: BaseTransactionOptions<StakeParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x952e68cf",
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
