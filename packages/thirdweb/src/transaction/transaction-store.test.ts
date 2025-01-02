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
      transactionHash: MOCK_TX_HASH,
      chainId: ANVIL_CHAIN.id,
    });

    const transactions = getTransactionStore(TEST_ACCOUNT_A.address as Address);
    expect(transactions.getValue()).toEqual([
      {
        transactionHash: MOCK_TX_HASH,
        chainId: ANVIL_CHAIN.id,
      },
    ]);

    addTransactionToStore({
      address: TEST_ACCOUNT_A.address,
      transactionHash: "0xabc",
      chainId: 1,
    });

    const transactions2 = getTransactionStore(TEST_ACCOUNT_A.address);
    expect(transactions2.getValue()).toEqual([
      {
        transactionHash: MOCK_TX_HASH,
        chainId: ANVIL_CHAIN.id,
      },
      {
        transactionHash: "0xabc",
        chainId: 1,
      },
    ]);
  });
});
