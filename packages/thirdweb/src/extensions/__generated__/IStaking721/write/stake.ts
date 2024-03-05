import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "stake" function.
 */
export type StakeParams = {
  tokenIds: AbiParameterToPrimitiveType<{
    internalType: "uint256[]";
    name: "tokenIds";
    type: "uint256[]";
  }>;
};

/**
 * Calls the stake function on the contract.
 * @param options - The options for the stake function.
 * @returns A prepared transaction object.
 * @extension ISTAKING721
 * @example
 * ```
 * import { stake } from "thirdweb/extensions/IStaking721";
 *
 * const transaction = stake({
 *  tokenIds: ...,
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
      "0x0fbf0a93",
      [
        {
          internalType: "uint256[]",
          name: "tokenIds",
          type: "uint256[]",
        },
      ],
      [],
    ],
    params: [options.tokenIds],
  });
}
