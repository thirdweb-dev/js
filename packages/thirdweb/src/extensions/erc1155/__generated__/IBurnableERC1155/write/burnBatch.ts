import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "burnBatch" function.
 */
export type BurnBatchParams = {
  account: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "account";
    type: "address";
  }>;
  ids: AbiParameterToPrimitiveType<{
    internalType: "uint256[]";
    name: "ids";
    type: "uint256[]";
  }>;
  values: AbiParameterToPrimitiveType<{
    internalType: "uint256[]";
    name: "values";
    type: "uint256[]";
  }>;
};

/**
 * Calls the "burnBatch" function on the contract.
 * @param options - The options for the "burnBatch" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { burnBatch } from "thirdweb/extensions/erc1155";
 *
 * const transaction = burnBatch({
 *  account: ...,
 *  ids: ...,
 *  values: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function burnBatch(options: BaseTransactionOptions<BurnBatchParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x6b20c454",
      [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256[]",
          name: "ids",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "values",
          type: "uint256[]",
        },
      ],
      [],
    ],
    params: [options.account, options.ids, options.values],
  });
}
