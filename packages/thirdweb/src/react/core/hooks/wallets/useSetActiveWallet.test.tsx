import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { MockStorage } from "../../../../../test/src/mocks/storage.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../../test/src/test-wallets.js";
import { createWalletAdapter } from "../../../../adapters/wallet-adapter.js";
import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import { createConnectionManager } from "../../../../wallets/manager/index.js";
import { ConnectionManagerCtx } from "../../providers/connection-manager.js";
import { useSetActiveWallet } from "./useSetActiveWallet.js";

describe("useAddConnectedWallet", () => {
  // Mock the connection manager
  const mockStorage = new MockStorage();
  const manager = createConnectionManager(mockStorage);

  // Create a wrapper component with the mocked context
  const wrapper = ({ children }: { children: ReactNode }) => {
    return (
      <ConnectionManagerCtx.Provider value={manager}>
        {children}
      </ConnectionManagerCtx.Provider>
    );
  };

  const wallet = createWalletAdapter({
    adaptedAccount: TEST_ACCOUNT_A,
    chain: ethereum,
    client: TEST_CLIENT,
    onDisconnect: () => {},
    switchChain: () => {},
  });

  it("should add a wallet to the connection manager", async () => {
    // Render the hook
    const { result } = renderHook(() => useSetActiveWallet(), { wrapper });
    result.current(wallet);

    // should add to connected wallets
    expect(manager.connectedWallets.getValue()).toHaveLength(1);
    expect(manager.connectedWallets.getValue()[0]).toEqual(wallet);
    // should set the active wallet
    expect(manager.activeWalletStore.getValue()).toEqual(wallet);
  });

  it("should throw an error when used outside of ThirdwebProvider", () => {
    // Render the hook without a provider
    expect(() => {
      renderHook(() => useSetActiveWallet());
    }).toThrow("useSetActiveWallet must be used within <ThirdwebProvider>");
  });
});
