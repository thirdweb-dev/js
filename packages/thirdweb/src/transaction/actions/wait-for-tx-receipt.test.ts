import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { waitForReceipt } from "./wait-for-tx-receipt.js";
import type { TransactionReceipt } from "viem";
import { transfer } from "../../extensions/erc20.js";
import { TEST_WALLET_B } from "../../../test/src/addresses.js";
import { USDC_CONTRACT } from "../../../test/src/test-contracts.js";
import * as rpcExports from "../../rpc/index.js";

const MOCK_TX_HASH = "0x1234567890abcdef";

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

const TRANSACTION = transfer({
  to: TEST_WALLET_B,
  amount: 100,
  contract: USDC_CONTRACT,
});

const mockEthGetTransactionReceipt = vi.spyOn(
  rpcExports,
  "eth_getTransactionReceipt",
);

let emitBlockNumber: (blockNumber: bigint) => void;

vi.spyOn(rpcExports, "watchBlockNumber").mockImplementation(
  ({ onNewBlockNumber }) => {
    emitBlockNumber = (blockNumber: bigint) => {
      onNewBlockNumber(blockNumber);
    };
    return () => {};
  },
);

describe("waitForReceipt", () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should resolve with transaction receipt when transactionHash is provided", async () => {
    mockEthGetTransactionReceipt.mockResolvedValueOnce(MOCK_SUCCESS_RECEIPT);

    // can't `await` here because we still need to be able to increment the block number below
    const res = waitForReceipt({
      transaction: TRANSACTION,
      transactionHash: MOCK_TX_HASH,
    });

    emitBlockNumber(1n);

    await expect(res).resolves.toMatchObject(MOCK_SUCCESS_RECEIPT);
  });

  it("should reject with an error when neither transactionHash nor userOpHash is provided", async () => {
    // @ts-expect-error - this is what we're testing
    const result = waitForReceipt({ transaction: TRANSACTION });

    await expect(result).rejects.toThrow(
      "Transaction has no txHash to wait for, did you execute it?",
    );
    expect(mockEthGetTransactionReceipt).not.toHaveBeenCalled();
  });

  it("should reject with an error when transaction is not found after waiting 10 blocks", async () => {
    const result = waitForReceipt({
      transaction: TRANSACTION,
      transactionHash: MOCK_TX_HASH,
    });

    // this is actually 11 blocks because the "first" block does not count (will fire immediately)
    emitBlockNumber(1n);
    emitBlockNumber(2n);
    emitBlockNumber(3n);
    emitBlockNumber(4n);
    emitBlockNumber(5n);
    emitBlockNumber(6n);
    emitBlockNumber(7n);
    emitBlockNumber(8n);
    emitBlockNumber(9n);
    emitBlockNumber(10n);
    emitBlockNumber(11n);

    await expect(result).rejects.toThrow(
      "Transaction not found after 10 blocks",
    );
    expect(mockEthGetTransactionReceipt).toHaveBeenCalledTimes(10);
  });

  // TODO userop tests
});
