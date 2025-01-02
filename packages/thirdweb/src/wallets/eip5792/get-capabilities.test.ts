import { afterEach, beforeAll, describe, expect, it, test, vi } from "vitest";
import {
  ANVIL_CHAIN,
  FORKED_ETHEREUM_CHAIN,
} from "../../../test/src/chains.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { METAMASK } from "../constants.js";
import { createWallet } from "../create-wallet.js";
import type { Wallet } from "../interfaces/wallet.js";
import { getCapabilities } from "./get-capabilities.js";

const SUPPORTED_RESPONSE = {
  1: {
    paymasterService: {
      supported: true,
    },
    sessionKeys: {
      supported: true,
    },
  },
};

const RAW_UNSUPPORTED_ERROR = {
  code: -32601,
  message: "some nonsense the wallet sends us about not supporting",
};

const UNSUPPORTED_RESPONSE_STRING = "does not support wallet_getCapabilities";

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

describe.sequential("injected wallet", async () => {
  const wallet: Wallet = createWallet(METAMASK);
  describe.sequential("supported", () => {
    beforeAll(() => {
      mocks.injectedRequest.mockResolvedValue(SUPPORTED_RESPONSE);
    });

    afterEach(() => {
      mocks.injectedRequest.mockClear();
    });

    test("without account should return no capabilities", async () => {
      wallet.getAccount = vi.fn().mockReturnValue(undefined);

      const capabilities = await getCapabilities({
        wallet,
      });

      expect(mocks.injectedRequest).not.toHaveBeenCalled();
      expect(capabilities).toEqual({
        message:
          "Can't get capabilities, no account connected for wallet: io.metamask",
      });
    });

    test("with account should return capabilities", async () => {
      wallet.getAccount = vi.fn().mockReturnValue(TEST_ACCOUNT_A);

      const capabilities = await getCapabilities({
        wallet,
      });

      expect(mocks.injectedRequest).toHaveBeenCalledWith({
        method: "wallet_getCapabilities",
        params: [TEST_ACCOUNT_A.address],
      });
      expect(capabilities).toEqual(SUPPORTED_RESPONSE);
    });
  });

  describe("unsupported", () => {
    beforeAll(() => {
      mocks.injectedRequest.mockRejectedValue(RAW_UNSUPPORTED_ERROR);
    });

    afterEach(() => {
      mocks.injectedRequest.mockClear();
    });

    it("should return clean unsupported response", async () => {
      wallet.getAccount = vi.fn().mockReturnValue(TEST_ACCOUNT_A);
      wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
      const capabilities = await getCapabilities({
        wallet,
      });

      expect(mocks.injectedRequest).toHaveBeenCalledWith({
        method: "wallet_getCapabilities",
        params: [TEST_ACCOUNT_A.address],
      });
      if ("message" in capabilities) {
        expect(capabilities.message).toContain(UNSUPPORTED_RESPONSE_STRING);
      } else {
        throw new Error("capabilities does not contain message");
      }
    });
  });
});

describe.sequential("in-app wallet", async () => {
  let wallet: Wallet = createWallet("inApp");

  test("should return no support", async () => {
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue(TEST_ACCOUNT_A);

    const capabilities = await getCapabilities({
      wallet,
    });

    expect(capabilities).toEqual({
      [ANVIL_CHAIN.id]: {
        paymasterService: {
          supported: false,
        },
        atomicBatch: {
          supported: false,
        },
      },
    });
  });

  test("with no account should return no capabilities", async () => {
    wallet.getAccount = vi.fn().mockReturnValue(undefined);

    const capabilities = await getCapabilities({
      wallet,
    });

    expect(capabilities).toEqual({
      message: "Can't get capabilities, no account connected for wallet: inApp",
    });
  });

  describe.sequential("with smart account", async () => {
    test("with sponsorGas should support paymasterService and atomicBatch", async () => {
      wallet = createWallet("inApp", {
        smartAccount: {
          sponsorGas: true,
          chain: ANVIL_CHAIN,
        },
      });

      wallet.getAccount = vi.fn().mockReturnValue({
        ...TEST_ACCOUNT_A,
        sendBatchTransaction: vi.fn(),
      });
      wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);

      const capabilities = await getCapabilities({
        wallet,
      });

      expect(capabilities).toEqual({
        [ANVIL_CHAIN.id]: {
          paymasterService: {
            supported: true,
          },
          atomicBatch: {
            supported: true,
          },
        },
      });
    });

    test("without sponsorGas should support atomicBatch", async () => {
      wallet = createWallet("inApp", {
        smartAccount: {
          sponsorGas: false,
          chain: ANVIL_CHAIN,
        },
      });
      wallet.getAccount = vi.fn().mockReturnValue({
        ...TEST_ACCOUNT_A,
        sendBatchTransaction: vi.fn(),
      });
      wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);

      const capabilities = await getCapabilities({
        wallet,
      });

      expect(capabilities).toEqual({
        [ANVIL_CHAIN.id]: {
          paymasterService: {
            supported: false,
          },
          atomicBatch: {
            supported: true,
          },
        },
      });
    });
  });
});

describe.sequential("smart wallet", async () => {
  let wallet: Wallet = createWallet("smart", {
    chain: FORKED_ETHEREUM_CHAIN,
    sponsorGas: true,
  });
  const smartAccount = {
    ...TEST_ACCOUNT_A,
    sendBatchTransaction: vi.fn(),
  };

  test("with no chain should return no capabilities", async () => {
    wallet.getAccount = vi.fn().mockReturnValue(smartAccount);
    wallet.getChain = vi.fn().mockReturnValue(undefined);

    const capabilities = await getCapabilities({
      wallet,
    });

    expect(capabilities).toEqual({
      message:
        "Can't get capabilities, no active chain found for wallet: smart",
    });
  });

  test("with no account should return no capabilities", async () => {
    wallet.getAccount = vi.fn().mockReturnValue(undefined);
    wallet.getChain = vi.fn().mockReturnValue(FORKED_ETHEREUM_CHAIN);

    const capabilities = await getCapabilities({
      wallet,
    });

    expect(capabilities).toEqual({
      message: "Can't get capabilities, no account connected for wallet: smart",
    });
  });

  test("with sponsorGas should support paymasterService and atomicBatch", async () => {
    wallet = createWallet("smart", {
      chain: ANVIL_CHAIN,
      sponsorGas: true,
    });
    wallet.getAccount = vi.fn().mockReturnValue(smartAccount);
    wallet.getChain = vi.fn().mockReturnValue(FORKED_ETHEREUM_CHAIN);

    const capabilities = await getCapabilities({
      wallet,
    });

    expect(capabilities).toEqual({
      [FORKED_ETHEREUM_CHAIN.id]: {
        paymasterService: {
          supported: true,
        },
        atomicBatch: {
          supported: true,
        },
      },
    });
  });

  test("without sponsorGas should return atomicBatch", async () => {
    wallet = createWallet("smart", {
      chain: FORKED_ETHEREUM_CHAIN,
      sponsorGas: false,
    });
    wallet.getChain = vi.fn().mockReturnValue(FORKED_ETHEREUM_CHAIN);
    wallet.getAccount = vi.fn().mockReturnValue(smartAccount);

    const capabilities = await getCapabilities({
      wallet,
    });

    expect(capabilities).toEqual({
      [FORKED_ETHEREUM_CHAIN.id]: {
        atomicBatch: {
          supported: true,
        },
        paymasterService: {
          supported: false,
        },
      },
    });
  });
});

// TODO: Coinbase SDK Tests
