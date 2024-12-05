import { base } from "src/chains/chain-definitions/base.js";
import { sendTransaction } from "src/transaction/actions/send-transaction.js";
import { prepareTransaction } from "src/transaction/prepare-transaction.js";
import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { setThirdwebDomains } from "../../utils/domains.js";
import type { Account } from "../interfaces/wallet.js";
import { privateKeyToAccount } from "../private-key.js";
import { smartWallet } from "./smart-wallet.js";

let personalAccount: Account;

const client = TEST_CLIENT;

describe.runIf(process.env.TW_SECRET_KEY).skip.sequential(
  "SmartWallet policy tests",
  {
    retry: 0,
    timeout: 240_000,
  },
  () => {
    beforeAll(async () => {
      setThirdwebDomains({
        rpc: "rpc.thirdweb-dev.com",
        storage: "storage.thirdweb-dev.com",
        bundler: "bundler.thirdweb-dev.com",
      });
      personalAccount = await privateKeyToAccount({
        client,
        privateKey:
          "edf401e8ddbb743f3353b055081cb220ce4c5c04e08da162d86e0dba7c6f0f01", // 0xa470E7c88611364f55B2d7912613e10AF2eA918D
      });
    });

    it("can self transfer with BASE_USDC", async () => {
      const wallet = smartWallet({
        chain: base,
        gasless: true,
        overrides: {
          tokenPaymaster: "BASE_USDC",
        },
      });
      const smartAccount = await wallet.connect({
        client: TEST_CLIENT,
        personalAccount,
      });

      console.log("smartAccount", smartAccount.address);

      const tx = prepareTransaction({
        client,
        chain: base,
        to: smartAccount.address,
        value: 0n,
      });
      const receipt = await sendTransaction({
        transaction: tx,
        account: smartAccount,
      });
      expect(receipt.transactionHash).toBeDefined();
    });
  },
);
