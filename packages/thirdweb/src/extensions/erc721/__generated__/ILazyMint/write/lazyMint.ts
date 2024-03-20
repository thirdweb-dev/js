import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "lazyMint" function.
 */

type LazyMintParamsInternal = {
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
  baseURIForTokens: AbiParameterToPrimitiveType<{
    type: "string";
    name: "baseURIForTokens";
  }>;
  extraData: AbiParameterToPrimitiveType<{ type: "bytes"; name: "extraData" }>;
};

export type LazyMintParams = Prettify<
  | LazyMintParamsInternal
  | {
      asyncParams: () => Promise<LazyMintParamsInternal>;
    }
>;
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
          type: "uint256",
          name: "amount",
        },
        {
          type: "string",
          name: "baseURIForTokens",
        },
        {
          type: "bytes",
          name: "extraData",
        },
      ],
      [
        {
          type: "uint256",
          name: "batchId",
        },
      ],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.amount,
              resolvedParams.baseURIForTokens,
              resolvedParams.extraData,
            ] as const;
          }
        : [options.amount, options.baseURIForTokens, options.extraData],
  });
}
