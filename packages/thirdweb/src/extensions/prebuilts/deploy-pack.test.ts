import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { isAddress } from "../../utils/address.js";
import { deployPackContract } from "./deploy-pack.js";

describe.runIf(process.env.TW_SECRET_KEY)("deploy-pack contract", () => {
  it("should deploy Pack contract", async () => {
    const address = await deployPackContract({
      account: TEST_ACCOUNT_A,
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      params: {
        name: "pack-contract",
      },
    });
    expect(address).toBeDefined();
    expect(isAddress(address)).toBe(true);
    // Further tests to verify the functionality of this contract
    // are done in other Pack tests
  });
});
