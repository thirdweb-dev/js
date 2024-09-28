import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_D } from "~test/test-wallets.js";
import { isAddress } from "../../utils/address.js";
import { deploySplitContract } from "./deploy-split.js";

describe.runIf(process.env.TW_SECRET_KEY)("deploy-split contract", () => {
  it("should deploy Split contract", async () => {
    const address = await deploySplitContract({
      account: TEST_ACCOUNT_D,
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      params: {
        name: "split-contract",
        payees: [
          "0x12345674b599ce99958242b3D3741e7b01841DF3",
          "0xA6f11e47dE28B3dB934e945daeb6F538E9019694",
        ],
        shares: [
          5100n, // 51%
          4900n, // 49%
        ],
      },
    });
    expect(address).toBeDefined();
    expect(isAddress(address)).toBe(true);
    // Further tests to verify the functionality of this contract
    // are done in other Split tests
  });
});
