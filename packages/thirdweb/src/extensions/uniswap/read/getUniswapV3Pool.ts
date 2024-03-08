import type { Address } from "abitype";
import { UniswapFee } from "../types.js";
import type { BaseTransactionOptions } from "src/transaction/types.js";
import { ADDRESS_ZERO } from "../../../constants/addresses.js";

/**
 * Represents the parameters for the `findUniswapV3Pool` function.
 */
export type GetUniswapV3PoolParams = {
  tokenA: Address;
  tokenB: Address;
};

export type GetUniswapV3PoolResult = {
  poolFee: UniswapFee;
  poolAddress: Address;
};

/**
 * Finds the Uniswap V3 pool for the two tokens, if one exists.
 * @param options - The token pair to find a pool for any Uniswap contract that implements getPool.
 * @throws If no pool exists for the two tokens.
 * @returns The pool's address and fee.
 * @extension ERC20
 * @example
 * ```ts
 * import { getUniswapV3Pool } from "thirdweb/extensions/uniswap";
 * const { poolFee, poolAddress } = await getUniswapV3Pool({
 *  tokenA: "0x...",
 *  tokenB: "0x...",
 *  factoryContract: contract
 * });
 * ```
 */
export async function getUniswapV3Pool(
  options: BaseTransactionOptions<GetUniswapV3PoolParams>,
) {
  const { getPool } = await import(
    "../__generated__/IUniswapV3Factory/read/getPool.js"
  );
  let poolFee: UniswapFee | undefined;
  let pool: Address | undefined;

  for (const fee of Object.values(UniswapFee).filter(
    (value) => typeof value === "number",
  )) {
    pool = await getPool({
      contract: options.contract,
      tokenA: options.tokenA,
      tokenB: options.tokenB,
      fee: Number(fee),
    });

    if (pool !== ADDRESS_ZERO) {
      poolFee = Number(fee);
      break;
    }
  }

  if (!pool || pool === ADDRESS_ZERO) {
    throw new Error("No pool exists for this token pair.");
  }

  return {
    poolFee,
    poolAddress: pool,
  } as GetUniswapV3PoolResult;
}
