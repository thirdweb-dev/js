import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "burnBatch" function.
 */

type BurnBatchParamsInternal = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
  ids: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "ids" }>;
  values: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "values" }>;
};

export type BurnBatchParams = Prettify<
  | BurnBatchParamsInternal
  | {
      asyncParams: () => Promise<BurnBatchParamsInternal>;
    }
>;
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
          type: "address",
          name: "account",
        },
        {
          type: "uint256[]",
          name: "ids",
        },
        {
          type: "uint256[]",
          name: "values",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [
          resolvedParams.account,
          resolvedParams.ids,
          resolvedParams.values,
        ] as const;
      }

      return [options.account, options.ids, options.values] as const;
    },
  });
}
