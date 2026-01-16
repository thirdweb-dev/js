import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { eth_getTransactionReceipt } from "../../../../rpc/actions/eth_getTransactionReceipt.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { sendBatchTransaction } from "../../../../transaction/actions/send-batch-transaction.js";
import type { SendTransactionOptions } from "../../../../transaction/actions/send-transaction.js";
import { LruMap } from "../../../../utils/caching/lru.js";
import type { Hex } from "../../../../utils/encoding/hex.js";
import { randomBytesHex } from "../../../../utils/random.js";
import type { PreparedSendCall } from "../../../eip5792/send-calls.js";
import type {
  GetCallsStatusRawResponse,
  GetCallsStatusResponse,
  WalletCallReceipt,
} from "../../../eip5792/types.js";
import type { Account } from "../../../interfaces/wallet.js";

const bundlesToTransactions = new LruMap<Hex[]>(1000);

/**
 * @internal
 */
export async function inAppWalletSendCalls(args: {
  account: Account;
  calls: PreparedSendCall[];
  chain: Chain;
}): Promise<string> {
  const { account, calls } = args;

  const transactions: SendTransactionOptions["transaction"][] = calls.map(
    (call) => ({
      ...call,
      chain: args.chain,
    }),
  );

  const hashes: Hex[] = [];
  const id = randomBytesHex(65);
  bundlesToTransactions.set(id, hashes);
  if (account.sendBatchTransaction) {
    const receipt = await sendBatchTransaction({
      account,
      transactions,
    });
    hashes.push(receipt.transactionHash);
    bundlesToTransactions.set(id, hashes);
  } else {
    for (const tx of transactions) {
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
  chain: Chain;
  client: ThirdwebClient;
  id: string;
}): Promise<GetCallsStatusResponse> {
  const { chain, client, id } = args;

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

/**
 * @internal
 */
export async function inAppWalletGetCallsStatusRaw(args: {
  chain: Chain;
  client: ThirdwebClient;
  id: string;
}): Promise<GetCallsStatusRawResponse> {
  const { chain, client, id } = args;

  const bundle = bundlesToTransactions.get(id);
  if (!bundle) {
    throw new Error("Failed to get calls status, unknown bundle id");
  }

  const request = getRpcClient({ chain, client });
  let status = 200; // BATCH_STATE_CONFIRMED
  const receipts: GetCallsStatusRawResponse["receipts"] = [];

  for (const hash of bundle) {
    try {
      const receipt = await eth_getTransactionReceipt(request, { hash });
      receipts.push({
        blockHash: receipt.blockHash,
        blockNumber: `0x${receipt.blockNumber.toString(16)}` as `0x${string}`,
        gasUsed: `0x${receipt.gasUsed.toString(16)}` as `0x${string}`,
        logs: receipt.logs.map((l) => ({
          address: l.address as `0x${string}`,
          data: l.data as `0x${string}`,
          topics: l.topics as `0x${string}`[],
        })),
        status: receipt.status === "success" ? "0x1" : "0x0",
        transactionHash: receipt.transactionHash as `0x${string}`,
      });
    } catch {
      status = 100; // BATCH_STATE_PENDING
    }
  }

  return {
    atomic: false,
    chainId: `0x${chain.id.toString(16)}` as `0x${string}`,
    id: id as `0x${string}`,
    receipts,
    status,
    version: "2.0.0",
  };
}
