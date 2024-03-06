import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "mintTo" function.
 */
export type MintToParams = {
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "uri" }>;
};

/**
 * Calls the "mintTo" function on the contract.
 * @param options - The options for the "mintTo" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { mintTo } from "thirdweb/extensions/erc721";
 *
 * const transaction = mintTo({
 *  to: ...,
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function mintTo(options: BaseTransactionOptions<MintToParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x0075a317",
      [
        {
          type: "address",
          name: "to",
        },
        {
          type: "string",
          name: "uri",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [options.to, options.uri],
  });
}
