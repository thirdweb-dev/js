import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { baseSepolia } from "../../../../chains/chain-definitions/base-sepolia.js";
import { sepolia } from "../../../../chains/chain-definitions/sepolia.js";
import { parseEventLogs } from "../../../../event/actions/parse-logs.js";
import { userOperationEventEvent } from "../../../../extensions/erc4337/__generated__/IEntryPoint/events/UserOperationEvent.js";
import { executedEvent } from "../../../../extensions/erc7702/__generated__/MinimalAccount/events/Executed.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { sendBatchTransaction } from "../../../../transaction/actions/send-batch-transaction.js";
import { prepareTransaction } from "../../../../transaction/prepare-transaction.js";
import { generateAccount } from "../../../utils/generateAccount.js";
import { inAppWallet } from "../in-app.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "InAppWallet Integration Tests",
  () => {
    it("should sign a message with backend strategy", async () => {
      const wallet = inAppWallet();
      const account = await wallet.connect({
        client: TEST_CLIENT,
        strategy: "backend",
        walletSecret: "test-secret",
      });
      expect(account.address).toBeDefined();
      const message = await account.signMessage({
        message: "Hello, world!",
      });
      expect(message).toBeDefined();
    });

    it("should sign a message with guest strategy", async () => {
      const wallet = inAppWallet();
      const account = await wallet.connect({
        client: TEST_CLIENT,
        strategy: "guest",
      });
      expect(account.address).toBeDefined();
      const message = await account.signMessage({
        message: "Hello, world!",
      });
      expect(message).toBeDefined();
    });

    it("should sponsor gas for a 7702 smart account", async () => {
      const chain = sepolia;
      const wallet = inAppWallet({
        executionMode: {
          mode: "EIP7702",
          sponsorGas: true,
        },
      });
      const account = await wallet.connect({
        chain,
        client: TEST_CLIENT,
        strategy: "guest",
      });
      expect(account.address).toBeDefined();
      const tx = await sendAndConfirmTransaction({
        account,
        transaction: prepareTransaction({
          chain,
          client: TEST_CLIENT,
          to: account.address,
          value: 0n,
        }),
      });
      expect(tx.transactionHash).toBeDefined();
      const logs = parseEventLogs({
        events: [executedEvent()],
        logs: tx.logs,
      });
      const executedLog = logs[0];
      if (!executedLog) {
        throw new Error("No executed log found");
      }
      expect(executedLog.args.to).toBe(account.address);
      expect(executedLog.args.value).toBe(0n);
    });

    it("should sponsor gas for a 4337 smart account", async () => {
      const chain = sepolia;
      const wallet = inAppWallet({
        executionMode: {
          mode: "EIP4337",
          smartAccount: {
            chain,
            sponsorGas: true,
          },
        },
      });
      const account = await wallet.connect({
        chain,
        client: TEST_CLIENT,
        strategy: "guest",
      });
      expect(account.address).toBeDefined();
      const tx = await sendAndConfirmTransaction({
        account,
        transaction: prepareTransaction({
          chain,
          client: TEST_CLIENT,
          to: account.address,
          value: 0n,
        }),
      });
      expect(tx.transactionHash).toBeDefined();
      const logs = parseEventLogs({
        events: [userOperationEventEvent()],
        logs: tx.logs,
      });
      const executedLog = logs[0];
      if (!executedLog) {
        throw new Error("No executed log found");
      }
      expect(executedLog.args.sender).toBe(account.address);
      expect(executedLog.args.success).toBe(true);
    });

    it("should batch transaction for a 7702 account", async () => {
      const chain = baseSepolia;
      const iaw = inAppWallet({
        executionMode: {
          mode: "EIP7702",
          sponsorGas: true,
        },
      });
      const account = await iaw.connect({
        chain,
        client: TEST_CLIENT,
        strategy: "guest",
      });
      const tx1 = prepareTransaction({
        chain,
        client: TEST_CLIENT,
        to: (await generateAccount({ client: TEST_CLIENT })).address,
        value: 0n,
      });
      const tx2 = prepareTransaction({
        chain,
        client: TEST_CLIENT,
        to: (await generateAccount({ client: TEST_CLIENT })).address,
        value: 0n,
      });
      const result = await sendBatchTransaction({
        account,
        transactions: [tx1, tx2],
      });
      expect(result.transactionHash).toBeDefined();
    });
  },
);
