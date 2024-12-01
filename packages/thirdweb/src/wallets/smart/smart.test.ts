import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { defineChain } from "../../chains/utils.js";
import { generateAccount } from "../utils/generateAccount.js";
import { connectSmartWallet, disconnectSmartWallet } from "./index.js";
import { smartWallet } from "./smart-wallet.js";

describe("Smart Wallet Index", () => {
  const chain = defineChain(1); // Ethereum mainnet
  const client = TEST_CLIENT;

  describe("connectSmartWallet", () => {
    it("should connect a smart wallet", async () => {
      const personalAccount = await generateAccount({ client });
      const wallet = smartWallet({
        chain,
        gasless: true,
      });

      const [account, connectedChain] = await connectSmartWallet(
        wallet,
        {
          client,
          personalAccount,
        },
        {
          chain,
          gasless: true,
        },
      );

      expect(account.address).toBeDefined();
      expect(account.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(connectedChain.id).toBe(chain.id);
    });
  });

  describe("disconnectSmartWallet", () => {
    it("should disconnect a smart wallet", async () => {
      const personalAccount = await generateAccount({ client });
      const wallet = smartWallet({
        chain,
        gasless: true,
      });

      await connectSmartWallet(
        wallet,
        {
          client,
          personalAccount,
        },
        {
          chain,
          gasless: true,
        },
      );

      await expect(disconnectSmartWallet(wallet)).resolves.not.toThrow();
    });

    it("should clear wallet mappings on disconnect", async () => {
      const personalAccount = await generateAccount({ client });
      const wallet = smartWallet({
        chain,
        gasless: true,
      });

      await connectSmartWallet(
        wallet,
        {
          client,
          personalAccount,
        },
        {
          chain,
          gasless: true,
        },
      );

      await disconnectSmartWallet(wallet);

      // Verify wallet state is cleared
      expect(wallet.getAccount()).toBeUndefined();
      expect(wallet.getAdminAccount?.()).toBeUndefined();
    });
  });
});
