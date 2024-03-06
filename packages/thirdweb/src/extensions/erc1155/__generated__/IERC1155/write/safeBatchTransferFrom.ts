import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "safeBatchTransferFrom" function.
 */
export type SafeBatchTransferFromParams = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "_from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "_to" }>;
  ids: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "_ids" }>;
  values: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "_values" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
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
          type: "address",
          name: "_from",
        },
        {
          type: "address",
          name: "_to",
        },
        {
          type: "uint256[]",
          name: "_ids",
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
    params: [
      options.from,
      options.to,
      options.ids,
      options.values,
      options.data,
    ],
  });
}
