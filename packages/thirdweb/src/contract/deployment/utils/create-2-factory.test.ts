import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../test/src/test-wallets.js";
import { defineChain } from "../../../chains/utils.js";
import {
  computeCreate2FactoryAddress,
  deployCreate2Factory,
  getDeployedCreate2Factory,
} from "./create-2-factory.js";

describe.runIf(process.env.TW_SECRET_KEY)("create2 factory tests", () => {
  it("should compute create2 factory address", async () => {
    const addr = await computeCreate2FactoryAddress({
      chain: defineChain(1),
      client: TEST_CLIENT,
    });

    expect(addr).to.eq("0x4e59b44847b379578588920cA78FbF26c0B4956C");
  });

  it("should compute create2 factory address with custom gas", async () => {
    const addr = await computeCreate2FactoryAddress({
      chain: defineChain(1564830818),
      client: TEST_CLIENT,
    });

    expect(addr).to.eq("0x50620b64D9524aC7dC8c967123E87e5b6dB98f0c");
  });

  it("should deploy create2 factory", async () => {
    await deployCreate2Factory({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    const create2Factory = await getDeployedCreate2Factory({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
    expect(create2Factory).not.toBeNull();
  });
});
