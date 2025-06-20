import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { baseSepolia } from "../../chains/chain-definitions/base-sepolia.js";
import { sepolia } from "../../chains/chain-definitions/sepolia.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { AsyncStorage } from "../../utils/storage/AsyncStorage.js";
import { inAppWallet } from "../in-app/web/in-app.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { smartWallet } from "../smart/smart-wallet.js";
import type { SmartWalletOptions } from "../smart/types.js";
import {
  createConnectionManager,
  handleSmartWalletConnection,
} from "./index.js";

describe.runIf(process.env.TW_SECRET_KEY)("Connection Manager", () => {
  let storage: AsyncStorage;
  let client: ThirdwebClient;
  let wallet: Wallet;
  let account: Account;
  let smartWalletOptions: SmartWalletOptions;

  beforeEach(() => {
    storage = {
      getItem: vi.fn(),
      removeItem: vi.fn(),
      setItem: vi.fn(),
    };
    client = TEST_CLIENT;
    account = TEST_ACCOUNT_A;
    wallet = {
      disconnect: vi.fn(),
      getAccount: vi.fn().mockReturnValue(account),
      getChain: vi.fn().mockReturnValue(sepolia),
      getConfig: vi.fn(),
      id: "wallet-id",
      subscribe: vi.fn().mockReturnValue(vi.fn()),
      switchChain: vi.fn(),
    } as unknown as Wallet;
    smartWalletOptions = {
      chain: sepolia,
    } as SmartWalletOptions;
  });

  it("connect should handle connection and call onConnect", async () => {
    const manager = createConnectionManager(storage);
    const onConnect = vi.fn();

    await manager.connect(wallet, { client, onConnect });

    expect(onConnect).toHaveBeenCalledWith(wallet);
    expect(storage.setItem).toHaveBeenCalled();
  });

  it("handleConnection should connect smart wallet", async () => {
    const manager = createConnectionManager(storage);

    const smartWallet = await manager.handleConnection(wallet, {
      accountAbstraction: smartWalletOptions,
      client,
    });

    expect(manager.activeWalletStore.getValue()).toBe(smartWallet);
  });

  it("handleConnection should add wallet to connected wallets", async () => {
    const manager = createConnectionManager(storage);

    await manager.handleConnection(wallet, { client });

    expect(manager.connectedWallets.getValue()).toContain(wallet);
  });

  it("should disconnect the active wallet when the EOA disconnects", async () => {
    const manager = createConnectionManager(storage);

    const smartWallet = await manager.handleConnection(wallet, {
      accountAbstraction: smartWalletOptions,
      client,
    });

    expect(manager.activeWalletStore.getValue()).toBe(smartWallet);

    await wallet.disconnect();

    expect(wallet.subscribe).toHaveBeenCalledWith(
      "disconnect",
      expect.any(Function),
    );
  });

  it("should clear active wallet data on disconnect", async () => {
    const manager = createConnectionManager(storage);

    await manager.handleConnection(wallet, { client });

    // Simulate wallet disconnect
    manager.disconnectWallet(wallet);

    expect(storage.removeItem).toHaveBeenCalledWith(
      "thirdweb:active-wallet-id",
    );
    expect(manager.activeAccountStore.getValue()).toBeUndefined();
    expect(manager.activeWalletChainStore.getValue()).toBeUndefined();
    expect(manager.activeWalletStore.getValue()).toBeUndefined();
    expect(manager.activeWalletConnectionStatusStore.getValue()).toBe(
      "disconnected",
    );
  });

  it("should throw an error if wallet has no account", async () => {
    const manager = createConnectionManager(storage);

    wallet = {
      disconnect: vi.fn(),
      getAccount: vi.fn().mockReturnValue(null),
      getChain: vi.fn().mockReturnValue(sepolia),
      getConfig: vi.fn(),
      id: "wallet-id",
      subscribe: vi.fn(),
      switchChain: vi.fn(),
    } as unknown as Wallet;

    await expect(manager.handleConnection(wallet, { client })).rejects.toThrow(
      "Cannot set a wallet without an account as active",
    );
  });

  it("should set active wallet and update storage", async () => {
    const manager = createConnectionManager(storage);

    await manager.setActiveWallet(wallet);

    expect(manager.activeWalletStore.getValue()).toBe(wallet);
    expect(storage.setItem).toHaveBeenCalledWith(
      "thirdweb:active-wallet-id",
      wallet.id,
    );
  });

  it("should switch active wallet chain", async () => {
    const manager = createConnectionManager(storage);

    await manager.handleConnection(wallet, { client });

    const newChain = {
      id: 2,
      name: "New Chain",
      rpc: "https://rpc.example.com",
    };

    // Mock the switchChain method to update the activeWalletChainStore
    wallet.switchChain = vi.fn().mockImplementation((chain) => {
      manager.activeWalletChainStore.setValue(chain);
    });

    await manager.switchActiveWalletChain(newChain);

    expect(wallet.switchChain).toHaveBeenCalledWith(newChain);
  });

  it("should switch admin wallet for smart wallet if available", async () => {
    const manager = createConnectionManager(storage);
    const adminAccount = TEST_ACCOUNT_A;
    const adminWallet = inAppWallet();
    adminWallet.getAccount = () => adminAccount;

    const _wallet = smartWallet({
      chain: baseSepolia,
      sponsorGas: true,
    });
    await _wallet.connect({
      client,
      personalAccount: adminAccount,
    });

    await manager.handleConnection(adminWallet, { client });
    await manager.handleConnection(_wallet, { client });

    const newChain = {
      id: 2,
      name: "New Chain",
      rpc: "https://rpc.example.com",
    };

    // Mock storage and wallet setup
    storage.getItem = vi.fn().mockResolvedValue("inApp");
    adminWallet.id = "inApp";
    _wallet.switchChain = vi.fn();
    adminWallet.switchChain = vi.fn();

    // Add wallets to connected wallets store
    manager.addConnectedWallet(adminWallet);
    manager.addConnectedWallet(_wallet);

    await manager.switchActiveWalletChain(newChain);

    expect(_wallet.switchChain).toHaveBeenCalledWith(newChain);
    expect(adminWallet.switchChain).toHaveBeenCalledWith(newChain);
  });

  it("should define chains", async () => {
    const manager = createConnectionManager(storage);
    await manager.handleConnection(wallet, { client });

    const chains = [
      { id: 1, name: "Chain 1", rpc: "https://rpc1.example.com" },
      { id: 2, name: "Chain 2", rpc: "https://rpc2.example.com" },
    ];
    manager.defineChains(chains);

    const activeWalletChain = manager.activeWalletChainStore.getValue();
    expect(activeWalletChain).toBeDefined();
  });

  it("should remove connected wallet", () => {
    const manager = createConnectionManager(storage);

    manager.addConnectedWallet(wallet);
    expect(manager.connectedWallets.getValue()).toContain(wallet);

    manager.removeConnectedWallet(wallet);
    expect(manager.connectedWallets.getValue()).not.toContain(wallet);
  });

  it("should update active wallet chain to a defined chain", async () => {
    const manager = createConnectionManager(storage);

    // Connect the wallet to initialize the active wallet chain
    await manager.handleConnection(wallet, { client });

    // Define a new chain and update the definedChainsStore
    const newChain = {
      id: 11155111,
      name: "New Defined Chain",
      rpc: "https://rpc3.example.com",
    };
    manager.defineChains([newChain]);

    // Simulate the effect that updates the active wallet chain
    const definedChain = manager.activeWalletChainStore.getValue();
    expect(definedChain).toEqual(newChain);
  });

  describe("handleSmartWalletConnection", () => {
    let client: ThirdwebClient;
    let eoaWallet: Wallet;
    let smartWalletOptions: SmartWalletOptions;

    beforeEach(() => {
      client = TEST_CLIENT;
      eoaWallet = {
        disconnect: vi.fn(),
        getAccount: vi.fn().mockReturnValue(TEST_ACCOUNT_A),
        getChain: vi.fn().mockReturnValue(sepolia),
        getConfig: vi.fn(),
        id: "eoa-wallet-id",
        subscribe: vi.fn().mockReturnValue(vi.fn()),
        switchChain: vi.fn(),
      } as unknown as Wallet;
      smartWalletOptions = {
        chain: sepolia,
      } as SmartWalletOptions;
    });

    it("should connect a smart wallet and subscribe to disconnect event", async () => {
      const onWalletDisconnect = vi.fn();
      const smartWallet = await handleSmartWalletConnection(
        eoaWallet,
        client,
        smartWalletOptions,
        onWalletDisconnect,
      );

      expect(smartWallet.getAccount()).toBeTruthy();

      expect(eoaWallet.subscribe).toHaveBeenCalledWith(
        "disconnect",
        expect.any(Function),
      );
    });

    it("should call onWalletDisconnect when EOA wallet disconnects", async () => {
      const onWalletDisconnect = vi.fn();
      const smartWallet = await handleSmartWalletConnection(
        eoaWallet,
        client,
        smartWalletOptions,
        onWalletDisconnect,
      );

      // biome-ignore lint/suspicious/noExplicitAny: Mocked function
      const disconnectCallback = (eoaWallet.subscribe as any).mock.calls[0][1];
      disconnectCallback();

      expect(onWalletDisconnect).toHaveBeenCalledWith(smartWallet);
    });

    it("should throw an error if EOA wallet has no account", async () => {
      eoaWallet.getAccount = vi.fn().mockReturnValue(null);

      await expect(
        handleSmartWalletConnection(
          eoaWallet,
          client,
          smartWalletOptions,
          vi.fn(),
        ),
      ).rejects.toThrow("Cannot set a wallet without an account as active");
    });
  });

  describe("Connection Manager Error Handling", () => {
    let storage: AsyncStorage;
    let client: ThirdwebClient;
    let wallet: Wallet;

    beforeEach(() => {
      storage = {
        getItem: vi.fn(),
        removeItem: vi.fn(),
        setItem: vi.fn(),
      };
      client = TEST_CLIENT;
      wallet = {
        disconnect: vi.fn(),
        getAccount: vi.fn().mockReturnValue(null), // Simulate wallet without an account
        getChain: vi.fn().mockReturnValue(sepolia),
        getConfig: vi.fn(),
        id: "wallet-id",
        subscribe: vi.fn(),
        switchChain: vi.fn(),
      } as unknown as Wallet;
    });

    it("should throw an error if trying to set a wallet without an account as active", async () => {
      const manager = createConnectionManager(storage);

      await expect(manager.setActiveWallet(wallet)).rejects.toThrow(
        "Cannot set a wallet without an account as active",
      );
    });

    it("should throw an error if handleConnection is called with a wallet without an account", async () => {
      const manager = createConnectionManager(storage);

      await expect(
        manager.handleConnection(wallet, { client }),
      ).rejects.toThrow("Cannot set a wallet without an account as active");
    });
  });

  describe("Connection Manager Event Subscriptions", () => {
    let storage: AsyncStorage;
    let client: ThirdwebClient;
    let wallet: Wallet;
    let account: Account;

    beforeEach(() => {
      storage = {
        getItem: vi.fn(),
        removeItem: vi.fn(),
        setItem: vi.fn(),
      };
      client = TEST_CLIENT;
      account = TEST_ACCOUNT_A;
      wallet = {
        disconnect: vi.fn(),
        getAccount: vi.fn().mockReturnValue(account),
        getChain: vi.fn().mockReturnValue(sepolia),
        getConfig: vi.fn(),
        id: "wallet-id",
        subscribe: vi.fn().mockReturnValue(vi.fn()),
        switchChain: vi.fn(),
      } as unknown as Wallet;
    });

    it("should subscribe to accountChanged, chainChanged, and disconnect events", async () => {
      const manager = createConnectionManager(storage);

      await manager.handleConnection(wallet, { client });

      expect(wallet.subscribe).toHaveBeenCalledWith(
        "accountChanged",
        expect.any(Function),
      );
      expect(wallet.subscribe).toHaveBeenCalledWith(
        "chainChanged",
        expect.any(Function),
      );
      expect(wallet.subscribe).toHaveBeenCalledWith(
        "disconnect",
        expect.any(Function),
      );
    });
  });
});
