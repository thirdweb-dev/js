import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "burn" function.
 */
export type BurnParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

/**
 * Calls the "burn" function on the contract.
 * @param options - The options for the "burn" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { burn } from "thirdweb/extensions/erc721";
 *
 * const transaction = burn({
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function burn(options: BaseTransactionOptions<BurnParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x42966c68",
      [
        {
          type: "uint256",
          name: "tokenId",
        },
      ],
      [],
    ],
    params: [options.tokenId],
  });
}
