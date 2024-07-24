import type { TransactionSerializable } from "viem";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../../prepare-transaction.js";
import { addTransactionToStore } from "../../transaction-store.js";
import type { WaitForReceiptOptions } from "../wait-for-tx-receipt.js";
import type { GaslessOptions } from "./types.js";

export type SendGaslessTransactionOptions = {
  account: Account;
  // TODO: update this to `Transaction<"prepared">` once the type is available to ensure only prepared transactions are accepted
  // biome-ignore lint/suspicious/noExplicitAny: library function that accepts any prepared transaction type
  transaction: PreparedTransaction<any>;
  serializableTransaction: TransactionSerializable;
  gasless: GaslessOptions;
};

export async function sendGaslessTransaction({
  account,
  transaction,
  serializableTransaction,
  gasless,
}: SendGaslessTransactionOptions): Promise<WaitForReceiptOptions> {
  // TODO: handle special case for mutlicall transactions!
  // Steps:
  // 1. check if the method is `multicall` by comparing the 4bytes data with the `multicall` selector
  // 2. split the rest of the data into its "parts"
  // 3. solidityPack the parts with the part data + the `account.address`
  // see v4: `core/classes/transactions.ts>Transaction>prepareGasless:L551`

  if (serializableTransaction.value && serializableTransaction.value > 0n) {
    throw new Error("Gasless transactions cannot have a value");
  }

  // TODO: multiply gas by 2 for some reason(?) - we do in v4, *should* we?

  let result: WaitForReceiptOptions | undefined;

  // biconomy
  if (gasless.provider === "biconomy") {
    const { relayBiconomyTransaction } = await import(
      "./providers/biconomy.js"
    );
    result = await relayBiconomyTransaction({
      account,
      transaction,
      serializableTransaction,
      gasless,
    });
  }

  // openzeppelin
  if (gasless.provider === "openzeppelin") {
    const { relayOpenZeppelinTransaction } = await import(
      "./providers/openzeppelin.js"
    );
    result = await relayOpenZeppelinTransaction({
      account,
      transaction,
      serializableTransaction,
      gasless,
    });
  }

  if (gasless.provider === "engine") {
    const { relayEngineTransaction } = await import("./providers/engine.js");
    result = await relayEngineTransaction({
      account,
      transaction,
      serializableTransaction,
      gasless,
    });
  }

  if (!result) {
    throw new Error("Unsupported gasless provider");
  }
  addTransactionToStore({
    address: account.address,
    transactionHash: result.transactionHash,
    chainId: transaction.chain.id,
  });
  return result;
}
