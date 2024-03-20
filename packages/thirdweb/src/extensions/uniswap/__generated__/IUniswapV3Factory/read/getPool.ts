import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getPool" function.
 */
export type GetPoolParams = {
  tokenA: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenA" }>;
  tokenB: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenB" }>;
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
};

/**
 * Calls the "getPool" function on the contract.
 * @param options - The options for the getPool function.
 * @returns The parsed result of the function call.
 * @extension UNISWAP
 * @example
 * ```
 * import { getPool } from "thirdweb/extensions/uniswap";
 *
 * const result = await getPool({
 *  tokenA: ...,
 *  tokenB: ...,
 *  fee: ...,
 * });
 *
 * ```
 */
export async function getPool(options: BaseTransactionOptions<GetPoolParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0x1698ee82",
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
