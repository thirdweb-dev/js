import type { TransactionReceipt } from "viem";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_WALLET_B } from "../../../test/src/addresses.js";
import { USDT_CONTRACT } from "../../../test/src/test-contracts.js";
import { transfer } from "../../extensions/erc20/write/transfer.js";
import * as ethGetTransactionReceiptExports from "../../rpc/actions/eth_getTransactionReceipt.js";
import * as watchBlockNumberExports from "../../rpc/watchBlockNumber.js";
import {
  DEFAULT_MAX_BLOCKS_WAIT_TIME,
  waitForReceipt,
} from "./wait-for-tx-receipt.js";

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
  contract: USDT_CONTRACT,
});

const mockEthGetTransactionReceipt = vi.spyOn(
  ethGetTransactionReceiptExports,
  "eth_getTransactionReceipt",
);

let emitBlockNumber: (blockNumber: bigint) => void;

vi.spyOn(watchBlockNumberExports, "watchBlockNumber").mockImplementation(
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
      chain: TRANSACTION.chain,
      client: TRANSACTION.client,
      transactionHash: MOCK_TX_HASH,
    });

    emitBlockNumber(1n);

    await expect(res).resolves.toMatchObject(MOCK_SUCCESS_RECEIPT);
  });

  it("should reject with an error when neither transactionHash nor userOpHash is provided", async () => {
    // @ts-expect-error - this is what we're testing
    const result = waitForReceipt({
      chain: TRANSACTION.chain,
      client: TRANSACTION.client,
    });

    await expect(result).rejects.toThrow(
      "Transaction has no transactionHash to wait for, did you execute it?",
    );
    expect(mockEthGetTransactionReceipt).not.toHaveBeenCalled();
  });

  it("should reject with an error when transaction is not found after waiting 10 blocks", async () => {
    const result = waitForReceipt({
      chain: TRANSACTION.chain,
      client: TRANSACTION.client,
      transactionHash: MOCK_TX_HASH,
    });

    for (let i = 1; i <= DEFAULT_MAX_BLOCKS_WAIT_TIME + 1; i++) {
      emitBlockNumber(BigInt(i));
    }

    await expect(result).rejects.toThrow(
      `Transaction not found after ${DEFAULT_MAX_BLOCKS_WAIT_TIME} blocks`,
    );
    expect(mockEthGetTransactionReceipt).toHaveBeenCalledTimes(30);
  });
});
