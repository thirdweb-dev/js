import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "onERC1155BatchReceived" function.
 */

export type OnERC1155BatchReceivedParams = {
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "operator" }>;
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  ids: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "ids" }>;
  values: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "values" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

export const FN_SELECTOR = "0xbc197c81" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "operator",
  },
  {
    type: "address",
    name: "from",
  },
  {
    type: "uint256[]",
    name: "ids",
  },
  {
    type: "uint256[]",
    name: "values",
  },
  {
    type: "bytes",
    name: "data",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes4",
  },
] as const;

/**
 * Encodes the parameters for the "onERC1155BatchReceived" function.
 * @param options - The options for the onERC1155BatchReceived function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeOnERC1155BatchReceivedParams } "thirdweb/extensions/erc1155";
 * const result = encodeOnERC1155BatchReceivedParams({
 *  operator: ...,
 *  from: ...,
 *  ids: ...,
 *  values: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeOnERC1155BatchReceivedParams(
  options: OnERC1155BatchReceivedParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.operator,
    options.from,
    options.ids,
    options.values,
    options.data,
  ]);
}

/**
 * Calls the "onERC1155BatchReceived" function on the contract.
 * @param options - The options for the "onERC1155BatchReceived" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { onERC1155BatchReceived } from "thirdweb/extensions/erc1155";
 *
 * const transaction = onERC1155BatchReceived({
 *  contract,
 *  operator: ...,
 *  from: ...,
 *  ids: ...,
 *  values: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function onERC1155BatchReceived(
  options: BaseTransactionOptions<
    | OnERC1155BatchReceivedParams
    | {
        asyncParams: () => Promise<OnERC1155BatchReceivedParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.operator,
              resolvedParams.from,
              resolvedParams.ids,
              resolvedParams.values,
              resolvedParams.data,
            ] as const;
          }
        : [
            options.operator,
            options.from,
            options.ids,
            options.values,
            options.data,
          ],
  });
}
