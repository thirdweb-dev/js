import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "safeBatchTransferFrom" function.
 */
export type SafeBatchTransferFromParams = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  ids: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "ids" }>;
  amounts: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "amounts" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
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
 *  amounts: ...,
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
          name: "from",
        },
        {
          type: "address",
          name: "to",
        },
        {
          type: "uint256[]",
          name: "ids",
        },
        {
          type: "uint256[]",
          name: "amounts",
        },
        {
          type: "bytes",
          name: "data",
        },
      ],
      [],
    ],
    params: [
      options.from,
      options.to,
      options.ids,
      options.amounts,
      options.data,
    ],
  });
}
