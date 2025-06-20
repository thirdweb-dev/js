import type { Address } from "abitype";
import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

const UniswapFee = {
  HIGH: 10000,
  LOW: 500,
  LOWEST: 100,
  MEDIUM: 3000,
} as const;

/**
 * Represents the parameters for the `findUniswapV3Pool` function.
 * @extension UNISWAP
 */
export type GetUniswapV3PoolParams = {
  tokenA: Address;
  tokenB: Address;
};

/**
 * @extension UNISWAP
 */
export type GetUniswapV3PoolResult = {
  poolFee: (typeof UniswapFee)[keyof typeof UniswapFee];
  poolAddress: Address;
};

/**
 * Finds the Uniswap V3 pools for the two tokens.
 * @param options - The token pair to find any pools for any Uniswap contract that implements getPool.
 * @returns The pools' addresses and fees.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { getUniswapV3Pool } from "thirdweb/extensions/uniswap";
 * const pools = await getUniswapV3Pool({
 *  tokenA: "0x...",
 *  tokenB: "0x...",
 *  contract: factoryContract
 * });
 * ```
 */
export async function getUniswapV3Pool(
  options: BaseTransactionOptions<GetUniswapV3PoolParams>,
): Promise<GetUniswapV3PoolResult[]> {
  const { getPool } = await import(
    "../__generated__/IUniswapV3Factory/read/getPool.js"
  );

  const promises = Object.values(UniswapFee)
    .filter((value) => typeof value === "number")
    .map(async (fee) => {
      const poolAddress = await getPool({
        contract: options.contract,
        fee,
        tokenA: options.tokenA,
        tokenB: options.tokenB,
      });

      return {
        poolAddress,
        poolFee: fee,
      };
    });

  const results = await Promise.all(promises);
  const validPools = results.filter(
    (result) => result.poolAddress && result.poolAddress !== ZERO_ADDRESS,
  );

  return validPools;
}
