import { afterEach, describe, expect, test, vi } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { METAMASK } from "../constants.js";
import { createWallet } from "../create-wallet.js";
import type { Wallet } from "../interfaces/wallet.js";
import {
  type GetCapabilitiesOptions,
  getCapabilities,
} from "./get-capabilities.js";

const mocks = vi.hoisted(() => ({
  getCapabilities: vi.fn(),
}));

describe.sequential("getCapabilities general", () => {
  const wallet: Wallet = createWallet(METAMASK);

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("without account should return message", async () => {
    wallet.getAccount = vi.fn().mockReturnValue(undefined);

    const capabilities = await getCapabilities({
      wallet,
    });

    expect(capabilities).toEqual({
      message:
        "Can't get capabilities, no account connected for wallet: io.metamask",
    });
  });

  test("without getCapabilities support should fail", async () => {
    wallet.getAccount = vi.fn().mockReturnValue({
      ...TEST_ACCOUNT_A,
      // no getCapabilities method
    });

    const promise = getCapabilities({
      wallet,
    });

    await expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: Failed to get capabilities, wallet io.metamask does not support EIP-5792]",
    );
  });

  test("should delegate to account.getCapabilities", async () => {
    const mockResponse = {
      [ANVIL_CHAIN.id]: {
        paymasterService: {
          supported: true,
        },
        sessionKeys: {
          supported: true,
        },
      },
    };

    const mockAccount = {
      ...TEST_ACCOUNT_A,
      getCapabilities: mocks.getCapabilities.mockResolvedValue(mockResponse),
    };

    wallet.getAccount = vi.fn().mockReturnValue(mockAccount);

    const result = await getCapabilities({
      wallet,
    });

    expect(result).toEqual(mockResponse);
    expect(mocks.getCapabilities).toHaveBeenCalledWith({
      chainId: undefined,
    });
  });

  test("should delegate to account.getCapabilities with chainId", async () => {
    const mockResponse = {
      paymasterService: {
        supported: true,
      },
      sessionKeys: {
        supported: true,
      },
    };

    const mockAccount = {
      ...TEST_ACCOUNT_A,
      getCapabilities: mocks.getCapabilities.mockResolvedValue(mockResponse),
    };

    wallet.getAccount = vi.fn().mockReturnValue(mockAccount);

    const result = await getCapabilities({
      wallet,
      chainId: ANVIL_CHAIN.id,
    });

    expect(result).toEqual(mockResponse);
    expect(mocks.getCapabilities).toHaveBeenCalledWith({
      chainId: ANVIL_CHAIN.id,
    });
  });
});

describe.sequential("injected wallet account.getCapabilities", () => {
  // These tests verify the behavior of the getCapabilities method on injected wallet accounts
  // The actual implementation would be in packages/thirdweb/src/wallets/injected/index.ts

  test("should handle successful getCapabilities", async () => {
    const mockProvider = {
      request: vi.fn().mockResolvedValue({
        [ANVIL_CHAIN.id]: {
          paymasterService: {
            supported: true,
          },
          sessionKeys: {
            supported: true,
          },
        },
      }),
    };

    // Mock what an injected account with getCapabilities would look like
    const injectedAccount = {
      ...TEST_ACCOUNT_A,
      getCapabilities: async (_options: any) => {
        // This mimics the implementation in injected/index.ts
        const response = await mockProvider.request({
          method: "wallet_getCapabilities",
          params: [injectedAccount.address],
        });
        return response;
      },
    };

    const wallet: Wallet = createWallet(METAMASK);
    wallet.getAccount = vi.fn().mockReturnValue(injectedAccount);

    const result = await getCapabilities({
      wallet,
    });

    expect(result).toEqual({
      [ANVIL_CHAIN.id]: {
        paymasterService: {
          supported: true,
        },
        sessionKeys: {
          supported: true,
        },
      },
    });
    expect(mockProvider.request).toHaveBeenCalledWith({
      method: "wallet_getCapabilities",
      params: [TEST_ACCOUNT_A.address],
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
      getCapabilities: async (_options: any) => {
        try {
          return await mockProvider.request({
            method: "wallet_getCapabilities",
            params: [injectedAccount.address],
          });
        } catch {
          return {
            message: `io.metamask does not support wallet_getCapabilities, reach out to them directly to request EIP-5792 support.`,
          };
        }
      },
    };

    const wallet: Wallet = createWallet(METAMASK);
    wallet.getAccount = vi.fn().mockReturnValue(injectedAccount);

    const result = await getCapabilities({
      wallet,
    });

    expect(result).toEqual({
      message:
        "io.metamask does not support wallet_getCapabilities, reach out to them directly to request EIP-5792 support.",
    });
  });
});

describe.sequential("in-app wallet", () => {
  const wallet: Wallet = createWallet("inApp");

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should delegate to in-app wallet getCapabilities implementation", async () => {
    const mockResponse = {
      [ANVIL_CHAIN.id]: {
        atomic: {
          status: "unsupported",
        },
        paymasterService: {
          supported: false,
        },
      },
    };

    const inAppAccount = {
      ...TEST_ACCOUNT_A,
      getCapabilities: async (_options: GetCapabilitiesOptions) => {
        // This would be the actual in-app wallet implementation
        return mockResponse;
      },
    };

    wallet.getAccount = vi.fn().mockReturnValue(inAppAccount);

    const result = await getCapabilities({
      wallet,
    });

    expect(result).toEqual(mockResponse);
  });

  test("should handle smart account capabilities", async () => {
    const mockResponse = {
      [ANVIL_CHAIN.id]: {
        atomic: {
          status: "supported",
        },
        paymasterService: {
          supported: true,
        },
      },
    };

    const smartAccount = {
      ...TEST_ACCOUNT_A,
      sendBatchTransaction: vi.fn(), // indicates it's a smart account
      getCapabilities: async (_options: GetCapabilitiesOptions) => {
        return mockResponse;
      },
    };

    wallet.getAccount = vi.fn().mockReturnValue(smartAccount);

    const result = await getCapabilities({
      wallet,
    });

    expect(result).toEqual(mockResponse);
  });
});

describe.sequential("smart wallet", () => {
  const wallet: Wallet = createWallet("smart", {
    chain: ANVIL_CHAIN,
    sponsorGas: true,
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should delegate to smart wallet getCapabilities implementation", async () => {
    const mockResponse = {
      [ANVIL_CHAIN.id]: {
        atomic: {
          status: "supported",
        },
        paymasterService: {
          supported: true,
        },
      },
    };

    const smartAccount = {
      ...TEST_ACCOUNT_A,
      sendBatchTransaction: vi.fn(),
      getCapabilities: async (_options: GetCapabilitiesOptions) => {
        return mockResponse;
      },
    };

    wallet.getAccount = vi.fn().mockReturnValue(smartAccount);

    const result = await getCapabilities({
      wallet,
    });

    expect(result).toEqual(mockResponse);
  });
});
