import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "safeTransferFrom" function.
 */
export type SafeTransferFromParams = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

/**
 * Calls the "safeTransferFrom" function on the contract.
 * @param options - The options for the "safeTransferFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { safeTransferFrom } from "thirdweb/extensions/erc721";
 *
 * const transaction = safeTransferFrom({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
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
      "0x42842e0e",
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
          name: "tokenId",
        },
      ],
      [],
    ],
    params: [options.from, options.to, options.tokenId],
  });
}
