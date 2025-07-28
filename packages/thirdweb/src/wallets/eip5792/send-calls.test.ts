import { afterEach } from "node:test";
import { describe, expect, test, vi } from "vitest";
import {
  ANVIL_CHAIN,
  FORKED_ETHEREUM_CHAIN,
} from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { sepolia } from "../../exports/chains.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import { numberToHex } from "../../utils/encoding/hex.js";
import { stringify } from "../../utils/json.js";
import { METAMASK } from "../constants.js";
import { createWallet } from "../create-wallet.js";
import type { Wallet } from "../interfaces/wallet.js";
import { type SendCallsOptions, sendCalls } from "./send-calls.js";

const SEND_CALLS_OPTIONS: Omit<SendCallsOptions, "wallet"> = {
  calls: [
    {
      data: "0xabcdef" as const,
      to: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
    },
    {
      to: "0xa922b54716264130634d6ff183747a8ead91a40b",
      value: 123n,
    },
  ].map((call) =>
    prepareTransaction({ ...call, chain: ANVIL_CHAIN, client: TEST_CLIENT }),
  ),
};

const mocks = vi.hoisted(() => ({
  sendCalls: vi.fn(),
  inAppWalletSendCalls: vi.fn(),
}));

// Mock the in-app wallet calls implementation
vi.mock("../in-app/core/eip5792/in-app-wallet-calls.js", () => {
  return {
    inAppWalletSendCalls: mocks.inAppWalletSendCalls,
  };
});

describe.sequential("sendCalls general", () => {
  const wallet: Wallet = createWallet(METAMASK);

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("with no account should fail to send calls", async () => {
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue(undefined);

    const promise = sendCalls({ wallet, ...SEND_CALLS_OPTIONS });
    await expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: Cannot send calls, no account connected for wallet: io.metamask]",
    );
  });

  test("without sendCalls support should fail", async () => {
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue({
      ...TEST_ACCOUNT_A,
      // no sendCalls method
    });

    const promise = sendCalls({ wallet, ...SEND_CALLS_OPTIONS });
    await expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: Cannot send calls, wallet io.metamask does not support EIP-5792]",
    );
  });

  test("should delegate to account.sendCalls", async () => {
    const mockAccount = {
      ...TEST_ACCOUNT_A,
      sendCalls: mocks.sendCalls.mockResolvedValue({
        id: "0x123456",
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
      }),
    };

    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue(mockAccount);

    const result = await sendCalls({ wallet, ...SEND_CALLS_OPTIONS });

    expect(result.id).toEqual("0x123456");
    expect(result.wallet).toBe(wallet);
    expect(mocks.sendCalls).toHaveBeenCalledWith({
      calls: SEND_CALLS_OPTIONS.calls,
    });
  });

  test("should switch chain if needed", async () => {
    const mockAccount = {
      ...TEST_ACCOUNT_A,
      sendCalls: mocks.sendCalls.mockResolvedValue({
        id: "0x123456",
        client: TEST_CLIENT,
        chain: sepolia,
      }),
    };

    const switchChainMock = vi.fn();
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue(mockAccount);
    wallet.switchChain = switchChainMock;

    // Create calls with sepolia chain to trigger chain switch
    const sepoliaCallsOptions = {
      calls: [
        {
          data: "0xabcdef" as const,
          to: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
        },
      ].map((call) =>
        prepareTransaction({ ...call, chain: sepolia, client: TEST_CLIENT }),
      ),
    };

    await sendCalls({ wallet, ...sepoliaCallsOptions });

    expect(switchChainMock).toHaveBeenCalledWith(sepolia);
  });
});

describe.sequential("injected wallet account.sendCalls", () => {
  // These tests verify the behavior of the sendCalls method on injected wallet accounts
  // The actual implementation is in packages/thirdweb/src/wallets/injected/index.ts

  test("should handle successful sendCalls", async () => {
    const mockProvider = {
      request: vi.fn().mockResolvedValue("0x123456"),
    };

    // Mock what an injected account with sendCalls would look like
    const injectedAccount = {
      ...TEST_ACCOUNT_A,
      sendCalls: async (_options: SendCallsOptions) => {
        // This mimics the implementation in injected/index.ts
        const callId = await mockProvider.request({
          method: "wallet_sendCalls",
          params: [
            {
              atomicRequired: false,
              calls: [
                {
                  data: "0xabcdef",
                  to: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
                  value: undefined,
                },
                {
                  data: "0x",
                  to: "0xa922b54716264130634d6ff183747a8ead91a40b",
                  value: numberToHex(123n),
                },
              ],
              capabilities: undefined,
              chainId: numberToHex(ANVIL_CHAIN.id),
              from: TEST_ACCOUNT_A.address,
              version: "2.0.0",
            },
          ],
        });
        return { id: callId, client: TEST_CLIENT, chain: ANVIL_CHAIN };
      },
    };

    const wallet: Wallet = createWallet(METAMASK);
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue(injectedAccount);

    const result = await sendCalls({ wallet, ...SEND_CALLS_OPTIONS });

    expect(result.id).toEqual("0x123456");
    expect(mockProvider.request).toHaveBeenCalledWith({
      method: "wallet_sendCalls",
      params: [
        {
          atomicRequired: false,
          calls: [
            {
              data: "0xabcdef",
              to: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
              value: undefined,
            },
            {
              data: "0x",
              to: "0xa922b54716264130634d6ff183747a8ead91a40b",
              value: numberToHex(123n),
            },
          ],
          capabilities: undefined,
          chainId: numberToHex(ANVIL_CHAIN.id),
          from: TEST_ACCOUNT_A.address,
          version: "2.0.0",
        },
      ],
    });
  });

  test("should handle provider errors", async () => {
    const mockProvider = {
      request: vi.fn().mockRejectedValue({
        code: -32601,
        message: "some nonsense the wallet sends us about not supporting",
      }),
    };

    const injectedAccount = {
      ...TEST_ACCOUNT_A,
      sendCalls: async (_options: SendCallsOptions) => {
        try {
          const callId = await mockProvider.request({
            method: "wallet_sendCalls",
            params: [],
          });
          return { id: callId, client: TEST_CLIENT, chain: ANVIL_CHAIN };
        } catch (error) {
          if (/unsupport|not support/i.test((error as Error).message)) {
            throw new Error(
              `io.metamask errored calling wallet_sendCalls, with error: ${stringify(error)}`,
            );
          }
          throw error;
        }
      },
    };

    const wallet: Wallet = createWallet(METAMASK);
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue(injectedAccount);

    const promise = sendCalls({ wallet, ...SEND_CALLS_OPTIONS });

    await expect(promise).rejects.toMatchInlineSnapshot(
      `[Error: io.metamask errored calling wallet_sendCalls, with error: {"code":-32601,"message":"some nonsense the wallet sends us about not supporting"}]`,
    );
  });
});

describe.sequential("in-app wallet", () => {
  const wallet: Wallet = createWallet("inApp");

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should send calls via inAppWalletSendCalls", async () => {
    // Configure the mock to return the expected value
    mocks.inAppWalletSendCalls.mockResolvedValue("0x789abc");

    const inAppAccount = {
      ...TEST_ACCOUNT_A,
      sendCalls: async (options: SendCallsOptions) => {
        const id = await mocks.inAppWalletSendCalls({
          account: inAppAccount,
          calls: options.calls,
        });
        return { id, client: TEST_CLIENT, chain: ANVIL_CHAIN };
      },
    };

    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue(inAppAccount);

    const result = await sendCalls({ wallet, ...SEND_CALLS_OPTIONS });

    expect(result.id).toEqual("0x789abc");
    expect(mocks.inAppWalletSendCalls).toHaveBeenCalledWith({
      account: inAppAccount,
      calls: SEND_CALLS_OPTIONS.calls,
    });
  });

  test("without account should fail", async () => {
    wallet.getAccount = vi.fn().mockReturnValue(undefined);
    const promise = sendCalls({ wallet, ...SEND_CALLS_OPTIONS });
    await expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: Cannot send calls, no account connected for wallet: inApp]",
    );
  });
});

describe.sequential("smart wallet", () => {
  const wallet: Wallet = createWallet("smart", {
    chain: FORKED_ETHEREUM_CHAIN,
    sponsorGas: true,
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should send calls via inAppWalletSendCalls", async () => {
    // Configure the mock to return the expected value
    mocks.inAppWalletSendCalls.mockResolvedValue("0x789abc");

    const smartAccount = {
      ...TEST_ACCOUNT_A,
      sendBatchTransaction: vi.fn(),
      sendCalls: async (options: SendCallsOptions) => {
        const id = await mocks.inAppWalletSendCalls({
          account: smartAccount,
          calls: options.calls,
        });
        return { id, client: TEST_CLIENT, chain: ANVIL_CHAIN };
      },
    };

    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue(smartAccount);

    const result = await sendCalls({ wallet, ...SEND_CALLS_OPTIONS });

    expect(result.id).toEqual("0x789abc");
    expect(mocks.inAppWalletSendCalls).toHaveBeenCalledWith({
      account: smartAccount,
      calls: SEND_CALLS_OPTIONS.calls,
    });
  });
});

// TODO: Coinbase SDK tests
