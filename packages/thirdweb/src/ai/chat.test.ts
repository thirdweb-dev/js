import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { TEST_ACCOUNT_A, TEST_ACCOUNT_B } from "../../test/src/test-wallets.js";
import { sepolia } from "../chains/chain-definitions/sepolia.js";
import * as Nebula from "./index.js";

describe.runIf(process.env.TW_SECRET_KEY)("chat", () => {
  it("should respond with a message", async () => {
    const response = await Nebula.chat({
      client: TEST_CLIENT,
      prompt: `What's the symbol of this contract: 0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8`,
      context: {
        chains: [sepolia],
      },
    });
    expect(response.message).toContain("CAT");
  });

  it("should respond with a transaction", async () => {
    const response = await Nebula.chat({
      client: TEST_CLIENT,
      prompt: `send 0.0001 ETH on sepolia to ${TEST_ACCOUNT_B.address}`,
      account: TEST_ACCOUNT_A,
      context: {
        chains: [sepolia],
        walletAddresses: [TEST_ACCOUNT_A.address],
      },
    });
    expect(response.transactions.length).toBe(1);
  });
});
