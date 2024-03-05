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
  encryptedBaseURI: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "encryptedBaseURI";
  }>;
};

/**
 * Calls the "lazyMint" function on the contract.
 * @param options - The options for the "lazyMint" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { lazyMint } from "thirdweb/extensions/erc721";
 *
 * const transaction = lazyMint({
 *  amount: ...,
 *  baseURIForTokens: ...,
 *  encryptedBaseURI: ...,
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
      "0xd37c353b",
      [
        {
          type: "uint256",
          name: "amount",
        },
        {
          type: "string",
          name: "baseURIForTokens",
        },
        {
          type: "bytes",
          name: "encryptedBaseURI",
        },
      ],
      [],
    ],
    params: [
      options.amount,
      options.baseURIForTokens,
      options.encryptedBaseURI,
    ],
  });
}
