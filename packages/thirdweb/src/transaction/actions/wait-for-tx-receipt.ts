import type { Hex } from "viem";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { eth_getTransactionReceipt } from "../../rpc/actions/eth_getTransactionReceipt.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { watchBlockNumber } from "../../rpc/watchBlockNumber.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { SendTransactionResult, TransactionReceipt } from "../types.js";

export const DEFAULT_MAX_BLOCKS_WAIT_TIME = 30;

const map = new Map<string, Promise<TransactionReceipt>>();

export type WaitForReceiptOptions = Prettify<
  SendTransactionResult & {
    client: ThirdwebClient;
    chain: Chain;
    maxBlocksWaitTime?: number;
  }
>;

/**
 * Waits for the transaction receipt of a given transaction hash on a specific contract.
 * @param options - The options for waiting for the receipt.
 * By default, it's 30 blocks.
 * @returns A promise that resolves with the transaction receipt.
 * @transaction
 * @example
 * ```ts
 * import { waitForReceipt } from "thirdweb";
 * const receipt = await waitForReceipt({
 *   client,
 *   chain,
 *   transactionHash: "0x123...",
 * });
 * ```
 */
export function waitForReceipt(
  options: WaitForReceiptOptions,
): Promise<TransactionReceipt> {
  const { transactionHash, chain, client } = options;

  const chainId = chain.id;
  const key = `${chainId}:tx_${transactionHash}`;
  const maxBlocksWaitTime =
    options.maxBlocksWaitTime ?? DEFAULT_MAX_BLOCKS_WAIT_TIME;

  if (map.has(key)) {
    // biome-ignore lint/style/noNonNullAssertion: the `has` above ensures that this will always be set
    return map.get(key)!;
  }
  const promise = new Promise<TransactionReceipt>((resolve, reject) => {
    if (!transactionHash) {
      reject(
        new Error(
          "Transaction has no transactionHash to wait for, did you execute it?",
        ),
      );
    }

    const request = getRpcClient({ client, chain });

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
            new Error(
              `Transaction not found after ${maxBlocksWaitTime} blocks`,
            ),
          );
          return;
        }
        try {
          const receipt = await eth_getTransactionReceipt(request, {
            hash: transactionHash as Hex,
          });

          // stop the polling
          unwatch();
          // resolve the top level promise with the receipt
          resolve(receipt);
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
