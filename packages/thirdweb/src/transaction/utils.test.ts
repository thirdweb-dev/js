import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A, TEST_ACCOUNT_B } from "~test/test-wallets.js";
import { prepareTransaction } from "./prepare-transaction.js";
import { getTransactionGasCost } from "./utils.js";

describe.runIf(process.env.TW_SECRET_KEY)("Transaction utils", () => {
  it("should get transaction gas cost", async () => {
    const transaction = prepareTransaction({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      to: TEST_ACCOUNT_A.address,
      value: 1000000000n,
    });
    const data = await getTransactionGasCost(
      transaction,
      TEST_ACCOUNT_B.address,
    );
    expect(typeof data).toBe("bigint");
    expect(data > 0n).toBe(true);
  });
});
