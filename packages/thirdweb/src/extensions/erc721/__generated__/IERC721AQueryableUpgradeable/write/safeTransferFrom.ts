import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "safeTransferFrom" function.
 */
export type SafeTransferFromParams = {
  from: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "from";
    type: "address";
  }>;
  to: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "to";
    type: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
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
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.from, options.to, options.tokenId],
  });
}
