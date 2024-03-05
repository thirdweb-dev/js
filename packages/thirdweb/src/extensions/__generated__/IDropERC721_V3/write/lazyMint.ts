import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "lazyMint" function.
 */
export type LazyMintParams = {
  amount: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "amount";
    type: "uint256";
  }>;
  baseURIForTokens: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "baseURIForTokens";
    type: "string";
  }>;
  encryptedBaseURI: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "encryptedBaseURI";
    type: "bytes";
  }>;
};

/**
 * Calls the lazyMint function on the contract.
 * @param options - The options for the lazyMint function.
 * @returns A prepared transaction object.
 * @extension IDROPERC721_V3
 * @example
 * ```
 * import { lazyMint } from "thirdweb/extensions/IDropERC721_V3";
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
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "baseURIForTokens",
          type: "string",
        },
        {
          internalType: "bytes",
          name: "encryptedBaseURI",
          type: "bytes",
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
