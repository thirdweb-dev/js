import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "balanceOfBatch" function.
 */
export type BalanceOfBatchParams = {
  owners: AbiParameterToPrimitiveType<{ type: "address[]"; name: "_owners" }>;
  tokenIds: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "tokenIds";
  }>;
};

const METHOD = [
  "0x4e1273f4",
  [
    {
      type: "address[]",
      name: "_owners",
    },
    {
      type: "uint256[]",
      name: "tokenIds",
    },
  ],
  [
    {
      type: "uint256[]",
    },
  ],
] as const;

/**
 * Calls the "balanceOfBatch" function on the contract.
 * @param options - The options for the balanceOfBatch function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```
 * import { balanceOfBatch } from "thirdweb/extensions/erc1155";
 *
 * const result = await balanceOfBatch({
 *  owners: ...,
 *  tokenIds: ...,
 * });
 *
 * ```
 */
export async function balanceOfBatch(
  options: BaseTransactionOptions<BalanceOfBatchParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.owners, options.tokenIds],
  });
}
