import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "onERC1155Received" function.
 */

export type OnERC1155ReceivedParams = {
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "operator" }>;
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  id: AbiParameterToPrimitiveType<{ type: "uint256"; name: "id" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

export const FN_SELECTOR = "0xf23a6e61" as const;
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
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes4",
  },
] as const;

/**
 * Encodes the parameters for the "onERC1155Received" function.
 * @param options - The options for the onERC1155Received function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeOnERC1155ReceivedParams } "thirdweb/extensions/erc1155";
 * const result = encodeOnERC1155ReceivedParams({
 *  operator: ...,
 *  from: ...,
 *  id: ...,
 *  value: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeOnERC1155ReceivedParams(
  options: OnERC1155ReceivedParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.operator,
    options.from,
    options.id,
    options.value,
    options.data,
  ]);
}

/**
 * Calls the "onERC1155Received" function on the contract.
 * @param options - The options for the "onERC1155Received" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { onERC1155Received } from "thirdweb/extensions/erc1155";
 *
 * const transaction = onERC1155Received({
 *  contract,
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
  options: BaseTransactionOptions<
    | OnERC1155ReceivedParams
    | {
        asyncParams: () => Promise<OnERC1155ReceivedParams>;
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
              resolvedParams.id,
              resolvedParams.value,
              resolvedParams.data,
            ] as const;
          }
        : [
            options.operator,
            options.from,
            options.id,
            options.value,
            options.data,
          ],
  });
}
