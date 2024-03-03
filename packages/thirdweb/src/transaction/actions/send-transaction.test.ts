import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { sendTransaction } from "./send-transaction.js";
import { USDC_CONTRACT } from "../../../test/src/test-contracts.js";
import { TEST_WALLET_A, TEST_WALLET_B } from "../../../test/src/addresses.js";
import { transfer } from "../../extensions/erc20/write/transfer.js";
import type { Account, Wallet } from "../../wallets/interfaces/wallet.js";
import * as waitForReceiptExports from "./wait-for-tx-receipt.js";
import type { TransactionReceipt } from "../types.js";

const MOCK_TX_HASH =
  "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef";

const mockAccount = {
  address: TEST_WALLET_A,
  sendTransaction: vi.fn().mockResolvedValue({ transactionHash: MOCK_TX_HASH }),
  signMessage: vi.fn().mockResolvedValue("0xabcdef1234567890"),
  signTypedData: vi.fn().mockResolvedValue("0xabcdef1234567890"),
} satisfies Account;

const mockWallet = {
  getAccount: vi.fn().mockReturnValue(mockAccount),
  getChain: vi.fn().mockReturnValue({ id: 1 }),
  switchChain: vi.fn().mockResolvedValue(undefined),
  metadata: {
    id: "mock",
    name: "Mock Wallet",
    iconUrl: "https://example.com/icon.png",
  },
  connect: vi.fn().mockResolvedValue(mockAccount),
  autoConnect: vi.fn().mockResolvedValue(mockAccount),
  disconnect: vi.fn().mockResolvedValue(undefined),
} satisfies Wallet;

const TRANSACTION = transfer({
  to: TEST_WALLET_B,
  amount: 100,
  contract: USDC_CONTRACT,
});

const TX_RESULT = {
  accessList: undefined,
  chainId: 1,
  data: "0xa9059cbb00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000005f5e100",
  gas: 45134n,
  nonce: 0,
  to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  value: undefined,
};

const MOCK_SUCCESS_RECEIPT: TransactionReceipt = {
  transactionHash: MOCK_TX_HASH,
  blockNumber: 1234n,
  status: "success",
  blockHash: "0xabcdef1234567890",
  contractAddress: "0x1234567890abcdef",
  cumulativeGasUsed: 123456n,
  from: "0xabcdef1234567890",
  gasUsed: 123456n,
  logs: [],
  logsBloom: "0xabcdef1234567890",
  to: "0x1234567890abcdef",
  transactionIndex: 1234,
  effectiveGasPrice: 123456n,
  type: "legacy",
  root: "0xabcdef1234567890",
  blobGasPrice: 123456n,
  blobGasUsed: 123456n,
};

vi.spyOn(waitForReceiptExports, "waitForReceipt").mockResolvedValueOnce(
  MOCK_SUCCESS_RECEIPT,
);

describe("sendTransaction", () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("account", () => {
    it("should send a transaction", async () => {
      const res = await sendTransaction({
        account: mockAccount,
        transaction: TRANSACTION,
      });
      expect(res.transactionHash).toEqual(MOCK_TX_HASH);
      expect(mockAccount.sendTransaction).toHaveBeenCalledTimes(1);
      expect(mockAccount.sendTransaction.mock.lastCall[0]).toMatchObject(
        TX_RESULT,
      );
    });

    it("should await receipt if waitForReceipt is true", async () => {
      const res = await sendTransaction({
        account: mockAccount,
        transaction: TRANSACTION,
        waitForReceipt: true,
      });
      expect(res).toEqual(MOCK_SUCCESS_RECEIPT);
      expect(waitForReceiptExports.waitForReceipt).toHaveBeenCalledTimes(1);
    });
  });

  describe("wallet", () => {
    it("should send a transaction", async () => {
      const res = await sendTransaction({
        wallet: mockWallet,
        transaction: TRANSACTION,
      });
      expect(res.transactionHash).toEqual(MOCK_TX_HASH);
      expect(mockAccount.sendTransaction).toHaveBeenCalledTimes(1);
      expect(mockAccount.sendTransaction.mock.lastCall[0]).toMatchObject(
        TX_RESULT,
      );
    });

    it("should switch chains if the chain mismatches", async () => {
      const wallet = {
        ...mockWallet,
        getChain: vi.fn().mockReturnValue({ id: 5 }),
      };
      const res = await sendTransaction({
        wallet,
        transaction: TRANSACTION,
      });

      expect(wallet.switchChain).toHaveBeenCalledTimes(1);
      // we should've switched to the chain of the transaction
      expect(wallet.switchChain.mock.lastCall[0]).toMatchObject({ id: 1 });
      expect(res.transactionHash).toEqual(MOCK_TX_HASH);
      expect(mockAccount.sendTransaction).toHaveBeenCalledTimes(1);
      expect(mockAccount.sendTransaction.mock.lastCall[0]).toMatchObject(
        TX_RESULT,
      );
    });

    it("should throw if not connected", async () => {
      const wallet = {
        ...mockWallet,
        getAccount: vi.fn().mockReturnValue(undefined),
      };
      await expect(
        sendTransaction({
          wallet,
          transaction: TRANSACTION,
        }),
      ).rejects.toThrow("not connected");
    });
  });
});
