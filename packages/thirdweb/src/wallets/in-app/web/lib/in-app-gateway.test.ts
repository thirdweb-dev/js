import { sendTransaction, signMessage } from "@thirdweb-dev/engine";
import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { sepolia } from "../../../../chains/chain-definitions/sepolia.js";
import { createThirdwebClient } from "../../../../client/client.js";
import { waitForTransactionHash } from "../../../../engine/wait-for-tx-hash.js";
import {
  getThirdwebBaseUrl,
  setThirdwebDomains,
} from "../../../../utils/domains.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import type { Account } from "../../../interfaces/wallet.js";
import { inAppWallet } from "../in-app.js";

// TODO: productionize this test
describe
  .runIf(process.env.TW_SECRET_KEY)
  .skip("InAppWallet Gateway Tests", () => {
    let account: Account;
    let authToken: string | null | undefined;
    const clientIdFetch = getClientFetch(
      createThirdwebClient({
        clientId: TEST_CLIENT.clientId,
      }),
    );

    beforeAll(async () => {
      setThirdwebDomains({
        bundler: "bundler.thirdweb-dev.com",
        engineCloud: "engine.thirdweb-dev.com",
        inAppWallet: "embedded-wallet.thirdweb-dev.com",
        rpc: "rpc.thirdweb-dev.com",
      });
      const wallet = inAppWallet();
      account = await wallet.connect({
        client: TEST_CLIENT,
        strategy: "backend",
        walletSecret: "test-secret",
      });
      authToken = wallet.getAuthToken?.();
      expect(authToken).toBeDefined();
    });

    it("should sign a message with backend strategy", async () => {
      const rawSignature = await account.signMessage({
        message: "Hello, world!",
      });

      // sign via api
      const signResult = await signMessage({
        baseUrl: getThirdwebBaseUrl("engineCloud"),
        body: {
          params: [
            {
              format: "text",
              message: "Hello, world!",
            },
          ],
          signingOptions: {
            from: account.address,
            type: "eoa",
          },
        },
        bodySerializer: stringify,
        fetch: clientIdFetch,
        headers: {
          "x-wallet-access-token": authToken,
        },
      });

      const signatureResult = signResult.data?.result?.results[0];
      if (signatureResult && "result" in signatureResult) {
        expect(signatureResult.result.signature).toEqual(rawSignature);
      } else {
        throw new Error(
          `Failed to sign message: ${stringify(signatureResult?.error) || "Unknown error"}`,
        );
      }
    });

    it("should queue a 4337 transaction", async () => {
      const body = {
        executionOptions: {
          chainId: sepolia.id,
          from: account.address,
          type: "auto" as const,
        },
        params: [
          {
            data: "0x",
            to: account.address,
            value: "0",
          },
        ],
      };
      const result = await sendTransaction({
        baseUrl: getThirdwebBaseUrl("engineCloud"),
        body,
        bodySerializer: stringify,
        fetch: clientIdFetch,
        headers: {
          "x-wallet-access-token": authToken,
        },
      });
      if (result.error) {
        throw new Error(
          `Error sending transaction: ${stringify(result.error)}`,
        );
      }

      const txId = result.data?.result.transactions[0]?.id;
      console.log(txId);
      if (!txId) {
        throw new Error("No transaction ID found");
      }

      const tx = await waitForTransactionHash({
        client: TEST_CLIENT,
        transactionId: txId,
      });

      console.log(tx);
      expect(tx.transactionHash).toBeDefined();
    });
  });
