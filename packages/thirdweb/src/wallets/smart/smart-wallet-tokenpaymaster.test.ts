import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { base } from "../../chains/chain-definitions/base.js";
import { celo } from "../../chains/chain-definitions/celo.js";
import { defineChain } from "../../chains/utils.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import { privateKeyToAccount } from "../private-key.js";
import { TokenPaymaster } from "./lib/constants.js";
import { smartWallet } from "./smart-wallet.js";

const client = TEST_CLIENT;

describe.runIf(process.env.TW_SECRET_KEY).skip.sequential(
  "SmartWallet token paymaster tests",
  {
    retry: 0,
    timeout: 240_000,
  },
  () => {
    it.skip("should send a transaction with base usdc", async () => {
      const chain = base;
      const tokenPaymaster = TokenPaymaster.BASE_USDC;
      const personalAccount = privateKeyToAccount({
        client,
        privateKey:
          "edf401e8ddbb743f3353b055081cb220ce4c5c04e08da162d86e0dba7c6f0f01", // 0xa470E7c88611364f55B2d7912613e10AF2eA918D
      });
      const wallet = smartWallet({
        chain,
        gasless: true,
        overrides: {
          tokenPaymaster,
        },
      });
      const smartAccount = await wallet.connect({
        client: TEST_CLIENT,
        personalAccount,
      });
      const tx = prepareTransaction({
        chain,
        client,
        to: smartAccount.address,
        value: 0n,
      });
      const receipt = await sendTransaction({
        account: smartAccount,
        transaction: tx,
      });
      expect(receipt.transactionHash).toBeDefined();
    });

    it.skip("should send a transaction with base celo", async () => {
      const chain = celo;
      const tokenPaymaster = TokenPaymaster.CELO_CUSD;
      const personalAccount = privateKeyToAccount({
        client,
        privateKey:
          "edf401e8ddbb743f3353b055081cb220ce4c5c04e08da162d86e0dba7c6f0f01", // 0xa470E7c88611364f55B2d7912613e10AF2eA918D
      });
      const wallet = smartWallet({
        chain,
        gasless: true,
        overrides: {
          tokenPaymaster,
        },
      });
      const smartAccount = await wallet.connect({
        client: TEST_CLIENT,
        personalAccount,
      });
      const tx = prepareTransaction({
        chain,
        client,
        to: smartAccount.address,
        value: 0n,
      });
      const receipt = await sendTransaction({
        account: smartAccount,
        transaction: tx,
      });
      expect(receipt.transactionHash).toBeDefined();
    });

    it("should send a transaction with base lisk", async () => {
      const chain = defineChain(1135);
      const tokenPaymaster = TokenPaymaster.LISK_LSK;
      const personalAccount = privateKeyToAccount({
        client,
        privateKey:
          "edf401e8ddbb743f3353b055081cb220ce4c5c04e08da162d86e0dba7c6f0f01", // 0xa470E7c88611364f55B2d7912613e10AF2eA918D
      });
      const wallet = smartWallet({
        chain,
        gasless: true,
        overrides: {
          tokenPaymaster,
        },
      });
      const smartAccount = await wallet.connect({
        client: TEST_CLIENT,
        personalAccount,
      });
      const tx = prepareTransaction({
        chain,
        client,
        to: smartAccount.address,
        value: 0n,
      });
      const receipt = await sendTransaction({
        account: smartAccount,
        transaction: tx,
      });
      expect(receipt.transactionHash).toBeDefined();
    });
  },
);
