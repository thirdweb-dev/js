import { afterEach, describe, expect, test, vi } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { METAMASK } from "../constants.js";
import { createWallet } from "../create-wallet.js";
import type { Wallet } from "../interfaces/wallet.js";
import { getCallsStatus } from "./get-calls-status.js";
import { type SendCallsOptions, sendCalls } from "./send-calls.js";

const RAW_UNSUPPORTED_ERROR = {
  code: -32601,
  message: "some nonsense the wallet sends us about not supporting",
};

const SEND_CALLS_OPTIONS: Omit<SendCallsOptions, "wallet"> = {
  calls: [
    {
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      data: "0xabcdef",
      to: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
    },
    {
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      to: "0xa922b54716264130634d6ff183747a8ead91a40b",
      value: 123n,
    },
  ],
};

const mocks = vi.hoisted(() => ({
  getTransactionReceipt: vi.fn(),
  injectedRequest: vi.fn(),
}));

vi.mock("../injected/index.js", () => {
  return {
    getInjectedProvider: vi.fn().mockReturnValue({
      request: mocks.injectedRequest,
    }),
  };
});

vi.mock("../../rpc/actions/eth_getTransactionReceipt.js", () => {
  return {
    eth_getTransactionReceipt: mocks.getTransactionReceipt.mockResolvedValue({
      blockHash:
        "0xf19bbafd9fd0124ec110b848e8de4ab4f62bf60c189524e54213285e7f540d4a",
      blockNumber: 12345n,
      gasUsed: 12345n,
      logs: [],
      status: "success",
      transactionHash:
        "0x9b7bb827c2e5e3c1a0a44dc53e573aa0b3af3bd1f9f5ed03071b100bb039eaff",
    }),
  };
});

vi.mock("../../transaction/actions/send-and-confirm-transaction.js", () => {
  return {
    sendAndConfirmTransaction: vi.fn().mockResolvedValue({
      transactionHash:
        "0x9b7bb827c2e5e3c1a0a44dc53e573aa0b3af3bd1f9f5ed03071b100bb039eaff",
    }),
  };
});

vi.mock("../../transaction/actions/send-batch-transaction.js", () => {
  return {
    sendBatchTransaction: vi.fn().mockResolvedValue({
      transactionHash:
        "0x9b7bb827c2e5e3c1a0a44dc53e573aa0b3af3bd1f9f5ed03071b100bb039eaff",
    }),
  };
});

describe.sequential("injected wallet", async () => {
  const wallet: Wallet = createWallet(METAMASK);

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("with no account should fail", async () => {
    wallet.getAccount = vi.fn().mockReturnValue(undefined);

    const promise = getCallsStatus({
      client: TEST_CLIENT,
      id: "test",
      wallet: wallet,
    });

    await expect(promise).rejects.toMatchInlineSnapshot(
      `[Error: Failed to get call status, no account found for wallet ${wallet.id}]`,
    );
  });

  test("should successfully make request", async () => {
    wallet.getAccount = vi.fn().mockReturnValue(TEST_ACCOUNT_A);
    mocks.injectedRequest.mockResolvedValue({
      receipts: [],
      status: "CONFIRMED",
    });

    const result = await getCallsStatus({
      client: TEST_CLIENT,
      id: "test",
      wallet: wallet,
    });

    expect(mocks.injectedRequest).toHaveBeenCalledWith({
      method: "wallet_getCallsStatus",
      params: ["test"],
    });
    expect(result).toMatchInlineSnapshot(`
      {
        "atomic": false,
        "chainId": undefined,
        "receipts": [],
        "status": "success",
        "statusCode": 200,
        "version": "2.0.0",
      }
    `);
  });

  test("without support should fail", async () => {
    mocks.injectedRequest.mockRejectedValue(RAW_UNSUPPORTED_ERROR);
    wallet.getAccount = vi.fn().mockReturnValue(TEST_ACCOUNT_A);

    const promise = getCallsStatus({
      client: TEST_CLIENT,
      id: "test",
      wallet: wallet,
    });

    await expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: io.metamask does not support wallet_getCallsStatus, reach out to them directly to request EIP-5792 support.]",
    );
  });
});

describe.sequential("in-app wallet", async () => {
  const sendTransaction = vi.fn();
  const sendBatchTransaction = vi.fn();
  let wallet: Wallet = createWallet("inApp");

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("default", async () => {
    wallet.getAccount = vi.fn().mockReturnValue({
      ...TEST_ACCOUNT_A,
      sendTransaction,
    });
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);

    const callResult = await sendCalls({
      wallet: wallet,
      ...SEND_CALLS_OPTIONS,
    });

    const result = await getCallsStatus(callResult);

    expect(result.status).toEqual("success");
    expect(result.receipts?.length).toEqual(2);
  });

  test("with smart account", async () => {
    wallet = createWallet("inApp", {
      smartAccount: { chain: ANVIL_CHAIN, sponsorGas: true },
    });
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue({
      ...TEST_ACCOUNT_A,
      sendBatchTransaction,
    });

    const callResult = await sendCalls({
      wallet: wallet,
      ...SEND_CALLS_OPTIONS,
    });

    const result = await getCallsStatus(callResult);

    expect(result.status).toEqual("success");
    expect(result.receipts?.length).toEqual(1);
  });

  test("with pending transaction", async () => {
    mocks.getTransactionReceipt.mockRejectedValue(null);

    wallet = createWallet("inApp");
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue({
      ...TEST_ACCOUNT_A,
      sendTransaction,
    });

    const callResult = await sendCalls({
      wallet: wallet,
      ...SEND_CALLS_OPTIONS,
    });

    const result = await getCallsStatus(callResult);

    expect(result.status).toEqual("pending");
    expect(result.receipts?.length).toEqual(0);
  });

  test("unknown bundle id should fail", async () => {
    const promise = getCallsStatus({
      client: TEST_CLIENT,
      id: "unknown",
      wallet: wallet,
    });

    await expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: Failed to get calls status, unknown bundle id]",
    );
  });

  test("without chain should fail", async () => {
    wallet.getChain = vi.fn().mockReturnValue(undefined);

    const promise = getCallsStatus({
      client: TEST_CLIENT,
      id: "test",
      wallet: wallet,
    });

    await expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: Failed to get calls status, no active chain found]",
    );
  });
});
