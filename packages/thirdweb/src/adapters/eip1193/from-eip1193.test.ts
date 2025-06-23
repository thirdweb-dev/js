import { describe, expect, test, vi } from "vitest";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { trackConnect } from "../../analytics/track/connect.js";
import { fromProvider } from "./from-eip1193.js";
import type { EIP1193Provider } from "./types.js";

vi.mock("../../analytics/track/connect.js");

describe("fromProvider", () => {
  const mockProvider: EIP1193Provider = {
    on: vi.fn(),
    removeListener: vi.fn(),
    request: vi.fn(),
  };

  const mockAccount = TEST_ACCOUNT_A;

  test("should create a wallet with the correct properties", () => {
    const wallet = fromProvider({
      provider: mockProvider,
      walletId: "io.metamask",
    });

    expect(wallet.id).toBe("io.metamask");
    expect(wallet.subscribe).toBeDefined();
    expect(wallet.connect).toBeDefined();
    expect(wallet.disconnect).toBeDefined();
    expect(wallet.getAccount).toBeDefined();
    expect(wallet.getChain).toBeDefined();
    expect(wallet.getConfig).toBeDefined();
    expect(wallet.switchChain).toBeDefined();
  });

  test("should use 'adapter' as default walletId", () => {
    const wallet = fromProvider({
      provider: mockProvider,
    });

    expect(wallet.id).toBe("adapter");
  });

  test("should handle async provider function", async () => {
    const wallet = fromProvider({
      provider: async () =>
        Promise.resolve({
          ...mockProvider,
          request: () => Promise.resolve([mockAccount.address]),
        }),
    });

    // Connect to trigger provider initialization
    await wallet.connect({
      client: TEST_CLIENT,
    });

    expect(wallet.getAccount()?.address).toBe(mockAccount.address);
  });

  test("should emit events on connect", async () => {
    const wallet = fromProvider({
      provider: {
        ...mockProvider,
        request: () => Promise.resolve([mockAccount.address]),
      },
    });

    const onConnectSpy = vi.fn();
    wallet.subscribe("onConnect", onConnectSpy);

    await wallet.connect({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    expect(onConnectSpy).toHaveBeenCalled();
    expect(trackConnect).toHaveBeenCalledWith({
      client: TEST_CLIENT,
      walletAddress: mockAccount.address,
      walletType: "adapter",
    });
  });

  test("should emit events on disconnect", async () => {
    const wallet = fromProvider({
      provider: mockProvider,
    });

    const onDisconnectSpy = vi.fn();
    wallet.subscribe("disconnect", onDisconnectSpy);

    await wallet.disconnect();

    expect(onDisconnectSpy).toHaveBeenCalled();
  });

  test("should handle chain changes", async () => {
    const wallet = fromProvider({
      provider: {
        ...mockProvider,
        request: () => Promise.resolve([mockAccount.address]),
      },
    });

    const onChainChangedSpy = vi.fn();
    wallet.subscribe("chainChanged", onChainChangedSpy);

    await wallet.connect({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    const chain = wallet.getChain();
    expect(chain).toBe(ANVIL_CHAIN);
  });

  test("should handle connection with no chainId", async () => {
    const wallet = fromProvider({
      provider: {
        ...mockProvider,
        request: () => Promise.resolve([mockAccount.address]),
      },
    });

    await wallet.connect({
      chain: {
        ...ANVIL_CHAIN,
        id: undefined,
        // biome-ignore lint/suspicious/noExplicitAny: Testing unexpected input data
      } as any,
      client: TEST_CLIENT,
    });
  });

  test("should reset state on disconnect", async () => {
    const wallet = fromProvider({
      provider: {
        ...mockProvider,
        request: () => Promise.resolve([mockAccount.address]),
      },
    });

    mockProvider.request = vi.fn().mockResolvedValueOnce([mockAccount.address]);

    await wallet.connect({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    await wallet.disconnect();

    expect(wallet.getAccount()).toBeUndefined();
    expect(wallet.getChain()).toBeUndefined();
  });
});
