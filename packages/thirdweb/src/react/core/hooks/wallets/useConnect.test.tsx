import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { MockStorage } from "../../../../../test/src/mocks/storage.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../../test/src/test-wallets.js";
import { createWalletAdapter } from "../../../../adapters/wallet-adapter.js";
import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import {
  type ConnectionManager,
  createConnectionManager,
} from "../../../../wallets/manager/index.js";
import { ConnectionManagerCtx } from "../../providers/connection-manager.js";
import { useActiveWalletConnectionStatus } from "./useActiveWalletConnectionStatus.js";
import { useConnect } from "./useConnect.js";

describe("useAddConnectedWallet", () => {
  // Mock the connection manager
  const mockStorage = new MockStorage();
  let manager: ConnectionManager;

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

  beforeEach(() => {
    manager = createConnectionManager(mockStorage);
  });

  it("should connect a wallet to the connection manager", async () => {
    const { result: statusResult } = renderHook(
      () => useActiveWalletConnectionStatus(),
      {
        wrapper,
      },
    );
    const { result } = renderHook(() => useConnect(), { wrapper });
    expect(statusResult.current).toEqual("unknown");
    await result.current.connect(async () => wallet);
    expect(statusResult.current).toEqual("connected");

    // should add to connected wallets
    expect(manager.connectedWallets.getValue()).toHaveLength(1);
    expect(manager.connectedWallets.getValue()[0]).toEqual(wallet);
    // should set the active wallet
    expect(manager.activeWalletStore.getValue()).toEqual(wallet);
  });

  it("should handle a function that returns a wallet", async () => {
    const { result: statusResult } = renderHook(
      () => useActiveWalletConnectionStatus(),
      {
        wrapper,
      },
    );
    const { result } = renderHook(() => useConnect(), { wrapper });
    expect(statusResult.current).toEqual("unknown");
    await result.current.connect(async () => wallet);
    expect(statusResult.current).toEqual("connected");

    // should add to connected wallets
    expect(manager.connectedWallets.getValue()).toHaveLength(1);
    expect(manager.connectedWallets.getValue()[0]).toEqual(wallet);
    // should set the active wallet
    expect(manager.activeWalletStore.getValue()).toEqual(wallet);
  });

  it("should handle an error when connecting a wallet", async () => {
    const { result: statusResult } = renderHook(
      () => useActiveWalletConnectionStatus(),
      {
        wrapper,
      },
    );
    expect(statusResult.current).toEqual("unknown");
    const { result } = renderHook(() => useConnect(), { wrapper });
    await result.current.connect(async () => {
      throw new Error("test");
    });

    expect(statusResult.current).toEqual("disconnected");
    // should set the active wallet
    expect(manager.activeWalletStore.getValue()).toEqual(undefined);
  });

  it("should throw an error when used outside of ThirdwebProvider", () => {
    // Render the hook without a provider
    expect(() => {
      renderHook(() => useConnect());
    }).toThrow("useConnect must be used within <ThirdwebProvider>");
  });
});
