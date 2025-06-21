import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import * as watchBlockNumberExports from "../../rpc/watchBlockNumber.js";
import { METAMASK } from "../constants.js";
import { createWallet } from "../create-wallet.js";
import * as getCallsStatusExports from "./get-calls-status.js";
import type { GetCallsStatusResponse } from "./types.js";
import { waitForCallsReceipt } from "./wait-for-calls-receipt.js";

const MOCK_CALL_ID = "0x1234567890abcdef";

const MOCK_SUCCESS_RECEIPT: GetCallsStatusResponse = {
  atomic: false,
  chainId: 1,
  id: MOCK_CALL_ID,
  receipts: [
    {
      blockHash:
        "0xf19bbafd9fd0124ec110b848e8de4ab4f62bf60c189524e54213285e7f540d4a",
      blockNumber: 12345n,
      gasUsed: 12345n,
      logs: [],
      status: "success",
      transactionHash:
        "0x9b7bb827c2e5e3c1a0a44dc53e573aa0b3af3bd1f9f5ed03071b100bb039eaff",
    },
  ],
  status: "success",
  statusCode: 200,
  version: "2.0.0",
};

const MOCK_PENDING_RECEIPT: GetCallsStatusResponse = {
  atomic: false,
  chainId: 1,
  id: MOCK_CALL_ID,
  receipts: [],
  status: "pending",
  statusCode: 100,
  version: "2.0.0",
};

const mockGetCallsStatus = vi.spyOn(getCallsStatusExports, "getCallsStatus");

const wallet = createWallet(METAMASK);
wallet.getAccount = () => TEST_ACCOUNT_A;

let emitBlockNumber: (blockNumber: bigint) => void;

vi.spyOn(watchBlockNumberExports, "watchBlockNumber").mockImplementation(
  ({ onNewBlockNumber }) => {
    emitBlockNumber = (blockNumber: bigint) => {
      onNewBlockNumber(blockNumber);
    };
    return () => {};
  },
);

describe("waitForBundle", () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should resolve with transaction receipt when transactionHash is provided", async () => {
    mockGetCallsStatus.mockResolvedValueOnce(MOCK_SUCCESS_RECEIPT);

    // can't `await` here because we still need to be able to increment the block number below
    const res = waitForCallsReceipt({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      id: MOCK_CALL_ID,
      wallet,
    });

    emitBlockNumber(1n);

    await expect(res).resolves.toMatchObject(MOCK_SUCCESS_RECEIPT);
  });

  it("should reject with an error when bundle is not complete after waiting 10 blocks", async () => {
    mockGetCallsStatus.mockRejectedValue(MOCK_PENDING_RECEIPT);

    const result = waitForCallsReceipt({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      id: MOCK_CALL_ID,
      maxBlocksWaitTime: 10,
      wallet,
    });

    for (let i = 1; i <= 10 + 1; i++) {
      emitBlockNumber(BigInt(i));
    }

    await expect(result).rejects.toThrow(
      "Bundle not confirmed after 10 blocks",
    );
    expect(mockGetCallsStatus).toHaveBeenCalledTimes(10);
  });
});
