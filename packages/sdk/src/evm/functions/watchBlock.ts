import {
  getBlock,
  getBlockWithTransactions,
  SharedBlockParams,
} from "./getBlock";
import { getSignerAndProvider } from "../constants/urls";
import type {
  Block,
  BlockWithTransactions,
} from "@ethersproject/abstract-provider";

export type WatchBlockNumberParams = SharedBlockParams & {
  onBlockNumber: (blockNumber: number) => void;
};

/**
 * Watch for a new block number on a given network.
 *
 * @example
 * ```javascript
 * // this will log out the new block number every time a new block is finalized
 * const unsubscribe = watchBlockNumber({
 *   network: "ethereum",
 *   onBlockNumber: (blockNumber) => {
 *     console.log("new block number", blockNumber);
 *   }
 * });
 * // later on you can call unsubscribe to stop listening for new blocks
 * unsubscribe();
 * ```
 *
 * @returns An unsubscribe function that will stop listening for new blocks when called
 * @public
 */
export function watchBlockNumber(params: WatchBlockNumberParams) {
  const [, provider] = getSignerAndProvider(params.network, params.sdkOptions);
  // start listening
  provider.on("block", params.onBlockNumber);
  // return a function that unsubscribes the listener
  return () => {
    provider.off("block", params.onBlockNumber);
  };
}

export type WatchBlockParams = SharedBlockParams & {
  onBlock: (block: Block) => void;
};

/**
 * Watch for new blocks on a given network.
 *
 * @example
 * ```javascript
 * // this will log out the new block every time a new block is finalized
 * const unsubscribe = watchBlock({
 *   network: "ethereum",
 *   onBlock: (block) => {
 *     console.log("new block", block);
 *   }
 * });
 * // later on you can call unsubscribe to stop listening for new blocks
 * unsubscribe();
 * ```
 *
 * @returns An unsubscribe function that will stop listening for new blocks when called
 * @public
 */
export function watchBlock({
  onBlock,
  ...sharedBlockParams
}: WatchBlockParams) {
  async function onBlockNumber(blockNumber: number) {
    try {
      onBlock(
        await getBlock({
          block: blockNumber,
          ...sharedBlockParams,
        }),
      );
    } catch (err) {
      // skip the block I guess?
    }
  }
  // start listening and return the unsubscribe function from within watchBlockNumber
  return watchBlockNumber({
    ...sharedBlockParams,
    onBlockNumber,
  });
}

export type WatchBlockWithTransactionsParams = SharedBlockParams & {
  onBlock: (block: BlockWithTransactions) => void;
};

/**
 * Watch for new blocks on a given network. (Includes parsed transactions)
 *
 * @example
 * ```javascript
 * // this will log out the new block every time a new block is finalized
 * const unsubscribe = watchBlockWithTransactions({
 *   network: "ethereum",
 *   onBlock: (block) => {
 *     console.log("new block", block);
 *     console.log("new transactions", block.transactions)
 *   }
 * });
 * // later on you can call unsubscribe to stop listening for new blocks
 * unsubscribe();
 * ```
 *
 * @returns An unsubscribe function that will stop listening for new blocks when called
 * @public
 */
export function watchBlockWithTransactions({
  onBlock,
  ...sharedBlockParams
}: WatchBlockWithTransactionsParams) {
  async function onBlockNumber(blockNumber: number) {
    try {
      onBlock(
        await getBlockWithTransactions({
          block: blockNumber,
          ...sharedBlockParams,
        }),
      );
    } catch (err) {
      // skip the block I guess?
    }
  }
  // start listening and return the unsubscribe function from within watchBlockNumber
  return watchBlockNumber({
    ...sharedBlockParams,
    onBlockNumber,
  });
}
