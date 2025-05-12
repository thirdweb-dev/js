import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { sepolia } from "../../../../chains/chain-definitions/sepolia.js";
import { inMemoryStorage } from "../../../../utils/storage/inMemoryStorage.js";
import { inAppWallet } from "../in-app.js";

describe("InAppWallet", () => {
  it("should sign a message with backend strategy", async () => {
    const wallet = inAppWallet({
      smartAccount: {
        chain: sepolia,
        sponsorGas: true,
      },
      storage: inMemoryStorage,
    });
    const account = await wallet.connect({
      client: TEST_CLIENT,
      strategy: "backend",
      walletSecret: "test-secret",
    });
    expect(account.address).toBeDefined();
    const message = await account.signMessage({
      message: "Hello, world!",
    });
    expect(message).toBeDefined();
  });
});
