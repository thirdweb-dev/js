import {
  getBlock,
  getBlockWithTransactions,
  SharedBlockParams,
} from "./getBlock";
import { getSignerAndProvider } from "./getSignerAndProvider";
import type {
  Block,
  BlockWithTransactions,
} from "@ethersproject/abstract-provider";

export type WatchBlockNumberParams = SharedBlockParams & {
  onBlockNumber: (blockNumber: number) => void;
};

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

export function watchBlock(params: WatchBlockParams) {
  async function onBlockNumber(blockNumber: number) {
    try {
      params.onBlock(
        await getBlock({
          block: blockNumber,
          network: params.network,
          sdkOptions: params.sdkOptions,
        }),
      );
    } catch (err) {
      // skip the block I guess?
    }
  }
  // start listening and return the unsubscribe function from within watchBlockNumber
  return watchBlockNumber({
    network: params.network,
    sdkOptions: params.sdkOptions,
    onBlockNumber,
  });
}

export type WatchBlockWithTransactionsParams = SharedBlockParams & {
  onBlock: (block: BlockWithTransactions) => void;
};

export function watchBlockWithTransactions(
  params: WatchBlockWithTransactionsParams,
) {
  async function onBlockNumber(blockNumber: number) {
    try {
      params.onBlock(
        await getBlockWithTransactions({
          block: blockNumber,
          network: params.network,
          sdkOptions: params.sdkOptions,
        }),
      );
    } catch (err) {
      // skip the block I guess?
    }
  }
  // start listening and return the unsubscribe function from within watchBlockNumber
  return watchBlockNumber({
    network: params.network,
    sdkOptions: params.sdkOptions,
    onBlockNumber,
  });
}
