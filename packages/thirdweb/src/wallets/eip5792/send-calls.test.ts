import { afterEach } from "node:test";
import { beforeAll, describe, expect, test, vi } from "vitest";
import {
  ANVIL_CHAIN,
  FORKED_ETHEREUM_CHAIN,
} from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { sepolia } from "../../exports/chains.js";
import { numberToHex } from "../../utils/encoding/hex.js";
import { METAMASK } from "../constants.js";
import { createWallet } from "../create-wallet.js";
import type { Wallet } from "../interfaces/wallet.js";
import { type SendCallsOptions, sendCalls } from "./send-calls.js";

const SEND_CALLS_OPTIONS: Omit<SendCallsOptions, "wallet"> = {
  client: TEST_CLIENT,
  calls: [
    {
      to: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
      data: "0xabcdef",
    },
    {
      to: "0xa922b54716264130634d6ff183747a8ead91a40b",
      value: 123n,
    },
  ],
};

const RAW_UNSUPPORTED_ERROR = {
  code: -32601,
  message: "some nonsense the wallet sends us about not supporting",
};

const mocks = vi.hoisted(() => ({
  injectedRequest: vi.fn(),
  sendAndConfirmTransaction: vi.fn(),
  sendBatchTransaction: vi.fn(),
}));

vi.mock("../injected/index.js", () => {
  return {
    getInjectedProvider: vi.fn().mockReturnValue({
      request: mocks.injectedRequest,
    }),
  };
});

vi.mock("../../transaction/actions/send-and-confirm-transaction.js", () => {
  return {
    sendAndConfirmTransaction:
      mocks.sendAndConfirmTransaction.mockResolvedValue({
        transactionHash:
          "0x9b7bb827c2e5e3c1a0a44dc53e573aa0b3af3bd1f9f5ed03071b100bb039eaff",
      }),
  };
});

vi.mock("../../transaction/actions/send-batch-transaction.js", () => {
  return {
    sendBatchTransaction: mocks.sendBatchTransaction.mockResolvedValue({
      transactionHash:
        "0x9b7bb827c2e5e3c1a0a44dc53e573aa0b3af3bd1f9f5ed03071b100bb039eaff",
    }),
  };
});

describe.sequential("injected wallet", () => {
  const wallet: Wallet = createWallet(METAMASK);

  beforeAll(() => {
    mocks.injectedRequest.mockResolvedValue("0x123456");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("with no chain should fail to send calls", () => {
    wallet.getChain = vi.fn().mockReturnValue(undefined);
    wallet.getAccount = vi.fn().mockReturnValue(TEST_ACCOUNT_A);

    const promise = sendCalls({ wallet, ...SEND_CALLS_OPTIONS });
    expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: Cannot send calls, no active chain found for wallet: io.metamask]",
    );
  });

  test("with no account should fail to send calls", () => {
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue(undefined);

    const promise = sendCalls({ wallet, ...SEND_CALLS_OPTIONS });
    expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: Cannot send calls, no account connected for wallet: io.metamask]",
    );
  });

  test("should send calls", async () => {
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue(TEST_ACCOUNT_A);

    const result = await sendCalls({ wallet, ...SEND_CALLS_OPTIONS });

    expect(result).toEqual("0x123456");
    expect(mocks.injectedRequest).toHaveBeenCalledWith({
      method: "wallet_sendCalls",
      params: [
        {
          calls: [
            {
              to: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
              data: "0xabcdef",
              value: undefined,
            },
            {
              to: "0xa922b54716264130634d6ff183747a8ead91a40b",
              value: numberToHex(123n),
            },
          ],
          capabilities: undefined,
          chainId: numberToHex(ANVIL_CHAIN.id),
          from: TEST_ACCOUNT_A.address,
          version: "1.0",
        },
      ],
    });
  });

  test("should override chainId", async () => {
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    const result = await sendCalls({
      wallet,
      chain: sepolia,
      ...SEND_CALLS_OPTIONS,
    });

    expect(result).toEqual("0x123456");
    expect(mocks.injectedRequest).toHaveBeenCalledWith({
      method: "wallet_sendCalls",
      params: [
        {
          calls: [
            {
              to: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
              data: "0xabcdef",
              value: undefined,
            },
            {
              to: "0xa922b54716264130634d6ff183747a8ead91a40b",
              value: numberToHex(123n),
            },
          ],
          capabilities: undefined,
          chainId: numberToHex(sepolia.id),
          from: TEST_ACCOUNT_A.address,
          version: "1.0",
        },
      ],
    });
  });

  test("without support should fail", async () => {
    mocks.injectedRequest.mockRejectedValue(RAW_UNSUPPORTED_ERROR);
    wallet.getAccount = vi.fn().mockReturnValue(TEST_ACCOUNT_A);
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    const promise = sendCalls({
      wallet,
      ...SEND_CALLS_OPTIONS,
    });

    expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: io.metamask does not support wallet_sendCalls, reach out to them directly to request EIP-5792 support.]",
    );
  });
});

describe.sequential("in-app wallet", () => {
  let wallet: Wallet = createWallet("inApp");

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should send individual calls", async () => {
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue(TEST_ACCOUNT_A);

    await sendCalls({ wallet, ...SEND_CALLS_OPTIONS });

    expect(mocks.sendAndConfirmTransaction).toHaveBeenCalledTimes(2);
  });

  test("without account should fail", async () => {
    wallet.getAccount = vi.fn().mockReturnValue(undefined);
    const promise = sendCalls({ wallet, ...SEND_CALLS_OPTIONS });
    expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: Cannot send calls, no account connected for wallet: inApp]",
    );
  });

  test("with smart account should send batch calls", async () => {
    wallet = createWallet("inApp", {
      smartAccount: { chain: FORKED_ETHEREUM_CHAIN, sponsorGas: true },
    });
    wallet.getChain = vi.fn().mockReturnValue(FORKED_ETHEREUM_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue({
      ...TEST_ACCOUNT_A,
      sendBatchTransaction: vi.fn(), // must specify this to make it behave like a smart account without connecting
    });

    await sendCalls({ wallet, ...SEND_CALLS_OPTIONS });

    expect(mocks.sendBatchTransaction).toHaveBeenCalledTimes(1);
  });
});

describe.sequential("smart wallet", () => {
  const wallet: Wallet = createWallet("smart", {
    chain: FORKED_ETHEREUM_CHAIN,
    sponsorGas: true,
  });
  wallet.getAccount = vi.fn().mockReturnValue({
    ...TEST_ACCOUNT_A,
    sendBatchTransaction: vi.fn(), // must specify this to make it behave like a smart account without connecting
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should send batch calls", async () => {
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);

    await sendCalls({ wallet, ...SEND_CALLS_OPTIONS });

    expect(mocks.sendBatchTransaction).toHaveBeenCalledTimes(1);
  });
});

// TODO: Coinbase SDK tests
