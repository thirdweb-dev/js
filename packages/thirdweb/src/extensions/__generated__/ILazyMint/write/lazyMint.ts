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
  extraData: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "extraData";
    type: "bytes";
  }>;
};

/**
 * Calls the lazyMint function on the contract.
 * @param options - The options for the lazyMint function.
 * @returns A prepared transaction object.
 * @extension ILAZYMINT
 * @example
 * ```
 * import { lazyMint } from "thirdweb/extensions/ILazyMint";
 *
 * const transaction = lazyMint({
 *  amount: ...,
 *  baseURIForTokens: ...,
 *  extraData: ...,
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
          name: "extraData",
          type: "bytes",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "batchId",
          type: "uint256",
        },
      ],
    ],
    params: [options.amount, options.baseURIForTokens, options.extraData],
  });
}
