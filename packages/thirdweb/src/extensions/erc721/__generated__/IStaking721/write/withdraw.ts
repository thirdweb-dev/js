import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "withdraw" function.
 */

type WithdrawParamsInternal = {
  tokenIds: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "tokenIds";
  }>;
};

export type WithdrawParams = Prettify<
  | WithdrawParamsInternal
  | {
      asyncParams: () => Promise<WithdrawParamsInternal>;
    }
>;
const FN_SELECTOR = "0x983d95ce" as const;
const FN_INPUTS = [
  {
    type: "uint256[]",
    name: "tokenIds",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "withdraw" function.
 * @param options - The options for the withdraw function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```
 * import { encodeWithdrawParams } "thirdweb/extensions/erc721";
 * const result = encodeWithdrawParams({
 *  tokenIds: ...,
 * });
 * ```
 */
export function encodeWithdrawParams(options: WithdrawParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenIds]);
}

/**
 * Calls the "withdraw" function on the contract.
 * @param options - The options for the "withdraw" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { withdraw } from "thirdweb/extensions/erc721";
 *
 * const transaction = withdraw({
 *  tokenIds: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdraw(options: BaseTransactionOptions<WithdrawParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.tokenIds] as const;
          }
        : [options.tokenIds],
  });
}
