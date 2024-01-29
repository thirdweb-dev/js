import { getRpcClient } from "./rpc.js";
import { eth_blockNumber } from "./actions/eth_blockNumber.js";
import type { ThirdwebClient } from "../client/client.js";

const MAX_POLL_DELAY = 5000; // 5 seconds
const DEFAULT_POLL_DELAY = 1000; // 1 second
const MIN_POLL_DELAY = 100; // 100 milliseconds

const SLIDING_WINDOW_SIZE = 10; // always keep track of the last 10 block times

function getAverageBlockTime(blockTimes: number[]): number {
  // left-pad the blocktimes Array with the DEFAULT_POLL_DELAY
  while (blockTimes.length < SLIDING_WINDOW_SIZE) {
    blockTimes.unshift(DEFAULT_POLL_DELAY);
  }

  const sum = blockTimes.reduce((acc, blockTime) => {
    // never let the blockTime be less than our minimum
    if (blockTime <= MIN_POLL_DELAY) {
      return acc + MIN_POLL_DELAY;
    }
    // never let the blockTime be more than our maximum
    if (blockTime >= MAX_POLL_DELAY) {
      return acc + MAX_POLL_DELAY;
    }
    return acc + blockTime;
  }, 0);
  return sum / blockTimes.length;
}

function createBlockNumberPoller(
  client: ThirdwebClient,
  chainId: number,
  overPollRatio?: number,
) {
  let subscribers: Array<(blockNumber: bigint) => void> = [];
  let blockTimesWindow: number[] = [];

  let isActive = false;
  let lastBlockNumber: bigint | undefined;
  let lastBlockAt: number | undefined;

  const rpcRequest = getRpcClient({ client, chainId });

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
      newBlockNumbers.forEach((b) => {
        subscribers.forEach((fn) => fn(b));
      });
    }
    const currentApproximateBlockTime = getAverageBlockTime(blockTimesWindow);

    // sleep for the average block time for this chain (divided by the overPollRatio, which defaults to 2)
    await sleep(currentApproximateBlockTime / (overPollRatio ?? 2));
    // poll again
    poll();
  }

  return function (callBack: (blockNumber: bigint) => void) {
    subscribers.push(callBack);
    if (!isActive) {
      isActive = true;
      poll();
    }

    return function unSubscribe() {
      subscribers = subscribers.filter((fn) => fn !== callBack);
      if (subscribers.length === 0) {
        isActive = false;
      }
    };
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const existingPollers = new Map<
  number,
  ReturnType<typeof createBlockNumberPoller>
>();

export function watchBlockNumber(opts: {
  client: ThirdwebClient;
  chainId: number;
  onNewBlockNumber: (blockNumber: bigint) => void;
  overPollRatio?: number;
}) {
  const { client, chainId, onNewBlockNumber, overPollRatio } = opts;
  let poller = existingPollers.get(chainId);
  if (!poller) {
    poller = createBlockNumberPoller(client, chainId, overPollRatio);
    existingPollers.set(chainId, poller);
  }
  return poller(onNewBlockNumber);
}
