import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { USDC_CONTRACT } from "../../../test/src/test-contracts.js";
import { TEST_WALLET_A, TEST_WALLET_B } from "../../../test/src/addresses.js";
import { transfer } from "../../extensions/erc20/write/transfer.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import * as waitForReceiptExports from "./wait-for-tx-receipt.js";
import type { TransactionReceipt } from "../types.js";
import { sendAndConfirmTransaction } from "./send-and-confirm-transaction.js";

const MOCK_TX_HASH =
  "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef";

const mockAccount = {
  address: TEST_WALLET_A,
  sendTransaction: vi.fn().mockResolvedValue({ transactionHash: MOCK_TX_HASH }),
  signMessage: vi.fn().mockResolvedValue("0xabcdef1234567890"),
  signTypedData: vi.fn().mockResolvedValue("0xabcdef1234567890"),
} satisfies Account;

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

describe("sendAndConfirmTransaction", () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send transaction then wait for confirmation", async () => {
    const res = sendAndConfirmTransaction({
      account: mockAccount,
      transaction: TRANSACTION,
    });

    await expect(res).resolves.toMatchObject(MOCK_SUCCESS_RECEIPT);
    expect(mockAccount.sendTransaction).toHaveBeenCalledTimes(1);
    expect(waitForReceiptExports.waitForReceipt).toHaveBeenCalledTimes(1);
    expect(mockAccount.sendTransaction.mock.lastCall[0]).toMatchObject(
      TX_RESULT,
    );
  });
});
