import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "stake" function.
 */
export type StakeParams = {
  tokenIds: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "tokenIds";
  }>;
};

/**
 * Calls the "stake" function on the contract.
 * @param options - The options for the "stake" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { stake } from "thirdweb/extensions/erc721";
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
          type: "uint256[]",
          name: "tokenIds",
        },
      ],
      [],
    ],
    params: [options.tokenIds],
  });
}
