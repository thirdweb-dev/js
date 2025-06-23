import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../test/src/test-wallets.js";
import { deployFeeManager, getDeployedFeeManager } from "./bootstrap.js";

describe.runIf(process.env.TW_SECRET_KEY)("bootstrap asset infra", () => {
  it("should bootstrap fee manager", async () => {
    const feeManager = await deployFeeManager({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    const expectedFeeManager = await getDeployedFeeManager({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    expect(expectedFeeManager).toBeDefined();
    expect(feeManager.address.toLowerCase()).to.equal(
      expectedFeeManager?.address?.toLowerCase(),
    );
  });
});
