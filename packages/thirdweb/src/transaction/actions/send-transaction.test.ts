import { describe, expect, it, vi } from "vitest";
import { TEST_WALLET_B } from "../../../test/src/addresses.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { prepareTransaction } from "../prepare-transaction.js";
import * as TransactionStore from "../transaction-store.js";
import { sendTransaction } from "./send-transaction.js";

const addTransactionToStore = vi.spyOn(
  TransactionStore,
  "addTransactionToStore",
);

describe("sendTransaction", () => {
  it("should send transaction", async () => {
    const transaction = prepareTransaction({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      value: 100n,
      to: TEST_WALLET_B,
    });
    const res = await sendTransaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });

    expect(res.transactionHash.length).toBe(66);
  });

  it("should add transaction to session", async () => {
    const transaction = prepareTransaction({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      value: 100n,
      to: TEST_WALLET_B,
    });
    await sendTransaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });

    expect(addTransactionToStore).toHaveBeenCalled();
  });
});
