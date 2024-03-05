import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "safeTransferFrom" function.
 */
export type SafeTransferFromParams = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  id: AbiParameterToPrimitiveType<{ type: "uint256"; name: "id" }>;
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
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
 *  amount: ...,
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
          name: "from",
        },
        {
          type: "address",
          name: "to",
        },
        {
          type: "uint256",
          name: "id",
        },
        {
          type: "uint256",
          name: "amount",
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
      options.id,
      options.amount,
      options.data,
    ],
  });
}
