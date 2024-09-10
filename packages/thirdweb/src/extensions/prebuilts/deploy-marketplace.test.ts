import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { isAddress } from "../../utils/address.js";
import { deployMarketplaceContract } from "./deploy-marketplace.js";

describe.runIf(process.env.TW_SECRET_KEY)("deploy marketplace test", () => {
  it("should deploy marketplace contract", async () => {
    const address = await deployMarketplaceContract({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      account: TEST_ACCOUNT_A,
      params: {
        name: "marketplace contract",
      },
    });
    expect(isAddress(address)).toBe(true);
  });
});
