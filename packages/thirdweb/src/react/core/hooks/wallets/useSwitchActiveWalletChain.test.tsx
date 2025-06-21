import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { optimism } from "thirdweb/chains";
import { describe, expect, it, vi } from "vitest";
import { MockStorage } from "../../../../../test/src/mocks/storage.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../../../test/src/test-wallets.js";
import { createWalletAdapter } from "../../../../adapters/wallet-adapter.js";
import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import { createConnectionManager } from "../../../../wallets/manager/index.js";
import { ConnectionManagerCtx } from "../../providers/connection-manager.js";
import { useSetActiveWallet } from "./useSetActiveWallet.js";
import { useSwitchActiveWalletChain } from "./useSwitchActiveWalletChain.js";

const switchChain = vi.fn();
describe("useSwitchActiveWalletChain", () => {
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
    switchChain,
  });

  it("should switch the active wallet chain", async () => {
    const { result } = renderHook(() => useSetActiveWallet(), { wrapper });
    await result.current(wallet);
    const { result: switchChainResult } = renderHook(
      () => useSwitchActiveWalletChain(),
      {
        wrapper,
      },
    );
    await switchChainResult.current(optimism);

    expect(switchChain).toHaveBeenCalledWith(optimism);
  });
});
