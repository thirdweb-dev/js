import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "balanceOfBatch" function.
 */
export type BalanceOfBatchParams = {
  owners: AbiParameterToPrimitiveType<{ type: "address[]"; name: "_owners" }>;
  tokenIds: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "tokenIds";
  }>;
};

export const FN_SELECTOR = "0x4e1273f4" as const;
const FN_INPUTS = [
  {
    type: "address[]",
    name: "_owners",
  },
  {
    type: "uint256[]",
    name: "tokenIds",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256[]",
  },
] as const;

/**
 * Encodes the parameters for the "balanceOfBatch" function.
 * @param options - The options for the balanceOfBatch function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeBalanceOfBatchParams } "thirdweb/extensions/erc1155";
 * const result = encodeBalanceOfBatchParams({
 *  owners: ...,
 *  tokenIds: ...,
 * });
 * ```
 */
export function encodeBalanceOfBatchParams(options: BalanceOfBatchParams) {
  return encodeAbiParameters(FN_INPUTS, [options.owners, options.tokenIds]);
}

/**
 * Decodes the result of the balanceOfBatch function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeBalanceOfBatchResult } from "thirdweb/extensions/erc1155";
 * const result = decodeBalanceOfBatchResult("...");
 * ```
 */
export function decodeBalanceOfBatchResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "balanceOfBatch" function on the contract.
 * @param options - The options for the balanceOfBatch function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { balanceOfBatch } from "thirdweb/extensions/erc1155";
 *
 * const result = await balanceOfBatch({
 *  owners: ...,
 *  tokenIds: ...,
 * });
 *
 * ```
 */
export async function balanceOfBatch(
  options: BaseTransactionOptions<BalanceOfBatchParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owners, options.tokenIds],
  });
}
