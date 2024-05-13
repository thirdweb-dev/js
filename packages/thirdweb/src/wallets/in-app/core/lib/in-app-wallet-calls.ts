import type { ThirdwebClient } from "../../../../client/client.js";
import { eth_getTransactionReceipt } from "../../../../rpc/actions/eth_getTransactionReceipt.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { sendBatchTransaction } from "../../../../transaction/actions/send-batch-transaction.js";
import { type Hex, generateRandomHex } from "../../../../utils/encoding/hex.js";
import type { PreparedSendCall } from "../../../eip5792/send-calls.js";
import type {
  GetCallsStatusResponse,
  WalletCallReceipt,
  WalletSendCallsId,
} from "../../../eip5792/types.js";
import type { Account, Wallet } from "../../../interfaces/wallet.js";

const bundlesToTransactions = new Map<string, Hex[]>();

/**
 * @internal
 */
export async function inAppWalletSendCalls(args: {
  account: Account;
  calls: PreparedSendCall[];
}): Promise<WalletSendCallsId> {
  const { account, calls } = args;

  const hashes: Hex[] = [];
  const bundleId = generateRandomHex(65);
  bundlesToTransactions.set(bundleId, hashes);
  if (account.sendBatchTransaction) {
    const receipt = await sendBatchTransaction({
      account,
      transactions: calls,
    });
    hashes.push(receipt.transactionHash);
    bundlesToTransactions.set(bundleId, hashes);
  } else {
    for (const tx of calls) {
      const receipt = await sendAndConfirmTransaction({
        account,
        transaction: tx,
      });
      hashes.push(receipt.transactionHash);
      bundlesToTransactions.set(bundleId, hashes);
    }
  }

  return bundleId;
}

/**
 * @internal
 */
export async function inAppWalletGetCallsStatus(args: {
  wallet: Wallet;
  client: ThirdwebClient;
  bundleId: string;
}): Promise<GetCallsStatusResponse> {
  const { wallet, client, bundleId } = args;

  const chain = wallet.getChain();
  if (!chain) {
    throw new Error("Failed to get calls status, no active chain found");
  }

  const bundle = bundlesToTransactions.get(bundleId);
  if (!bundle) {
    throw new Error("Failed to get calls status, unknown bundle id");
  }

  const request = getRpcClient({ client, chain });
  const receipts: WalletCallReceipt<bigint, "success" | "reverted">[] = [];
  let status: "CONFIRMED" | "PENDING" = "CONFIRMED";
  for (const hash of bundle) {
    try {
      const receipt = await eth_getTransactionReceipt(request, {
        hash,
      });
      receipts.push({
        logs: receipt.logs.map((l) => ({
          address: l.address,
          data: l.data,
          topics: l.topics,
        })),
        status: receipt.status,
        blockHash: receipt.blockHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        transactionHash: receipt.transactionHash,
      });
    } catch {
      status = "PENDING";
    }
  }

  return {
    status,
    receipts,
  };
}
