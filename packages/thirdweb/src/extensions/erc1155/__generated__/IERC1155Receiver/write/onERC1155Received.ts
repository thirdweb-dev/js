import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "onERC1155Received" function.
 */

type OnERC1155ReceivedParamsInternal = {
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "operator" }>;
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  id: AbiParameterToPrimitiveType<{ type: "uint256"; name: "id" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

export type OnERC1155ReceivedParams = Prettify<
  | OnERC1155ReceivedParamsInternal
  | {
      asyncParams: () => Promise<OnERC1155ReceivedParamsInternal>;
    }
>;
/**
 * Calls the "onERC1155Received" function on the contract.
 * @param options - The options for the "onERC1155Received" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { onERC1155Received } from "thirdweb/extensions/erc1155";
 *
 * const transaction = onERC1155Received({
 *  operator: ...,
 *  from: ...,
 *  id: ...,
 *  value: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function onERC1155Received(
  options: BaseTransactionOptions<OnERC1155ReceivedParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xf23a6e61",
      [
        {
          type: "address",
          name: "operator",
        },
        {
          type: "address",
          name: "from",
        },
        {
          type: "uint256",
          name: "id",
        },
        {
          type: "uint256",
          name: "value",
        },
        {
          type: "bytes",
          name: "data",
        },
      ],
      [
        {
          type: "bytes4",
        },
      ],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [
          resolvedParams.operator,
          resolvedParams.from,
          resolvedParams.id,
          resolvedParams.value,
          resolvedParams.data,
        ] as const;
      }

      return [
        options.operator,
        options.from,
        options.id,
        options.value,
        options.data,
      ] as const;
    },
  });
}
