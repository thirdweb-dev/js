import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../../prepare-transaction.js";
import type { SerializableTransaction } from "../../serialize-transaction.js";
import { addTransactionToStore } from "../../transaction-store.js";
import type { WaitForReceiptOptions } from "../wait-for-tx-receipt.js";
import type { GaslessOptions } from "./types.js";

type SendGaslessTransactionOptions = {
  account: Account;
  // TODO: update this to `Transaction<"prepared">` once the type is available to ensure only prepared transactions are accepted
  // biome-ignore lint/suspicious/noExplicitAny: library function that accepts any prepared transaction type
  transaction: PreparedTransaction<any>;
  serializableTransaction: SerializableTransaction;
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
      gasless,
      serializableTransaction,
      transaction,
    });
  }

  // openzeppelin
  if (gasless.provider === "openzeppelin") {
    const { relayOpenZeppelinTransaction } = await import(
      "./providers/openzeppelin.js"
    );
    result = await relayOpenZeppelinTransaction({
      account,
      gasless,
      serializableTransaction,
      transaction,
    });
  }

  if (gasless.provider === "engine") {
    const { relayEngineTransaction } = await import("./providers/engine.js");
    result = await relayEngineTransaction({
      account,
      gasless,
      serializableTransaction,
      transaction,
    });
  }

  if (!result) {
    throw new Error("Unsupported gasless provider");
  }
  addTransactionToStore({
    address: account.address,
    chainId: transaction.chain.id,
    transactionHash: result.transactionHash,
  });
  return result;
}
