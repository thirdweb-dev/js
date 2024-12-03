import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { sepolia } from "../../chains/chain-definitions/sepolia.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { AsyncStorage } from "../../utils/storage/AsyncStorage.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import type { SmartWalletOptions } from "../smart/types.js";
import { createConnectionManager } from "./index.js";

describe.runIf(process.env.TW_SECRET_KEY)("Connection Manager", () => {
  let storage: AsyncStorage;
  let client: ThirdwebClient;
  let wallet: Wallet;
  let account: Account;
  let smartWalletOptions: SmartWalletOptions;

  beforeEach(() => {
    storage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    client = TEST_CLIENT;
    account = TEST_ACCOUNT_A;
    wallet = {
      id: "wallet-id",
      getAccount: vi.fn().mockReturnValue(account),
      subscribe: vi.fn(),
      disconnect: vi.fn(),
      switchChain: vi.fn(),
      getChain: vi.fn().mockReturnValue(sepolia),
      getConfig: vi.fn(),
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
    expect(storage.setItem).toHaveBeenCalledWith(expect.any(String), wallet.id);
  });

  it("handleConnection should connect smart wallet", async () => {
    const manager = createConnectionManager(storage);

    const smartWallet = await manager.handleConnection(wallet, {
      client,
      accountAbstraction: smartWalletOptions,
    });

    expect(manager.activeWalletStore.getValue()).toBe(smartWallet);
  });

  it("handleConnection should add wallet to connected wallets", async () => {
    const manager = createConnectionManager(storage);

    await manager.handleConnection(wallet, { client });

    expect(manager.connectedWallets.getValue()).toContain(wallet);
  });
});
