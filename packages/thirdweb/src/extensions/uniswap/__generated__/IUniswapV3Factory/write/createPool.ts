import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "createPool" function.
 */
export type CreatePoolParams = {
  tokenA: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenA" }>;
  tokenB: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenB" }>;
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
};

/**
 * Calls the "createPool" function on the contract.
 * @param options - The options for the "createPool" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```
 * import { createPool } from "thirdweb/extensions/uniswap";
 *
 * const transaction = createPool({
 *  tokenA: ...,
 *  tokenB: ...,
 *  fee: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createPool(options: BaseTransactionOptions<CreatePoolParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xa1671295",
      [
        {
          type: "address",
          name: "tokenA",
        },
        {
          type: "address",
          name: "tokenB",
        },
        {
          type: "uint24",
          name: "fee",
        },
      ],
      [
        {
          type: "address",
          name: "pool",
        },
      ],
    ],
    params: [options.tokenA, options.tokenB, options.fee],
  });
}
