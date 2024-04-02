import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendTransaction } from "./send-transaction.js";
import { USDC_CONTRACT } from "../../../test/src/test-contracts.js";
import { TEST_WALLET_A, TEST_WALLET_B } from "../../../test/src/addresses.js";
import { transfer } from "../../extensions/erc20/write/transfer.js";
import type { Account } from "../../wallets/interfaces/wallet.js";

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
describe.runIf(process.env.TW_SECRET_KEY)("sendTransaction", () => {
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
  });
});
