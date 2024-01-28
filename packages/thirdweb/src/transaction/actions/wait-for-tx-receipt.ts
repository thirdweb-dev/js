import type { Hex, TransactionReceipt } from "viem";
import type { ThirdwebContract } from "../../contract/index.js";
import {
  getRpcClient,
  eth_getTransactionReceipt,
  watchBlockNumber,
} from "../../rpc/index.js";
import type { Abi } from "abitype";

const MAX_BLOCKS_WAIT_TIME = 10;

const map = new Map<string, Promise<TransactionReceipt>>();

export function waitForReceipt<abi extends Abi>({
  transactionHash,
  contract,
}: {
  transactionHash: string;
  contract: ThirdwebContract<abi>;
}): Promise<TransactionReceipt> {
  const key = `${contract.chainId}:${transactionHash}`;

  if (map.has(key)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return map.get(key)!;
  }
  const promise = new Promise<TransactionReceipt>((resolve, reject) => {
    if (!transactionHash) {
      reject(
        new Error("Transaction has no txHash to wait for, did you execute it?"),
      );
    }

    const request = getRpcClient(contract.client, {
      chainId: contract.chainId,
    });

    // start at -1 because the first block doesn't count
    let blocksWaited = -1;

    const unwatch = watchBlockNumber({
      client: contract.client,
      chainId: contract.chainId,
      onNewBlockNumber: () => {
        blocksWaited++;
        console.log("blocksWaited", blocksWaited);
        if (blocksWaited >= MAX_BLOCKS_WAIT_TIME) {
          unwatch();
          reject(new Error("Transaction not found after 10 blocks"));
        }
        eth_getTransactionReceipt(request, {
          hash: transactionHash as Hex,
        })
          .then((receipt) => {
            if (receipt) {
              unwatch();
              return resolve(receipt);
            }
          })
          .catch(() => {
            // noop, we'll try again on the next blocks
          });
      },
    });
    // remove the promise from the map when it's done (one way or the other)
  }).finally(() => {
    map.delete(key);
  });

  map.set(key, promise);
  return promise;
}
