import type { NetworkInput } from "../core/types";
import type { SDKOptions } from "../schema/sdk-options";
import { getChainId } from "./getChainId";
import { getSignerAndProvider } from "../constants/urls";
import type {
  Block,
  BlockWithTransactions,
  BlockTag,
} from "@ethersproject/abstract-provider";

export type SharedBlockParams = {
  network: NetworkInput;
  sdkOptions?: SDKOptions;
};

export type GetBlockNumberParams = SharedBlockParams;

/**
 * Get the latest block number from a given network.
 *
 * @example
 * ```javascript
 * const block = await getBlockNumber({
 *  network: "ethereum"
 * });
 * ```
 * @returns The latest block number
 * @public
 */
export async function getBlockNumber(params: GetBlockNumberParams) {
  const [, provider] = getSignerAndProvider(params.network, params.sdkOptions);
  return provider.getBlockNumber();
}

const BLOCK_PROMISE_CACHE = new Map<
  // chainId_blockNumber cache key
  `${number}_${BlockTag}`,
  Promise<Block>
>();

export type GetBlockParams = SharedBlockParams & {
  block: BlockTag;
};

/**
 * Get a specific block from a given network.
 *
 * @example
 * ```javascript
 * const block = await getBlock({
 *  network: "ethereum",
 *  block: 12345678
 * });
 * ```
 *
 * @returns The block for the given block number / block tag
 * @public
 */
export async function getBlock(params: GetBlockParams) {
  // first off get the chainId so we can check if we have something in cache for the blockNumber already
  // this is 1 extra call once per possible provider
  const chainId = await getChainId(params);
  const blockTag = params.block;
  const cacheKey = `${chainId}_${blockTag}` as const;
  let blockPromise: Promise<Block>;
  if (BLOCK_PROMISE_CACHE.has(cacheKey)) {
    blockPromise = BLOCK_PROMISE_CACHE.get(cacheKey) as Promise<Block>;
  } else {
    const [, provider] = getSignerAndProvider(
      params.network,
      params.sdkOptions,
    );
    blockPromise = provider.getBlock(blockTag).catch((err) => {
      // in the case where the call fails we should remove the promise from the cache so we can try again
      BLOCK_PROMISE_CACHE.delete(cacheKey);
      // also re-throw the error so downstream can handle it
      throw err;
    });
    BLOCK_PROMISE_CACHE.set(cacheKey, blockPromise);
  }

  // finally await the promise (will resolve immediately if already in cache and resolved)
  return await blockPromise;
}

const BLOCK_WITH_TRANSACTIONS_PROMISE_CACHE = new Map<
  // chainId_blockNumber cache key
  `${number}_${BlockTag}`,
  Promise<BlockWithTransactions>
>();

export type GetBlockWithTransactionsParams = SharedBlockParams & {
  block: BlockTag;
};

/**
 * Get a specific block (with the transactions contained in it) from a given network.
 *
 * @example
 * ```javascript
 * const block = await getBlockWithTransactions({
 *  network: "ethereum",
 *  block: 12345678
 * });
 * ```
 *
 * @returns The block for the given block number / block tag
 * @public
 */
export async function getBlockWithTransactions(
  params: GetBlockWithTransactionsParams,
) {
  // first off get the chainId so we can check if we have something in cache for the blockNumber already
  // this is 1 extra call once per possible provider
  const chainId = await getChainId(params);
  const blockTag = params.block;
  const cacheKey = `${chainId}_${blockTag}` as const;
  let blockPromise: Promise<BlockWithTransactions>;
  if (BLOCK_PROMISE_CACHE.has(cacheKey)) {
    blockPromise = BLOCK_WITH_TRANSACTIONS_PROMISE_CACHE.get(
      cacheKey,
    ) as Promise<BlockWithTransactions>;
  } else {
    const [, provider] = getSignerAndProvider(
      params.network,
      params.sdkOptions,
    );
    blockPromise = provider.getBlockWithTransactions(blockTag).catch((err) => {
      // in the case where the call fails we should remove the promise from the cache so we can try again
      BLOCK_WITH_TRANSACTIONS_PROMISE_CACHE.delete(cacheKey);
      // also re-throw the error so downstream can handle it
      throw err;
    });
    BLOCK_WITH_TRANSACTIONS_PROMISE_CACHE.set(cacheKey, blockPromise);
  }

  // finally await the promise (will resolve immediately if already in cache and resolved)
  return await blockPromise;
}
