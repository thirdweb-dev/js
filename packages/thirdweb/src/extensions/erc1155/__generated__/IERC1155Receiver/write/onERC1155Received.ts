import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "onERC1155Received" function.
 */
export type OnERC1155ReceivedParams = {
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
  id: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "id";
    type: "uint256";
  }>;
  value: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "value";
    type: "uint256";
  }>;
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "data";
    type: "bytes";
  }>;
};

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
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
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
      options.id,
      options.value,
      options.data,
    ],
  });
}
