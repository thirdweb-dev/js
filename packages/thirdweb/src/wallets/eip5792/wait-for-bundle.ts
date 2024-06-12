import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { watchBlockNumber } from "../../rpc/watchBlockNumber.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { Wallet } from "../interfaces/wallet.js";
import { getCallsStatus } from "./get-calls-status.js";
import type { GetCallsStatusResponse, WalletSendCallsId } from "./types.js";

export const DEFAULT_MAX_BLOCKS_WAIT_TIME = 30;

const map = new Map<string, Promise<GetCallsStatusResponse>>();

export type WaitForBundleOptions = Prettify<{
  bundleId: WalletSendCallsId;
  wallet: Wallet;
  client: ThirdwebClient;
  chain: Chain;
  maxBlocksWaitTime?: number;
}>;

/**
 * Waits for the [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) bundle to be confirmed.
 *
 * @note This function is dependent on the wallet's support for EIP-5792 and could fail.
 *
 * @param options - The options for waiting for the bundle.
 * By default, the max wait time is 30 blocks.
 * @returns A promise that resolves with the final {@link getCallsStatus} result.
 * @throws an error if the wallet does not support EIP-5792.
 * @beta
 * @example
 * ```ts
 * import { waitForBundle } from "thirdweb/wallets/eip5792";
 * const result = await waitForBundle({
 *   client,
 *   chain,
 *   wallet,
 *   bundleId: "0x123...",
 * });
 * ```
 * @extension EIP5792
 */
export function waitForBundle(
  options: WaitForBundleOptions,
): Promise<GetCallsStatusResponse> {
  const { bundleId, chain, wallet, client } = options;

  const chainId = chain.id;
  const key = `${chainId}:calls_${bundleId}`;
  const maxBlocksWaitTime =
    options.maxBlocksWaitTime ?? DEFAULT_MAX_BLOCKS_WAIT_TIME;

  if (map.has(key)) {
    // biome-ignore lint/style/noNonNullAssertion: the `has` above ensures that this will always be set
    return map.get(key)!;
  }
  const promise = new Promise<GetCallsStatusResponse>((resolve, reject) => {
    // start at -1 because the first block doesn't count
    let blocksWaited = -1;

    const unwatch = watchBlockNumber({
      client: client,
      chain: chain,
      onNewBlockNumber: async () => {
        blocksWaited++;
        if (blocksWaited >= maxBlocksWaitTime) {
          unwatch();
          reject(
            new Error(`Bundle not confirmed after ${maxBlocksWaitTime} blocks`),
          );
          return;
        }
        try {
          const result = await getCallsStatus({
            wallet,
            client,
            bundleId,
          });

          if (result.status === "CONFIRMED") {
            // stop the polling
            unwatch();
            // resolve the top level promise with the result
            resolve(result);
          }
        } catch {
          // noop, we'll try again on the next blocks
        }
      },
    });
    // remove the promise from the map when it's done (one way or the other)
  }).finally(() => {
    map.delete(key);
  });

  map.set(key, promise);
  return promise;
}
