import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import { defineChain } from "../../../chains/utils.js";
import { prepareTransaction } from "../../prepare-transaction.js";
import { sendEip712Transaction } from "./send-eip712-transaction.js";

describe("sendEip712Transaction", () => {
  // re-enable for testing, but disable for CI since it requires testnet funds
  it.skip("should send eip712 transaction", async () => {
    const transaction = prepareTransaction({
      chain: defineChain(300),
      client: TEST_CLIENT,
      value: 0n,
      to: TEST_ACCOUNT_B.address,
      eip712: {
        paymaster: "0xbA226d47Cbb2731CBAA67C916c57d68484AA269F",
        paymasterInput:
          "0x8c5a344500000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000",
      },
    });
    const res = await sendEip712Transaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });
    expect(res.transactionHash.length).toBe(66);
  });
});
