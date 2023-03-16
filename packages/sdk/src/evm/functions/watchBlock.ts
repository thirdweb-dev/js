import { NetworkInput } from "../core/types";
import { SDKOptions } from "../schema/sdk-options";
import { getSignerAndProvider } from "./getSignerAndProvider";
import { BlockWithTransactions } from "@ethersproject/abstract-provider";
import { Provider, Block } from "@ethersproject/providers";

export type SharedBlockParams = {
  network: NetworkInput;
  sdkOptions?: SDKOptions;
};

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

const BLOCK_PROMISE_CACHE = new WeakMap<
  {
    blockNumber: number;
    provider: Provider;
  },
  Promise<Block>
>();

export type WatchBlockParams = SharedBlockParams & {
  onBlock: (block: Block) => void;
};

export function watchBlock(params: WatchBlockParams) {
  const [, provider] = getSignerAndProvider(params.network, params.sdkOptions);
  async function onBlockNumber(blockNumber: number) {
    try {
      let blockPromise: Promise<Block>;
      if (BLOCK_PROMISE_CACHE.has({ blockNumber, provider })) {
        blockPromise = BLOCK_PROMISE_CACHE.get({
          blockNumber,
          provider,
        }) as Promise<Block>;
      } else {
        blockPromise = provider.getBlock(blockNumber);
        BLOCK_PROMISE_CACHE.set({ blockNumber, provider }, blockPromise);
      }

      params.onBlock(await blockPromise);
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

const BLOCK_WITH_TRANSACTIONS_PROMISE_CACHE = new WeakMap<
  {
    blockNumber: number;
    provider: Provider;
  },
  Promise<BlockWithTransactions>
>();

export type WatchBlockWithTransactionsParams = SharedBlockParams & {
  onBlock: (block: BlockWithTransactions) => void;
};

export function watchBlockWithTransactions(
  params: WatchBlockWithTransactionsParams,
) {
  const [, provider] = getSignerAndProvider(params.network, params.sdkOptions);
  async function onBlockNumber(blockNumber: number) {
    try {
      let blockPromise: Promise<BlockWithTransactions>;
      if (
        BLOCK_WITH_TRANSACTIONS_PROMISE_CACHE.has({ blockNumber, provider })
      ) {
        blockPromise = BLOCK_WITH_TRANSACTIONS_PROMISE_CACHE.get({
          blockNumber,
          provider,
        }) as Promise<BlockWithTransactions>;
      } else {
        blockPromise = provider.getBlockWithTransactions(blockNumber);
        BLOCK_WITH_TRANSACTIONS_PROMISE_CACHE.set(
          { blockNumber, provider },
          blockPromise,
        );
      }

      params.onBlock(await blockPromise);
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
