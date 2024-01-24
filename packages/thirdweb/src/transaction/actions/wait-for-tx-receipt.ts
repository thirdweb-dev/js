import { getRpcClient } from "../../rpc/index.js";
import { getTransactionReceipt } from "../../rpc/methods.js";
import type { Transaction } from "../transaction.js";
import type { AbiFunction } from "abitype";

const POLL_LIMIT_MS = 1000 * 60 * 5; // 5 minutes
const POLL_WAIT_MS = 1000 * 5; // 5 seconds

export async function waitForReceipt<const abiFn extends AbiFunction>(
  tx: Transaction<abiFn>,
) {
  if (!tx.transactionHash) {
    throw new Error(
      "Transaction has no txHash to wait for, did you execute it?",
    );
  }
  const start = Date.now();
  const rpcClient = getRpcClient(tx.client, { chainId: tx.chainId });
  while (Date.now() - start < POLL_LIMIT_MS) {
    // if we don't yet have a tx hash then we can't check for a receipt, so just try again

    const receipt = await getTransactionReceipt(rpcClient, tx.transactionHash);
    if (receipt) {
      return receipt;
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_WAIT_MS));
  }
  throw new Error("Timeout waiting for transaction receipt");
}
