import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "safeTransferFrom" function.
 */
export type SafeTransferFromParams = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "_from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "_to" }>;
  id: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_id" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_value" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
};

/**
 * Calls the "safeTransferFrom" function on the contract.
 * @param options - The options for the "safeTransferFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { safeTransferFrom } from "thirdweb/extensions/erc1155";
 *
 * const transaction = safeTransferFrom({
 *  from: ...,
 *  to: ...,
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
export function safeTransferFrom(
  options: BaseTransactionOptions<SafeTransferFromParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xf242432a",
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
          type: "uint256",
          name: "_id",
        },
        {
          type: "uint256",
          name: "_value",
        },
        {
          type: "bytes",
          name: "_data",
        },
      ],
      [],
    ],
    params: [options.from, options.to, options.id, options.value, options.data],
  });
}
