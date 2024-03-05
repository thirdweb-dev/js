import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "lazyMint" function.
 */
export type LazyMintParams = {
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
  baseURIForTokens: AbiParameterToPrimitiveType<{
    type: "string";
    name: "baseURIForTokens";
  }>;
};

/**
 * Calls the "lazyMint" function on the contract.
 * @param options - The options for the "lazyMint" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { lazyMint } from "thirdweb/extensions/erc1155";
 *
 * const transaction = lazyMint({
 *  amount: ...,
 *  baseURIForTokens: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function lazyMint(options: BaseTransactionOptions<LazyMintParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x47158264",
      [
        {
          type: "uint256",
          name: "amount",
        },
        {
          type: "string",
          name: "baseURIForTokens",
        },
      ],
      [],
    ],
    params: [options.amount, options.baseURIForTokens],
  });
}
