import { afterEach } from "node:test";
import { beforeAll, describe, expect, it, test, vi } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { numberToHex } from "../../utils/encoding/hex.js";
import { METAMASK } from "../constants.js";
import { createWallet } from "../create-wallet.js";
import type { Wallet } from "../interfaces/wallet.js";
import { type SendCallsOptions, sendCalls } from "./send-calls.js";

const SEND_CALLS_OPTIONS: Omit<SendCallsOptions, "wallet"> = {
  calls: [
    {
      to: "0x123456789abcdef",
      data: "0xabcdef",
    },
    {
      to: "0x123456789abcdef",
      value: 123n,
    },
  ],
};

const mocks = vi.hoisted(() => ({
  injectedRequest: vi.fn(),
}));

vi.mock("../injected/index.js", () => {
  return {
    getInjectedProvider: vi.fn().mockReturnValue({
      request: mocks.injectedRequest,
    }),
  };
});

describe.sequential("injected wallet", () => {
  beforeAll(() => {
    mocks.injectedRequest.mockResolvedValue("0x123456");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wallet: Wallet = createWallet(METAMASK);
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
              to: "0x123456789abcdef",
              data: "0xabcdef",
              value: undefined,
            },
            {
              to: "0x123456789abcdef",
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
});
