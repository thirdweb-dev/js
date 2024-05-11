import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { eth_getTransactionReceipt } from "../../../../exports/rpc.js";
import { getRpcClient } from "../../../../rpc/rpc.js";
import { sendBatchTransaction } from "../../../../transaction/actions/send-batch-transaction.js";
import { sendTransaction } from "../../../../transaction/actions/send-transaction.js";
import {
  type PrepareTransactionOptions,
  prepareTransaction,
} from "../../../../transaction/prepare-transaction.js";
import { type Hex, generateRandomHex } from "../../../../utils/encoding/hex.js";
import type { SendCallsOptions } from "../../../eip5792/send-calls.js";
import type {
  GetCallsStatusResponse,
  WalletCallReceipt,
  WalletSendCallsId,
} from "../../../eip5792/types.js";
import type { Wallet } from "../../../interfaces/wallet.js";

const bundlesToTransactions = new Map<string, Hex[]>();

/**
 * @internal
 */
export async function inAppWalletSendCalls(args: {
  wallet: Wallet<"inApp" | "embedded" | "smart">;
  client: ThirdwebClient;
  chain: Chain;
  calls: SendCallsOptions["calls"];
}): Promise<WalletSendCallsId> {
  const { wallet, client, chain, calls } = args;

  const account = wallet.getAccount();
  if (!account) {
    throw new Error(
      `Cannot send calls, no account connected for wallet: ${wallet.id}`,
    );
  }

  const callsToPrepare: PrepareTransactionOptions[] = calls.map((call) => ({
    ...call,
    client,
    chain,
  }));

  const preparedTransactions = callsToPrepare.map((c) => prepareTransaction(c));
  const hashes: Hex[] = [];
  if (account.sendBatchTransaction) {
    const receipt = await sendBatchTransaction({
      account,
      transactions: preparedTransactions,
    });
    hashes.push(receipt.transactionHash);
  } else {
    for (const tx of preparedTransactions) {
      const receipt = await sendTransaction({
        account,
        transaction: tx,
      });
      hashes.push(receipt.transactionHash);
    }
  }

  const bundleId = generateRandomHex(65);
  bundlesToTransactions.set(bundleId, hashes);
  return bundleId;
}

/**
 * @internal
 */
export async function inAppWalletGetCallsStatus(args: {
  wallet: Wallet<"inApp" | "embedded" | "smart">;
  client: ThirdwebClient;
  bundleId: string;
}): Promise<GetCallsStatusResponse> {
  const { wallet, client, bundleId } = args;

  const bundle = bundlesToTransactions.get(bundleId);
  if (!bundle) {
    throw new Error("Bundle identifier not found.");
  }

  const chain = wallet.getChain();
  if (!chain) {
    throw new Error("Can't get calls status, no active chain found.");
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
