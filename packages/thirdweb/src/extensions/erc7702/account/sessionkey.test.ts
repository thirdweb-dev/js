import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { sessionCreatedEvent } from "../__generated__/MinimalAccount/events/SessionCreated.js";
import { createSessionKey } from "./createSessionKey.js";
import { inAppWallet } from "src/wallets/in-app/web/in-app.js";
import { prepareTransaction } from "src/transaction/prepare-transaction.js";
import type { Account } from "src/wallets/interfaces/wallet.js";
import { defineChain } from "src/chains/utils.js";

describe.runIf(process.env.TW_SECRET_KEY)("Session Key Behavior", {
    retry: 0,
    timeout: 240_000,
  },() => {
  let chainId = 11155111;
  let account: Account;
  let accountContract: ThirdwebContract;

  beforeAll(async () => {
    // Create 7702 Smart EOA
    const wallet = inAppWallet({
      executionMode: {
        mode: "EIP7702",
        sponsorGas: true,
      },
    });
    account = await wallet.connect({
      chain: defineChain(chainId),
      client: TEST_CLIENT,
      strategy: "guest",
    })

    // Send a null tx to trigger deploy/upgrade
    await sendAndConfirmTransaction({
      account: account,
      transaction: prepareTransaction({
        to: account.address,
        chain: defineChain(chainId),
        client: TEST_CLIENT,
        value: 0n,
      }),
    });

    // Will auto resolve abi since it's deployed
    accountContract = getContract({
      address: account.address,
      chain: defineChain(chainId),
      client: TEST_CLIENT,
    });
  }, 120_000);

  it("should allow adding adminlike session keys", async () => {
    const receipt = await sendAndConfirmTransaction({
      account: account,
      transaction: createSessionKey({
        account: account,
        contract: accountContract,
        sessionKeyAddress: TEST_ACCOUNT_A.address,
        durationInSeconds: 86400, // 1 day
        grantFullPermissions: true
      }),
    });
    const logs = parseEventLogs({
      events: [sessionCreatedEvent()],
      logs: receipt.logs,
    });
    expect(logs[0]?.args.signer).toBe(TEST_ACCOUNT_A.address);
  });

  it("should allow adding granular session keys", async () => {
    const receipt = await sendAndConfirmTransaction({
      account: account,
      transaction: createSessionKey({
        account: account,
        contract: accountContract,
        sessionKeyAddress: TEST_ACCOUNT_A.address,
        durationInSeconds: 86400, // 1 day
        grantFullPermissions: false,
        callPolicies: [
          {
            target: ZERO_ADDRESS,
            selector: "0x00000000",
            maxValuePerUse: 0n,
            valueLimit: {
              limitType: 0,
              limit: 0n,
              period: 0n,
            },
            constraints: [],
          },
        ],
        transferPolicies: [
          {
            target: ZERO_ADDRESS,
            maxValuePerUse: 0n,
            valueLimit: {
              limitType: 0,
              limit: 0n,
              period: 0n,
            },
          },
        ],
      }),
    });
    const logs = parseEventLogs({
      events: [sessionCreatedEvent()],
      logs: receipt.logs,
    });
    expect(logs[0]?.args.signer).toBe(TEST_ACCOUNT_A.address);
    expect(logs[0]?.args.sessionSpec.callPolicies).toHaveLength(1);
    expect(logs[0]?.args.sessionSpec.transferPolicies).toHaveLength(1);
  });
});
