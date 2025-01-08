import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { defineChain } from "../../chains/utils.js";
import { generateAccount } from "../utils/generateAccount.js";
import { smartWallet } from "./smart-wallet.js";

describe.runIf(process.env.TW_SECRET_KEY)("Smart Wallet Index", () => {
  const chain = defineChain(1); // Ethereum mainnet
  const client = TEST_CLIENT;

  describe("connectSmartWallet", () => {
    it("should connect a smart wallet", async () => {
      const personalAccount = await generateAccount({ client });
      const wallet = smartWallet({
        chain,
        gasless: true,
      });

      await wallet.connect({
        client,
        personalAccount,
      });

      expect(wallet.getAccount()?.address).toBeDefined();
      expect(wallet.getAccount()?.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(wallet.getChain()?.id).toBe(chain.id);
    });
  });

  describe("disconnectSmartWallet", () => {
    it("should disconnect a smart wallet", async () => {
      const personalAccount = await generateAccount({ client });

      const wallet = smartWallet({
        chain,
        gasless: true,
      });

      await wallet.connect({
        client,
        personalAccount,
      });

      await expect(wallet.disconnect()).resolves.not.toThrow();
    });

    it("should clear wallet mappings on disconnect", async () => {
      const personalAccount = await generateAccount({ client });

      const wallet = smartWallet({
        chain,
        gasless: true,
      });

      await wallet.connect({
        client,
        personalAccount,
      });

      await wallet.disconnect();

      // Verify wallet state is cleared
      expect(wallet.getAccount()).toBeUndefined();
      expect(wallet.getAdminAccount?.()).toBeUndefined();
    });
  });
});
