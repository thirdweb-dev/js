import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "onERC1155BatchReceived" function.
 */
export type OnERC1155BatchReceivedParams = {
  operator: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "operator";
    type: "address";
  }>;
  from: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "from";
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
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "data";
    type: "bytes";
  }>;
};

/**
 * Calls the "onERC1155BatchReceived" function on the contract.
 * @param options - The options for the "onERC1155BatchReceived" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { onERC1155BatchReceived } from "thirdweb/extensions/erc1155";
 *
 * const transaction = onERC1155BatchReceived({
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
  options: BaseTransactionOptions<OnERC1155BatchReceivedParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xbc197c81",
      [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "address",
          name: "from",
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
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      [
        {
          internalType: "bytes4",
          name: "",
          type: "bytes4",
        },
      ],
    ],
    params: [
      options.operator,
      options.from,
      options.ids,
      options.values,
      options.data,
    ],
  });
}
