import { fail } from "node:assert";
import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../test/src/test-wallets.js";
import { deployCloneFactory } from "./bootstrap.js";
import { getDeployedCreate2Factory } from "./create-2-factory.js";
import { getDeployedInfraContract } from "./infra.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("bootstrap", () => {
  it("should bootstrap onchain infra", async () => {
    await deployCloneFactory({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      account: TEST_ACCOUNT_A,
    });

    // verify all contracts are deployed
    const create2Factory = await getDeployedCreate2Factory({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
    expect(create2Factory).not.toBeNull();
    const forwarder = await getDeployedInfraContract({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      contractId: "Forwarder",
      constructorParams: [],
    });
    expect(forwarder).not.toBeNull();
    if (!forwarder) {
      fail("Forwarder not found");
    }
    const cloneFactory = await getDeployedInfraContract({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      contractId: "TWCloneFactory",
      constructorParams: [forwarder.address],
    });
    expect(cloneFactory).not.toBeNull();
  });
});
