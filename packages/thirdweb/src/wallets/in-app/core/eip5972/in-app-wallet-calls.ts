import type { ThirdwebClient } from "../../../../client/client.js";
import { eth_getTransactionReceipt } from "../../../../rpc/actions/eth_getTransactionReceipt.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { sendBatchTransaction } from "../../../../transaction/actions/send-batch-transaction.js";
import { LruMap } from "../../../../utils/caching/lru.js";
import type { Hex } from "../../../../utils/encoding/hex.js";
import { randomBytesHex } from "../../../../utils/random.js";
import type { PreparedSendCall } from "../../../eip5792/send-calls.js";
import type {
  GetCallsStatusResponse,
  WalletCallReceipt,
} from "../../../eip5792/types.js";
import type { Account, Wallet } from "../../../interfaces/wallet.js";

const bundlesToTransactions = new LruMap<Hex[]>(1000);

/**
 * @internal
 */
export async function inAppWalletSendCalls(args: {
  account: Account;
  calls: PreparedSendCall[];
}): Promise<string> {
  const { account, calls } = args;

  const hashes: Hex[] = [];
  const id = randomBytesHex(65);
  bundlesToTransactions.set(id, hashes);
  if (account.sendBatchTransaction) {
    const receipt = await sendBatchTransaction({
      account,
      transactions: calls,
    });
    hashes.push(receipt.transactionHash);
    bundlesToTransactions.set(id, hashes);
  } else {
    for (const tx of calls) {
      const receipt = await sendAndConfirmTransaction({
        account,
        transaction: tx,
      });
      hashes.push(receipt.transactionHash);
      bundlesToTransactions.set(id, hashes);
    }
  }

  return id;
}

/**
 * @internal
 */
export async function inAppWalletGetCallsStatus(args: {
  wallet: Wallet;
  client: ThirdwebClient;
  id: string;
}): Promise<GetCallsStatusResponse> {
  const { wallet, client, id } = args;

  const chain = wallet.getChain();
  if (!chain) {
    throw new Error("Failed to get calls status, no active chain found");
  }

  const bundle = bundlesToTransactions.get(id);
  if (!bundle) {
    throw new Error("Failed to get calls status, unknown bundle id");
  }

  const request = getRpcClient({ chain, client });
  let status: "pending" | "success" | "failure" = "success";
  const receipts: (WalletCallReceipt<bigint, "success" | "reverted"> | null)[] =
    await Promise.all(
      bundle.map((hash) =>
        eth_getTransactionReceipt(request, { hash })
          .then((receipt) => ({
            blockHash: receipt.blockHash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed,
            logs: receipt.logs.map((l) => ({
              address: l.address,
              data: l.data,
              topics: l.topics,
            })),
            status: receipt.status,
            transactionHash: receipt.transactionHash,
          }))
          .catch(() => {
            status = "pending";
            return null; // Return null if there's an error to filter out later
          }),
      ),
    );

  return {
    atomic: false,
    chainId: chain.id,
    id,
    receipts: receipts.filter((r) => r !== null),
    status,
    statusCode: 200,
    version: "2.0.0",
  };
}
