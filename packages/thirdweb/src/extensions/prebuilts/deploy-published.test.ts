import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { ENTRYPOINT_ADDRESS } from "../../wallets/smart/lib/constants.js";
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
        contractParams: [TEST_ACCOUNT_A.address, ENTRYPOINT_ADDRESS],
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
        contractParams: [TEST_ACCOUNT_A.address],
      });
      expect(address).toBeDefined();
      expect(address.length).toBe(42);
    });
  },
);
