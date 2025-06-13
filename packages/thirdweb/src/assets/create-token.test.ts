import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../test/src/test-wallets.js";
import { createTokenByImplConfig } from "./create-token-by-impl-config.js";

describe.runIf(process.env.TW_SECRET_KEY)("create token by impl config", () => {
  it("should create token without pool", async () => {
    const token = await createTokenByImplConfig({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      account: TEST_ACCOUNT_A,
      params: {
        name: "Test",
      },
      salt: "salt123",
    });

    expect(token).toBeDefined();
  });
});
