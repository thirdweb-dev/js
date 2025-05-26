import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { baseSepolia } from "../../../../chains/chain-definitions/base-sepolia.js";
import { sendBatchTransaction } from "../../../../transaction/actions/send-batch-transaction.js";
import { prepareTransaction } from "../../../../transaction/prepare-transaction.js";
import { generateAccount } from "../../../utils/generateAccount.js";
import { inAppWallet } from "../../web/in-app.js";

const client = TEST_CLIENT;
const chain = baseSepolia;

describe.runIf(process.env.TW_SECRET_KEY)("7702 Minimal Account", () => {
  it("should batch transactions", async () => {
    const iaw = inAppWallet({
      executionMode: {
        mode: "EIP7702",
        sponsorGas: true,
      },
    });
    const account = await iaw.connect({
      client,
      strategy: "guest",
      chain,
    });
    const tx1 = prepareTransaction({
      client,
      chain,
      to: (await generateAccount({ client })).address,
      value: 0n,
    });
    const tx2 = prepareTransaction({
      client,
      chain,
      to: (await generateAccount({ client })).address,
      value: 0n,
    });
    const result = await sendBatchTransaction({
      account,
      transactions: [tx1, tx2],
    });
    expect(result.transactionHash).toBeDefined();
  });
});
