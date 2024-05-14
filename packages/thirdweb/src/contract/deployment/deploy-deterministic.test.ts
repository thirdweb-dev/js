import { describe, expect, it } from "vitest";
import {
  ANVIL_CHAIN,
  FORKED_ETHEREUM_CHAIN,
  FORKED_OPTIMISM_CHAIN,
} from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { simulateTransaction } from "../../transaction/actions/simulate.js";
import { ENTRYPOINT_ADDRESS_v0_6 } from "../../wallets/smart/lib/constants.js";
import { prepareDeterministicDeployTransaction } from "./deploy-deterministic.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("deployFromMetadata", () => {
  it("should deploy contracts at the same address", async () => {
    const tx1 = prepareDeterministicDeployTransaction({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      contractId: "AccountFactory",
      constructorParams: [TEST_ACCOUNT_A.address, ENTRYPOINT_ADDRESS_v0_6],
    });
    const tx2 = prepareDeterministicDeployTransaction({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      contractId: "AccountFactory",
      constructorParams: [TEST_ACCOUNT_A.address, ENTRYPOINT_ADDRESS_v0_6],
    });
    const [tx1Result, tx2Result] = await Promise.all([
      simulateTransaction({ transaction: tx1 }),
      simulateTransaction({ transaction: tx2 }),
    ]);
    expect(tx1Result).toEqual(tx2Result);
  });

  it("should respect salt param", async () => {
    const tx1 = prepareDeterministicDeployTransaction({
      chain: FORKED_ETHEREUM_CHAIN,
      client: TEST_CLIENT,
      contractId: "AccountFactory",
      constructorParams: [TEST_ACCOUNT_A.address, ENTRYPOINT_ADDRESS_v0_6],
      salt: "some-salt",
    });
    const tx2 = prepareDeterministicDeployTransaction({
      chain: FORKED_OPTIMISM_CHAIN,
      client: TEST_CLIENT,
      contractId: "AccountFactory",
      constructorParams: [TEST_ACCOUNT_A.address, ENTRYPOINT_ADDRESS_v0_6],
    });
    const [tx1Result, tx2Result] = await Promise.all([
      simulateTransaction({ transaction: tx1 }),
      simulateTransaction({ transaction: tx2 }),
    ]);
    expect(tx1Result !== tx2Result).toBe(true);
  });
  // TODO: Replace these tests' live contracts with mocks
  it("should deploy a published contract with no constructor", async () => {
    const tx = prepareDeterministicDeployTransaction({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      contractId: "Counter",
      publisher: "0x4a706de5CE9bfe2f9C37BA945805e396d1810824",
      constructorParams: [],
    });

    const txResult = await simulateTransaction({ transaction: tx });
    expect(txResult).toBeDefined();
  });
});
