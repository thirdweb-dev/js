import { defineChain } from "src/chains/utils.js";
import { prepareTransaction } from "src/transaction/prepare-transaction.js";
import { inAppWallet } from "src/wallets/in-app/web/in-app.js";
import type { Account } from "src/wallets/interfaces/wallet.js";
import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../test/src/test-wallets.js";
import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { sessionCreatedEvent } from "../__generated__/MinimalAccount/events/SessionCreated.js";
import { createSessionKey } from "./createSessionKey.js";
import { Condition, LimitType } from "./types.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "Session Key Behavior",
  {
    retry: 0,
    timeout: 240_000,
  },
  () => {
    const chainId = 11155111;
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
      });

      // Send a null tx to trigger deploy/upgrade
      await sendAndConfirmTransaction({
        account: account,
        transaction: prepareTransaction({
          chain: defineChain(chainId),
          client: TEST_CLIENT,
          to: account.address,
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
          durationInSeconds: 86400,
          grantFullPermissions: true, // 1 day
          sessionKeyAddress: TEST_ACCOUNT_A.address,
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
          callPolicies: [
            {
              constraints: [
                {
                  condition: Condition.Unconstrained,
                  index: 0n,
                  refValue:
                    "0x0000000000000000000000000000000000000000000000000000000000000000",
                },
              ],
              maxValuePerUse: 0n,
              selector: "0x00000000",
              target: ZERO_ADDRESS,
              valueLimit: {
                limit: 0n,
                limitType: LimitType.Unlimited,
                period: 0n,
              },
            },
          ],
          contract: accountContract,
          durationInSeconds: 86400, // 1 day
          grantFullPermissions: false,
          sessionKeyAddress: TEST_ACCOUNT_A.address,
          transferPolicies: [
            {
              maxValuePerUse: 0n,
              target: ZERO_ADDRESS,
              valueLimit: {
                limit: 0n,
                limitType: 0,
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
  },
);
