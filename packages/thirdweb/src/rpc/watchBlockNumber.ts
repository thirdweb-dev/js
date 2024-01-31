import { getRpcClient } from "./rpc.js";
import { eth_blockNumber } from "./actions/eth_blockNumber.js";
import type { ThirdwebClient } from "../client/client.js";
import { getChainIdFromChain, type Chain } from "../chain/index.js";

const MAX_POLL_DELAY = 5000; // 5 seconds
const DEFAULT_POLL_DELAY = 1000; // 1 second
const MIN_POLL_DELAY = 100; // 100 milliseconds
const DEFAULT_OVERPOLL_RATIO = 2; // poll twice as often as the average block time by default

const SLIDING_WINDOW_SIZE = 10; // always keep track of the last 10 block times

/**
 * TODO: document
 * @internal
 */
function getAverageBlockTime(blockTimes: number[]): number {
  // left-pad the blocktimes Array with the DEFAULT_POLL_DELAY
  while (blockTimes.length < SLIDING_WINDOW_SIZE) {
    blockTimes.unshift(DEFAULT_POLL_DELAY);
  }

  const sum = blockTimes.reduce((acc, blockTime) => acc + blockTime, 0);
  return sum / blockTimes.length;
}

/**
 * TODO: document
 * @internal
 */
function createBlockNumberPoller(
  client: ThirdwebClient,
  chain: Chain,
  overPollRatio?: number,
) {
  let subscribers: Array<(blockNumber: bigint) => void> = [];
  let blockTimesWindow: number[] = [];

  let isActive = false;
  let lastBlockNumber: bigint | undefined;
  let lastBlockAt: number | undefined;

  const rpcRequest = getRpcClient({ client, chain });

  /**
   * TODO: document
   * @internal
   */
  async function poll() {
    // stop polling if there are no more subscriptions
    if (!isActive) {
      return;
    }
    const blockNumber = await eth_blockNumber(rpcRequest);

    if (!lastBlockNumber || blockNumber > lastBlockNumber) {
      let newBlockNumbers = [];
      if (lastBlockNumber) {
        for (let i = lastBlockNumber + 1n; i <= blockNumber; i++) {
          newBlockNumbers.push(BigInt(i));
        }
      } else {
        newBlockNumbers = [blockNumber];
      }
      lastBlockNumber = blockNumber;
      const currentTime = new Date().getTime();
      if (lastBlockAt) {
        // if we skipped a block we need to adjust the block time down to that level
        const blockTime = (currentTime - lastBlockAt) / newBlockNumbers.length;

        blockTimesWindow.push(blockTime);
        blockTimesWindow = blockTimesWindow.slice(-SLIDING_WINDOW_SIZE);
      }
      lastBlockAt = currentTime;
      // for all new blockNumbers...
      newBlockNumbers.forEach((b) => {
        // ... call all current subscribers
        subscribers.forEach((subscriberCallback) => subscriberCallback(b));
      });
    }
    const currentApproximateBlockTime = getAverageBlockTime(blockTimesWindow);

    // make sure we never poll faster than our minimum poll delay or slower than our maximum poll delay
    const pollDelay = Math.max(
      MIN_POLL_DELAY,
      Math.min(
        MAX_POLL_DELAY,
        Math.max(MIN_POLL_DELAY, currentApproximateBlockTime),
      ),
    );

    // sleep for the pollDelay for this chain (divided by the overPollRatio, which defaults to 2)
    await sleep(pollDelay / (overPollRatio ?? DEFAULT_OVERPOLL_RATIO));
    // poll again
    poll();
  }

  // return the "subscribe" function
  return function subscribe(callBack: (blockNumber: bigint) => void) {
    subscribers.push(callBack);
    // if we are currently not active -> start polling
    if (!isActive) {
      isActive = true;
      poll();
    }

    // return the "unsubscribe" function (meaning the caller can unsubscribe)
    return function unSubscribe() {
      // filter out the callback from the subscribers
      subscribers = subscribers.filter((fn) => fn !== callBack);
      // if the new subscribers Array is empty (aka we were the last subscriber) -> stop polling
      if (subscribers.length === 0) {
        isActive = false;
      }
    };
  };
}

/**
 * TODO: document
 * @internal
 */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const existingPollers = new Map<
  bigint,
  ReturnType<typeof createBlockNumberPoller>
>();

export type WatchBlockNumberOptions = {
  client: ThirdwebClient;
  chain: Chain;
  onNewBlockNumber: (blockNumber: bigint) => void;
  overPollRatio?: number;
};

/**
 * Watches the block number for a specific chain.
 * @param opts - The options for watching the block number.
 * @returns The unwatch function.
 * @example
 * ```ts
 * import { watchBlockNumber } from "thirdweb";
 * const unwatch = watchBlockNumber({
 *  client,
 *  chainId,
 *  onNewBlockNumber: (blockNumber) => {
 *    // do something with the block number
 *    },
 * });
 *
 * // later stop watching
 * unwatch();
 *
 * ```
 */
export function watchBlockNumber(opts: WatchBlockNumberOptions) {
  const { client, chain, onNewBlockNumber, overPollRatio } = opts;
  const chainId = getChainIdFromChain(chain);
  // if we already have a poller for this chainId -> use it
  let poller = existingPollers.get(chainId);
  // otherwise create a new poller
  if (!poller) {
    poller = createBlockNumberPoller(client, chainId, overPollRatio);
    // and store it for later use
    existingPollers.set(chainId, poller);
  }
  // subscribe to the poller and return the unSubscribe function to the caller
  return poller(onNewBlockNumber);
}
