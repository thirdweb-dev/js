import { afterEach, describe, expect, test, vi } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { METAMASK } from "../constants.js";
import { createWallet } from "../create-wallet.js";
import type { Wallet } from "../interfaces/wallet.js";
import { getCallsStatus } from "./get-calls-status.js";

const mocks = vi.hoisted(() => ({
  getCallsStatus: vi.fn(),
}));

describe.sequential("getCallsStatus general", () => {
  const wallet: Wallet = createWallet(METAMASK);

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("with no account should fail", async () => {
    wallet.getAccount = vi.fn().mockReturnValue(undefined);
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);

    const promise = getCallsStatus({
      client: TEST_CLIENT,
      id: "test",
      wallet: wallet,
    });

    await expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: Failed to get call status, no account found for wallet io.metamask]",
    );
  });

  test("with no chain should fail", async () => {
    wallet.getAccount = vi.fn().mockReturnValue(TEST_ACCOUNT_A);
    wallet.getChain = vi.fn().mockReturnValue(undefined);

    const promise = getCallsStatus({
      client: TEST_CLIENT,
      id: "test",
      wallet: wallet,
    });

    await expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: Failed to get call status, no chain found for wallet io.metamask]",
    );
  });

  test("without getCallsStatus support should fail", async () => {
    wallet.getAccount = vi.fn().mockReturnValue({
      ...TEST_ACCOUNT_A,
      // no getCallsStatus method
    });
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);

    const promise = getCallsStatus({
      client: TEST_CLIENT,
      id: "test",
      wallet: wallet,
    });

    await expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: Failed to get call status, wallet io.metamask does not support EIP-5792]",
    );
  });

  test("should delegate to account.getCallsStatus", async () => {
    const mockResponse = {
      status: "success" as const,
      statusCode: 200,
      receipts: [],
    };

    const mockAccount = {
      ...TEST_ACCOUNT_A,
      getCallsStatus: mocks.getCallsStatus.mockResolvedValue(mockResponse),
    };

    wallet.getAccount = vi.fn().mockReturnValue(mockAccount);
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);

    const result = await getCallsStatus({
      client: TEST_CLIENT,
      id: "test-bundle-id",
      wallet: wallet,
    });

    expect(result).toEqual(mockResponse);
    expect(mocks.getCallsStatus).toHaveBeenCalledWith({
      id: "test-bundle-id",
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
  });
});

describe.sequential("injected wallet account.getCallsStatus", () => {
  // These tests verify the behavior of the getCallsStatus method on injected wallet accounts
  // The actual implementation would be in packages/thirdweb/src/wallets/injected/index.ts

  test("should handle successful getCallsStatus", async () => {
    const mockProvider = {
      request: vi.fn().mockResolvedValue({
        receipts: [],
        status: "CONFIRMED",
      }),
    };

    // Mock what an injected account with getCallsStatus would look like
    const injectedAccount = {
      ...TEST_ACCOUNT_A,
      getCallsStatus: async (options: any) => {
        // This mimics the implementation in injected/index.ts
        const response = await mockProvider.request({
          method: "wallet_getCallsStatus",
          params: [options.id],
        });
        return {
          ...response,
          status: "success" as const,
          statusCode: 200,
        };
      },
    };

    const wallet: Wallet = createWallet(METAMASK);
    wallet.getAccount = vi.fn().mockReturnValue(injectedAccount);
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);

    const result = await getCallsStatus({
      client: TEST_CLIENT,
      id: "test",
      wallet: wallet,
    });

    expect(result.status).toEqual("success");
    expect(result.statusCode).toEqual(200);
    expect(mockProvider.request).toHaveBeenCalledWith({
      method: "wallet_getCallsStatus",
      params: ["test"],
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
      getCallsStatus: async (options: any) => {
        try {
          return await mockProvider.request({
            method: "wallet_getCallsStatus",
            params: [options.id],
          });
        } catch (error) {
          throw new Error(
            `io.metamask does not support wallet_getCallsStatus, reach out to them directly to request EIP-5792 support.`,
          );
        }
      },
    };

    const wallet: Wallet = createWallet(METAMASK);
    wallet.getAccount = vi.fn().mockReturnValue(injectedAccount);
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);

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

describe.sequential("in-app wallet", () => {
  const wallet: Wallet = createWallet("inApp");

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should delegate to in-app wallet getCallsStatus implementation", async () => {
    const mockResponse = {
      status: "success" as const,
      statusCode: 200,
      receipts: [
        {
          blockNumber: 12345n,
          gasUsed: 21000n,
          status: "success" as const,
          transactionHash:
            "0x9b7bb827c2e5e3c1a0a44dc53e573aa0b3af3bd1f9f5ed03071b100bb039eaff",
        },
      ],
    };

    const inAppAccount = {
      ...TEST_ACCOUNT_A,
      getCallsStatus: async (options: any) => {
        // This would be the actual in-app wallet implementation
        return mockResponse;
      },
    };

    wallet.getAccount = vi.fn().mockReturnValue(inAppAccount);
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);

    const result = await getCallsStatus({
      client: TEST_CLIENT,
      id: "test-bundle-id",
      wallet: wallet,
    });

    expect(result).toEqual(mockResponse);
  });

  test("should handle unknown bundle id error", async () => {
    const inAppAccount = {
      ...TEST_ACCOUNT_A,
      getCallsStatus: async (options: any) => {
        throw new Error("Failed to get calls status, unknown bundle id");
      },
    };

    wallet.getAccount = vi.fn().mockReturnValue(inAppAccount);
    wallet.getChain = vi.fn().mockReturnValue(ANVIL_CHAIN);

    const promise = getCallsStatus({
      client: TEST_CLIENT,
      id: "unknown",
      wallet: wallet,
    });

    await expect(promise).rejects.toMatchInlineSnapshot(
      "[Error: Failed to get calls status, unknown bundle id]",
    );
  });
});
