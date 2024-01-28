import { getRpcClient } from "./rpc.js";
import { eth_blockNumber } from "./actions/eth_blockNumber.js";
import type { ThirdwebClient } from "../client/client.js";

const MAX_POLL_DELAY = 5000; // 5 seconds
const DEFAULT_POLL_DELAY = 1000; // 1 second
const MIN_POLL_DELAY = 100; // 100 milliseconds

const SLIDING_WINDOW_SIZE = 10; // always keep track of the last 10 block times
const SLIDING_WINDOWS = new Map<number, number[]>(); // chainId -> [blockTime, blockTime, ...]

function getAverageBlockTime(chainId: number): number {
  const blockTimes = SLIDING_WINDOWS.get(chainId) ?? [];
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

const SUBSCRIPTIONS = new Map<number, Array<(blockNumber: bigint) => void>>();

export function watchBlockNumber(opts: {
  client: ThirdwebClient;
  chainId: number;
  onNewBlockNumber: (blockNumber: bigint) => void;
  overPollRatio?: number;
}) {
  // ignore that there could be multiple pollers for the same chainId etc

  let lastBlockNumber: bigint | undefined;
  let lastBlockAt: number | undefined;

  const rpcRequest = getRpcClient(opts.client, { chainId: opts.chainId });

  async function poll() {
    // stop polling if there are no more subscriptions
    if (!SUBSCRIPTIONS.get(opts.chainId)?.length) {
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
        const blockTimes = SLIDING_WINDOWS.get(opts.chainId) ?? [];
        blockTimes.push(blockTime);
        SLIDING_WINDOWS.set(
          opts.chainId,
          blockTimes.slice(-SLIDING_WINDOW_SIZE),
        );
      }
      lastBlockAt = currentTime;
      newBlockNumbers.forEach((b) => {
        opts.onNewBlockNumber(b);
      });
    }
    const currentApproximateBlockTime = getAverageBlockTime(opts.chainId);

    // sleep for the average block time for this chain (divided by the overPollRatio, which defaults to 2)
    await sleep(currentApproximateBlockTime / (opts.overPollRatio ?? 2));
    // poll again
    poll();
  }
  // setup the subscription
  const currentSubscriptions = SUBSCRIPTIONS.get(opts.chainId) ?? [];

  SUBSCRIPTIONS.set(opts.chainId, [
    ...currentSubscriptions,
    opts.onNewBlockNumber,
  ]);

  // if there were no subscriptions, start polling (we just added one)
  if (currentSubscriptions.length === 0) {
    poll();
  }

  return function () {
    // remove the subscription
    SUBSCRIPTIONS.set(
      opts.chainId,
      (SUBSCRIPTIONS.get(opts.chainId) ?? []).filter(
        (fn) => fn !== opts.onNewBlockNumber,
      ),
    );
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
