import { afterEach } from "node:test";
import { isAddress } from "ethers6";
import { describe, expect, it, vi } from "vitest";
import { MockStorage } from "~test/mocks/storage.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { createWalletAdapter } from "../../adapters/wallet-adapter.js";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import { AUTH_TOKEN_LOCAL_STORAGE_NAME } from "../in-app/core/constants/settings.js";
import { getUrlToken } from "../in-app/web/lib/get-url-token.js";
import type { Wallet } from "../interfaces/wallet.js";
import { createConnectionManager } from "../manager/index.js";
import type { WalletId } from "../wallet-types.js";
import { autoConnectCore, handleWalletConnection } from "./autoConnectCore.js";

vi.mock("../in-app/web/lib/get-url-token.ts");

describe("useAutoConnectCore", () => {
  const mockStorage = new MockStorage();
  const manager = createConnectionManager(mockStorage);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return a useQuery result", async () => {
    vi.mocked(getUrlToken).mockReturnValue({});
    const wallet = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      chain: ethereum,
      client: TEST_CLIENT,
      onDisconnect: () => {},
      switchChain: () => {},
    });

    expect(
      await autoConnectCore({
        createWalletFn: (id: WalletId) =>
          createWalletAdapter({
            adaptedAccount: TEST_ACCOUNT_A,
            chain: ethereum,
            client: TEST_CLIENT,
            onDisconnect: () => {
              console.warn(id);
            },
            switchChain: () => {},
          }),
        force: true,
        manager,
        props: {
          client: TEST_CLIENT,
          wallets: [wallet],
        },
        storage: mockStorage,
      }),
    ).toBe(false);
  });

  it("should return `false` if there's no lastConnectedWalletIds", async () => {
    vi.mocked(getUrlToken).mockReturnValue({});

    const wallet = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      chain: ethereum,
      client: TEST_CLIENT,
      onDisconnect: () => {},
      switchChain: () => {},
    });

    expect(
      await autoConnectCore({
        createWalletFn: (id: WalletId) =>
          createWalletAdapter({
            adaptedAccount: TEST_ACCOUNT_A,
            chain: ethereum,
            client: TEST_CLIENT,
            onDisconnect: () => {
              console.warn(id);
            },
            switchChain: () => {},
          }),
        force: true,
        manager,
        props: {
          client: TEST_CLIENT,
          wallets: [wallet],
        },
        storage: mockStorage,
      }),
    ).toBe(false);
  });

  it("should handle auth cookie storage correctly", async () => {
    const mockAuthCookie = "mock-auth-cookie";
    const wallet = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      chain: ethereum,
      client: TEST_CLIENT,
      onDisconnect: () => {},
      switchChain: () => {},
    });
    vi.mocked(getUrlToken).mockReturnValue({
      authCookie: mockAuthCookie,
      walletId: wallet.id,
    });

    await autoConnectCore({
      createWalletFn: () => wallet,
      force: true,
      manager,
      props: {
        client: TEST_CLIENT,
        wallets: [wallet],
      },
      storage: mockStorage,
    });

    const storedCookie = await mockStorage.getItem(
      AUTH_TOKEN_LOCAL_STORAGE_NAME(TEST_CLIENT.clientId),
    );
    expect(storedCookie).toBe(mockAuthCookie);
  });

  it("should handle error when manager connection fails", async () => {
    const wallet1 = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      chain: ethereum,
      client: TEST_CLIENT,
      onDisconnect: () => {},
      switchChain: () => {},
    });

    mockStorage.setItem("thirdweb:active-wallet-id", wallet1.id);
    mockStorage.setItem(
      "thirdweb:connected-wallet-ids",
      JSON.stringify([wallet1.id]),
    );

    const addConnectedWalletSpy = vi
      .spyOn(manager, "connect")
      .mockRejectedValueOnce(new Error("Connection failed"));
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await autoConnectCore({
      createWalletFn: () => wallet1,
      force: true,
      manager,
      props: {
        client: TEST_CLIENT,
        wallets: [wallet1],
      },
      storage: mockStorage,
    });
    expect(addConnectedWalletSpy).toHaveBeenCalled();

    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      "Error auto connecting wallet:",
      "Connection failed",
    );
  });

  it("should connect multiple wallets correctly", async () => {
    const wallet1 = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      chain: ethereum,
      client: TEST_CLIENT,
      onDisconnect: () => {},
      switchChain: () => {},
    });

    const wallet2 = createWalletAdapter({
      adaptedAccount: { ...TEST_ACCOUNT_A, address: "0x123" },
      chain: ethereum,
      client: TEST_CLIENT,
      onDisconnect: () => {},
      switchChain: () => {},
    });
    wallet2.id = "io.metamask" as unknown as "adapter";

    mockStorage.setItem("thirdweb:active-wallet-id", wallet1.id);
    mockStorage.setItem(
      "thirdweb:connected-wallet-ids",
      JSON.stringify([wallet1.id, wallet2.id]),
    );

    const addConnectedWalletSpy = vi.spyOn(manager, "addConnectedWallet");

    await autoConnectCore({
      createWalletFn: () => wallet1,
      force: true,
      manager,
      props: {
        client: TEST_CLIENT,
        wallets: [wallet1, wallet2],
      },
      storage: mockStorage,
    });

    expect(addConnectedWalletSpy).toHaveBeenCalledWith(wallet2);
  });

  it("should handle onConnect callback correctly", async () => {
    const mockOnConnect = vi.fn();
    const wallet = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      chain: ethereum,
      client: TEST_CLIENT,
      onDisconnect: () => {},
      switchChain: () => {},
    });

    vi.mocked(getUrlToken).mockReturnValue({});
    mockStorage.setItem("thirdweb:active-wallet-id", wallet.id);
    mockStorage.setItem(
      "thirdweb:connected-wallet-ids",
      JSON.stringify([wallet.id]),
    );
    await autoConnectCore({
      createWalletFn: () => wallet,
      force: true,
      manager,
      props: {
        client: TEST_CLIENT,
        onConnect: mockOnConnect,
        wallets: [wallet],
      },
      storage: mockStorage,
    });

    expect(mockOnConnect).toHaveBeenCalledWith(wallet);
  });

  it("should continue even if onConnect callback throws", async () => {
    const mockOnConnect = vi.fn();
    mockOnConnect.mockImplementation(() => {
      throw new Error("onConnect error");
    });
    const wallet = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      chain: ethereum,
      client: TEST_CLIENT,
      onDisconnect: () => {},
      switchChain: () => {},
    });

    vi.mocked(getUrlToken).mockReturnValue({});
    mockStorage.setItem("thirdweb:active-wallet-id", wallet.id);
    mockStorage.setItem(
      "thirdweb:connected-wallet-ids",
      JSON.stringify([wallet.id]),
    );
    await autoConnectCore({
      createWalletFn: () => wallet,
      force: true,
      manager,
      props: {
        client: TEST_CLIENT,
        onConnect: mockOnConnect,
        wallets: [wallet],
      },
      storage: mockStorage,
    });

    expect(mockOnConnect).toHaveBeenCalledWith(wallet);
  });

  it("should call setLastAuthProvider if authProvider is present", async () => {
    const wallet = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      chain: ethereum,
      client: TEST_CLIENT,
      onDisconnect: () => {},
      switchChain: () => {},
    });
    vi.mocked(getUrlToken).mockReturnValue({
      authProvider: "email",
      walletId: wallet.id,
    });
    const mockSetLastAuthProvider = vi.fn();

    mockStorage.setItem("thirdweb:active-wallet-id", wallet.id);
    mockStorage.setItem(
      "thirdweb:connected-wallet-ids",
      JSON.stringify([wallet.id]),
    );
    await autoConnectCore({
      createWalletFn: () => wallet,
      force: true,
      manager,
      props: {
        client: TEST_CLIENT,
        wallets: [wallet],
      },
      setLastAuthProvider: mockSetLastAuthProvider,
      storage: mockStorage,
    });

    expect(mockSetLastAuthProvider).toHaveBeenCalledWith("email", mockStorage);
  });

  it("should set connection status to disconnect if no connectedWallet is returned", async () => {
    const wallet = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      chain: ethereum,
      client: TEST_CLIENT,
      onDisconnect: () => {},
      switchChain: () => {},
    });

    mockStorage.setItem("thirdweb:active-wallet-id", wallet.id);
    mockStorage.setItem(
      "thirdweb:connected-wallet-ids",
      JSON.stringify([wallet.id]),
    );

    const addConnectedWalletSpy = vi
      .spyOn(manager, "connect")
      .mockResolvedValueOnce(null as unknown as Wallet);

    await autoConnectCore({
      createWalletFn: () => wallet,
      force: true,
      manager,
      props: {
        client: TEST_CLIENT,
        wallets: [wallet],
      },
      storage: mockStorage,
    });

    expect(addConnectedWalletSpy).toHaveBeenCalled();
    expect(manager.activeWalletConnectionStatusStore.getValue()).toBe(
      "disconnected",
    );
  });
});

describe("handleWalletConnection", () => {
  const wallet = createWalletAdapter({
    adaptedAccount: TEST_ACCOUNT_A,
    chain: ethereum,
    client: TEST_CLIENT,
    onDisconnect: () => {},
    switchChain: () => {},
  });
  it("should return the correct result", async () => {
    const result = await handleWalletConnection({
      authResult: undefined,
      client: TEST_CLIENT,
      lastConnectedChain: ethereum,
      wallet,
    });

    expect("address" in result).toBe(true);
    expect(isAddress(result.address)).toBe(true);
    expect("sendTransaction" in result).toBe(true);
    expect(typeof result.sendTransaction).toBe("function");
    expect("signMessage" in result).toBe(true);
    expect("signTypedData" in result).toBe(true);
    expect("signTransaction" in result).toBe(true);
  });
});
