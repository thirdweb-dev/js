import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "safeBatchTransferFrom" function.
 */

type SafeBatchTransferFromParamsInternal = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "_from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "_to" }>;
  tokenIds: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "tokenIds";
  }>;
  values: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "_values" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
};

export type SafeBatchTransferFromParams = Prettify<
  | SafeBatchTransferFromParamsInternal
  | {
      asyncParams: () => Promise<SafeBatchTransferFromParamsInternal>;
    }
>;
/**
 * Calls the "safeBatchTransferFrom" function on the contract.
 * @param options - The options for the "safeBatchTransferFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { safeBatchTransferFrom } from "thirdweb/extensions/erc1155";
 *
 * const transaction = safeBatchTransferFrom({
 *  from: ...,
 *  to: ...,
 *  tokenIds: ...,
 *  values: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function safeBatchTransferFrom(
  options: BaseTransactionOptions<SafeBatchTransferFromParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x2eb2c2d6",
      [
        {
          type: "address",
          name: "_from",
        },
        {
          type: "address",
          name: "_to",
        },
        {
          type: "uint256[]",
          name: "tokenIds",
        },
        {
          type: "uint256[]",
          name: "_values",
        },
        {
          type: "bytes",
          name: "_data",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.from,
              resolvedParams.to,
              resolvedParams.tokenIds,
              resolvedParams.values,
              resolvedParams.data,
            ] as const;
          }
        : [
            options.from,
            options.to,
            options.tokenIds,
            options.values,
            options.data,
          ],
  });
}
