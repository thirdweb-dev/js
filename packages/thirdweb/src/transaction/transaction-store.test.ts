import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../test/src/chains.js";
import { TEST_ACCOUNT_A } from "../../test/src/test-wallets.js";
import type { Address } from "../utils/address.js";
import {
  addTransactionToStore,
  getTransactionStore,
} from "./transaction-store.js";

const MOCK_TX_HASH = "0x1234567890abcdef";

describe("transaction-store", () => {
  it("should return no transactions initially", async () => {
    const transactions = getTransactionStore(TEST_ACCOUNT_A.address as Address);
    expect(transactions.getValue()).toEqual([]);
  });

  it("should update transactions on completion", async () => {
    addTransactionToStore({
      address: TEST_ACCOUNT_A.address as Address,
      chainId: ANVIL_CHAIN.id,
      transactionHash: MOCK_TX_HASH,
    });

    const transactions = getTransactionStore(TEST_ACCOUNT_A.address as Address);
    expect(transactions.getValue()).toEqual([
      {
        chainId: ANVIL_CHAIN.id,
        transactionHash: MOCK_TX_HASH,
      },
    ]);

    addTransactionToStore({
      address: TEST_ACCOUNT_A.address,
      chainId: 1,
      transactionHash: "0xabc",
    });

    const transactions2 = getTransactionStore(TEST_ACCOUNT_A.address);
    expect(transactions2.getValue()).toEqual([
      {
        chainId: ANVIL_CHAIN.id,
        transactionHash: MOCK_TX_HASH,
      },
      {
        chainId: 1,
        transactionHash: "0xabc",
      },
    ]);
  });
});
