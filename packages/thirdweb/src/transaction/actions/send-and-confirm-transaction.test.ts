import { describe, it, expect } from "vitest";
import { TEST_WALLET_B } from "../../../test/src/addresses.js";
import { sendAndConfirmTransaction } from "./send-and-confirm-transaction.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { prepareTransaction } from "../prepare-transaction.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";

describe("sendAndConfirmTransaction", () => {
  it("should send transaction then wait for confirmation", async () => {
    const transaction = prepareTransaction({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      value: 100n,
      to: TEST_WALLET_B,
    });
    const res = await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });

    expect(res.transactionHash.length).toBe(66);
    expect(res.blockNumber).toBeGreaterThan(0n);
  });
});
