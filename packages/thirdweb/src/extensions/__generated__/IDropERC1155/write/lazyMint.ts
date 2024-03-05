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
};

/**
 * Calls the lazyMint function on the contract.
 * @param options - The options for the lazyMint function.
 * @returns A prepared transaction object.
 * @extension IDROPERC1155
 * @example
 * ```
 * import { lazyMint } from "thirdweb/extensions/IDropERC1155";
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
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "baseURIForTokens",
          type: "string",
        },
      ],
      [],
    ],
    params: [options.amount, options.baseURIForTokens],
  });
}
