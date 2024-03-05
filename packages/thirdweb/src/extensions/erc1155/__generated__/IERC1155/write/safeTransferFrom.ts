import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "safeTransferFrom" function.
 */
export type SafeTransferFromParams = {
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
  id: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_id";
    type: "uint256";
  }>;
  value: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_value";
    type: "uint256";
  }>;
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "_data";
    type: "bytes";
  }>;
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
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_value",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      [],
    ],
    params: [options.from, options.to, options.id, options.value, options.data],
  });
}
