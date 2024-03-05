import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "balanceOfBatch" function.
 */
export type BalanceOfBatchParams = {
  owners: AbiParameterToPrimitiveType<{
    internalType: "address[]";
    name: "_owners";
    type: "address[]";
  }>;
  ids: AbiParameterToPrimitiveType<{
    internalType: "uint256[]";
    name: "_ids";
    type: "uint256[]";
  }>;
};

/**
 * Calls the balanceOfBatch function on the contract.
 * @param options - The options for the balanceOfBatch function.
 * @returns The parsed result of the function call.
 * @extension IERC1155
 * @example
 * ```
 * import { balanceOfBatch } from "thirdweb/extensions/IERC1155";
 *
 * const result = await balanceOfBatch({
 *  owners: ...,
 *  ids: ...,
 * });
 *
 * ```
 */
export async function balanceOfBatch(
  options: BaseTransactionOptions<BalanceOfBatchParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x4e1273f4",
      [
        {
          internalType: "address[]",
          name: "_owners",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "_ids",
          type: "uint256[]",
        },
      ],
      [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
    ],
    params: [options.owners, options.ids],
  });
}
