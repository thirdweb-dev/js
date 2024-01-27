import type { TransactionReceipt } from "viem";
import type { ThirdwebContract } from "../../contract/index.js";
import { getRpcClient } from "../../rpc/index.js";
import { getTransactionReceipt } from "../../rpc/methods.js";
import type { Abi } from "abitype";

const POLL_LIMIT_MS = 1000 * 60 * 5; // 5 minutes
const POLL_WAIT_MS = 1000 * 5; // 5 seconds

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
  const promise = (async function () {
    if (!transactionHash) {
      throw new Error(
        "Transaction has no txHash to wait for, did you execute it?",
      );
    }
    const start = Date.now();
    const rpcClient = getRpcClient(contract, { chainId: contract.chainId });
    while (Date.now() - start < POLL_LIMIT_MS) {
      // if we don't yet have a tx hash then we can't check for a receipt, so just try again

      const receipt = await getTransactionReceipt(rpcClient, transactionHash);
      if (receipt) {
        return receipt;
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_WAIT_MS));
    }
    throw new Error("Timeout waiting for transaction receipt");
  })();
  // remove the promise from the map when it's done (one way or the other)
  promise.finally(() => {
    map.delete(key);
  });
  map.set(key, promise);
  return promise;
}
