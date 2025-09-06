import {
  configure,
  isSuccessResponse,
  sendTransaction,
  signMessage,
} from "@thirdweb-dev/engine";
import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { sepolia } from "../../../../chains/chain-definitions/sepolia.js";
import { waitForTransactionHash } from "../../../../engine/wait-for-tx-hash.js";
import { stringify } from "../../../../utils/json.js";
import type { Account } from "../../../interfaces/wallet.js";
import { inAppWallet } from "../in-app.js";

describe.runIf(process.env.TW_SECRET_KEY)("InAppWallet Gateway Tests", () => {
  let account: Account;
  let authToken: string | null | undefined;

  beforeAll(async () => {
    configure({
      clientId: TEST_CLIENT.clientId,
      secretKey: TEST_CLIENT.secretKey,
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
      body: {
        params: [
          {
            format: "text",
            message: "Hello, world!",
          },
        ],
        signingOptions: {
          from: account.address,
          type: "EOA",
        },
      },
      headers: {
        "x-wallet-access-token": authToken,
      },
    });

    if (signResult.error) {
      throw new Error(`Error signing message: ${stringify(signResult.error)}`);
    }

    const signatureResult = signResult.data?.result?.[0];
    if (signatureResult && isSuccessResponse(signatureResult)) {
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
      body,
      headers: {
        "x-wallet-access-token": authToken,
      },
    });
    if (result.error) {
      throw new Error(`Error sending transaction: ${stringify(result.error)}`);
    }

    const txId = result.data?.result.transactions[0]?.id;
    if (!txId) {
      throw new Error("No transaction ID found");
    }

    const tx = await waitForTransactionHash({
      client: TEST_CLIENT,
      transactionId: txId,
    });

    console.log(tx.transactionHash);
    expect(tx.transactionHash).toBeDefined();
  });
});
