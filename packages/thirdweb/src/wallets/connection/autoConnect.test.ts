import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { createWalletAdapter } from "../../adapters/wallet-adapter.js";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import { webLocalStorage } from "../../utils/storage/webStorage.js";
import { createWallet } from "../create-wallet.js";
import { getInstalledWalletProviders } from "../injected/mipdStore.js";
import { autoConnect } from "./autoConnect.js";
import { autoConnectCore } from "./autoConnectCore.js";

vi.mock("../../utils/storage/webStorage.js");
vi.mock("../create-wallet.js");
vi.mock("../injected/mipdStore.js");
vi.mock("./autoConnectCore.js");

describe("autoConnect", () => {
  const mockWallet = createWalletAdapter({
    adaptedAccount: TEST_ACCOUNT_A,
    client: TEST_CLIENT,
    chain: ethereum,
    onDisconnect: () => {},
    switchChain: () => {},
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getInstalledWalletProviders).mockReturnValue([]);
    vi.mocked(createWallet).mockReturnValue(mockWallet);
    vi.mocked(autoConnectCore).mockResolvedValue(true);
  });

  it("should call autoConnectCore with correct parameters when wallets are provided", async () => {
    const result = await autoConnect({
      client: TEST_CLIENT,
      wallets: [mockWallet],
    });

    expect(autoConnectCore).toHaveBeenCalledWith({
      storage: webLocalStorage,
      props: {
        client: TEST_CLIENT,
        wallets: [mockWallet],
      },
      createWalletFn: createWallet,
      getInstalledWallets: expect.any(Function),
      manager: expect.any(Object),
    });
    expect(result).toBe(true);
  });

  it("should use default wallets when no wallets are provided", async () => {
    await autoConnect({
      wallets: [],
      client: TEST_CLIENT,
    });

    expect(autoConnectCore).toHaveBeenCalledWith(
      expect.objectContaining({
        props: {
          client: TEST_CLIENT,
          wallets: [],
        },
      }),
    );
  });
});
