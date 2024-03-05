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
  tier: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "tier";
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
 * @extension ILAZYMINTWITHTIER
 * @example
 * ```
 * import { lazyMint } from "thirdweb/extensions/ILazyMintWithTier";
 *
 * const transaction = lazyMint({
 *  amount: ...,
 *  baseURIForTokens: ...,
 *  tier: ...,
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
      "0xe28411ea",
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
          internalType: "string",
          name: "tier",
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
    params: [
      options.amount,
      options.baseURIForTokens,
      options.tier,
      options.extraData,
    ],
  });
}
