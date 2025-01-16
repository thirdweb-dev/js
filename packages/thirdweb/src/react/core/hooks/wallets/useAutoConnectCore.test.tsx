import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { MockStorage } from "~test/mocks/storage.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { createWalletAdapter } from "../../../../adapters/wallet-adapter.js";
import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import { createConnectionManager } from "../../../../wallets/manager/index.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { ThirdwebProvider } from "../../../web/providers/thirdweb-provider.js";
import { ConnectionManagerCtx } from "../../providers/connection-manager.js";
import { useAutoConnectCore } from "./useAutoConnect.js";

describe("useAutoConnectCore", () => {
  const mockStorage = new MockStorage();
  const manager = createConnectionManager(mockStorage);

  // Create a wrapper component with the mocked context
  const wrapper = ({ children }: { children: ReactNode }) => {
    return (
      <ThirdwebProvider>
        <ConnectionManagerCtx.Provider value={manager}>
          {children}
        </ConnectionManagerCtx.Provider>
      </ThirdwebProvider>
    );
  };

  it("should return a useQuery result", async () => {
    const wallet = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      client: TEST_CLIENT,
      chain: ethereum,
      onDisconnect: () => {},
      switchChain: () => {},
    });
    const { result } = renderHook(
      () =>
        useAutoConnectCore(
          mockStorage,
          {
            wallets: [wallet],
            client: TEST_CLIENT,
          },
          (id: WalletId) =>
            createWalletAdapter({
              adaptedAccount: TEST_ACCOUNT_A,
              client: TEST_CLIENT,
              chain: ethereum,
              onDisconnect: () => {
                console.warn(id);
              },
              switchChain: () => {},
            }),
        ),
      { wrapper },
    );
    expect("data" in result.current).toBeTruthy();
    await waitFor(() => {
      expect(typeof result.current.data).toBe("boolean");
    });
  });

  it("should return `false` if there's no lastConnectedWalletIds", async () => {
    const wallet = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      client: TEST_CLIENT,
      chain: ethereum,
      onDisconnect: () => {},
      switchChain: () => {},
    });
    const { result } = renderHook(
      () =>
        useAutoConnectCore(
          mockStorage,
          {
            wallets: [wallet],
            client: TEST_CLIENT,
          },
          (id: WalletId) =>
            createWalletAdapter({
              adaptedAccount: TEST_ACCOUNT_A,
              client: TEST_CLIENT,
              chain: ethereum,
              onDisconnect: () => {
                console.warn(id);
              },
              switchChain: () => {},
            }),
        ),
      { wrapper },
    );
    await waitFor(
      () => {
        expect(result.current.data).toBe(false);
      },
      { timeout: 1000 },
    );
  });

  it("should call onTimeout on ... timeout", async () => {
    const wallet = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      client: TEST_CLIENT,
      chain: ethereum,
      onDisconnect: () => {},
      switchChain: () => {},
    });
    mockStorage.setItem("thirdweb:active-wallet-id", wallet.id);
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    // Purposefully mock the wallet.autoConnect method to test the timeout logic
    wallet.autoConnect = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          // @ts-ignore Mock purpose
          resolve("Connection successful");
        }, 2100);
      });
    renderHook(
      () =>
        useAutoConnectCore(
          mockStorage,
          {
            wallets: [wallet],
            client: TEST_CLIENT,
            onTimeout: () => console.info("TIMEOUTTED"),
            timeout: 0,
          },
          (id: WalletId) =>
            createWalletAdapter({
              adaptedAccount: TEST_ACCOUNT_A,
              client: TEST_CLIENT,
              chain: ethereum,
              onDisconnect: () => {
                console.warn(id);
              },
              switchChain: () => {},
            }),
        ),
      { wrapper },
    );
    await waitFor(
      () => {
        expect(warnSpy).toHaveBeenCalled();
        expect(warnSpy).toHaveBeenCalledWith(
          "AutoConnect timeout: 0ms limit exceeded.",
        );
        expect(infoSpy).toHaveBeenCalled();
        expect(infoSpy).toHaveBeenCalledWith("TIMEOUTTED");
        warnSpy.mockRestore();
      },
      { timeout: 2000 },
    );
  });
});
