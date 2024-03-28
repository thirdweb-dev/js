import { describe, it, expect } from "vitest";
import { deployCloneFactory } from "./bootstrap.js";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../test/src/test-wallets.js";
import { getDeployedCreate2Factory } from "./create-2-factory.js";
import { getDeployedInfraContract } from "./infra.js";
import { fail } from "assert";

describe("bootstrap", () => {
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
