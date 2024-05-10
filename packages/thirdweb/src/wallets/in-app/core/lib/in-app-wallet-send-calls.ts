import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { sendBatchTransaction } from "../../../../transaction/actions/send-batch-transaction.js";
import { sendTransaction } from "../../../../transaction/actions/send-transaction.js";
import {
  type PrepareTransactionOptions,
  prepareTransaction,
} from "../../../../transaction/prepare-transaction.js";
import type { Hex } from "../../../../utils/encoding/hex.js";
import type { SendCallsOptions } from "../../../eip5792/send-calls.js";
import type { WalletSendCallsId } from "../../../eip5792/types.js";
import type { Wallet } from "../../../interfaces/wallet.js";

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

  return "0";
}
