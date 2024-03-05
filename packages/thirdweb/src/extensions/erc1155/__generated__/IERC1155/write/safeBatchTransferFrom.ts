import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "safeBatchTransferFrom" function.
 */
export type SafeBatchTransferFromParams = {
  from: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_from";
    type: "address";
  }>;
  to: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_to";
    type: "address";
  }>;
  ids: AbiParameterToPrimitiveType<{
    internalType: "uint256[]";
    name: "_ids";
    type: "uint256[]";
  }>;
  values: AbiParameterToPrimitiveType<{
    internalType: "uint256[]";
    name: "_values";
    type: "uint256[]";
  }>;
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "_data";
    type: "bytes";
  }>;
};

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
export function safeBatchTransferFrom(
  options: BaseTransactionOptions<SafeBatchTransferFromParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x2eb2c2d6",
      [
        {
          internalType: "address",
          name: "_from",
          type: "address",
        },
        {
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          internalType: "uint256[]",
          name: "_ids",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "_values",
          type: "uint256[]",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      [],
    ],
    params: [
      options.from,
      options.to,
      options.ids,
      options.values,
      options.data,
    ],
  });
}
