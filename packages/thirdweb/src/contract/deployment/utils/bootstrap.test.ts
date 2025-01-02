import { fail } from "node:assert";
import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../test/src/test-wallets.js";
import { defineChain } from "../../../chains/utils.js";
import {
  deployCloneFactory,
  getOrDeployInfraContract,
  getOrDeployInfraForPublishedContract,
} from "./bootstrap.js";
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
    });
    expect(forwarder).not.toBeNull();
    if (!forwarder) {
      fail("Forwarder not found");
    }
    const cloneFactory = await getDeployedInfraContract({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      contractId: "TWCloneFactory",
      constructorParams: {
        _trustedForwarder: forwarder.address,
      },
    });
    expect(cloneFactory).not.toBeNull();
  });

  it("should return saved implementations for zksync chains", async () => {
    let infra = await getOrDeployInfraForPublishedContract({
      client: TEST_CLIENT,
      chain: defineChain(300),
      account: TEST_ACCOUNT_A,
      contractId: "MarketplaceV3",
    });

    expect(infra.cloneFactoryContract.address).to.eq(
      "0xa51baf6a9c0ef5Db8C1898d5aDD92Bf3227d6088",
    );
    expect(infra.implementationContract.address).to.eq(
      "0x58e0F289C7dD2025eBd0696d913ECC0fdc1CC8bc",
    );

    infra = await getOrDeployInfraForPublishedContract({
      client: TEST_CLIENT,
      chain: defineChain(300),
      account: TEST_ACCOUNT_A,
      contractId: "DropERC721",
      version: "5.0.4",
    });

    expect(infra.cloneFactoryContract.address).to.eq(
      "0xa51baf6a9c0ef5Db8C1898d5aDD92Bf3227d6088",
    );
    expect(infra.implementationContract.address).toBeDefined();

    const weth = await getOrDeployInfraContract({
      client: TEST_CLIENT,
      chain: defineChain(300),
      account: TEST_ACCOUNT_A,
      contractId: "WETH9",
    });

    expect(weth.address).to.eq("0x0462C05457Fed440740Ff3696bDd2D0577411e34");
  });
});
