import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
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
      chain: ethereum,
      client: TEST_CLIENT,
      onDisconnect: () => {},
      switchChain: () => {},
    });
    const { result } = renderHook(
      () =>
        useAutoConnectCore(
          mockStorage,
          {
            client: TEST_CLIENT,
            wallets: [wallet],
          },
          (id: WalletId) =>
            createWalletAdapter({
              adaptedAccount: TEST_ACCOUNT_A,
              chain: ethereum,
              client: TEST_CLIENT,
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
      chain: ethereum,
      client: TEST_CLIENT,
      onDisconnect: () => {},
      switchChain: () => {},
    });
    const { result } = renderHook(
      () =>
        useAutoConnectCore(
          mockStorage,
          {
            client: TEST_CLIENT,
            wallets: [wallet],
          },
          (id: WalletId) =>
            createWalletAdapter({
              adaptedAccount: TEST_ACCOUNT_A,
              chain: ethereum,
              client: TEST_CLIENT,
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
});
