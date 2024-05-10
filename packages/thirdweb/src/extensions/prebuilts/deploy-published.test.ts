import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { ENTRYPOINT_ADDRESS_v0_6 } from "../../wallets/smart/lib/constants.js";
import { deployPublishedContract } from "./deploy-published.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "deployPublished",
  {
    timeout: 120000,
  },
  () => {
    it("should deploy a published direct deploy contract", async () => {
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "AccountFactory",
        contractParams: [TEST_ACCOUNT_A.address, ENTRYPOINT_ADDRESS_v0_6],
      });
      expect(address).toBeDefined();
      expect(address.length).toBe(42);
    });

    it("should deploy a published autofactory contract", async () => {
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "Airdrop",
        contractParams: [TEST_ACCOUNT_A.address, ""],
      });
      expect(address).toBeDefined();
      expect(address.length).toBe(42);
    });

    // TODO: Replace these tests' live contracts with mocks
    it("should deploy a published contract with no constructor", async () => {
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "Counter",
        publisher: "0x4a706de5CE9bfe2f9C37BA945805e396d1810824",
        contractParams: [],
      });
      expect(address).toBeDefined();
      expect(address.length).toBe(42);
    });

    it("should deploy a published contract with no deploy type", async () => {
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "MyToken",
        publisher: "0xc77e556cd96235A7B72d46EAAf13405d698CB2C0",
        contractParams: [],
      });
      expect(address).toBeDefined();
      expect(address.length).toBe(42);
    });
  },
);
