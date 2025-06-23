import * as ox__Hex from "ox/Hex";
import { describe, expect, test, vi } from "vitest";
import { TEST_WALLET_B } from "~test/addresses.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { typedData } from "~test/typed-data.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { waitForReceipt } from "../../transaction/actions/wait-for-tx-receipt.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import type { Account, Wallet } from "../../wallets/interfaces/wallet.js";
import { getWalletBalance } from "../../wallets/utils/getWalletBalance.js";
import { createWalletEmitter } from "../../wallets/wallet-emitter.js";
import { toProvider } from "./to-eip1193.js";

describe("toProvider", () => {
  const mockAccount: Account = TEST_ACCOUNT_A;
  const emitter = createWalletEmitter();

  const mockWallet: Wallet = {
    autoConnect: vi.fn().mockResolvedValue(mockAccount),
    connect: vi.fn().mockResolvedValue(mockAccount),
    disconnect: vi.fn(),
    getAccount: () => mockAccount,
    getChain: () => ANVIL_CHAIN,
    getConfig: () => undefined,
    id: "io.metamask",
    subscribe: emitter.subscribe,
    switchChain: vi.fn(),
  };

  test("should create a provider with the correct interface", () => {
    const provider = toProvider({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      wallet: mockWallet,
    });

    expect(provider.on).toBeDefined();
    expect(provider.removeListener).toBeDefined();
    expect(provider.request).toBeDefined();
  });

  test("should handle eth_requestAccounts", async () => {
    const provider = toProvider({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      wallet: mockWallet,
    });

    const accounts = await provider.request({
      method: "eth_requestAccounts",
      params: [],
    });

    expect(accounts).toEqual([mockAccount.address]);
  });

  test("should handle eth_accounts", async () => {
    const provider = toProvider({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      wallet: mockWallet,
    });

    const accounts = await provider.request({
      method: "eth_accounts",
      params: [],
    });

    expect(accounts).toEqual([mockAccount.address]);
  });

  test("should handle personal_sign", async () => {
    const provider = toProvider({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      wallet: mockWallet,
    });

    const message = "0x48656c6c6f20776f726c64";
    const result = await provider.request({
      method: "personal_sign",
      params: [message, mockAccount.address],
    });

    expect(result).toEqual(
      "0x15a3fe3974ebe469b00e67ad67bb3860ad3fc3d739287cdbc4ba558ce7130bee205e5e38d6ef156f1ff6a4df17bfa72a1e61c429f92613f3efbc58394d00c9891b",
    );
  });

  test("should handle eth_signTypedData_v4", async () => {
    const provider = toProvider({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      wallet: mockWallet,
    });

    const result = await provider.request({
      method: "eth_signTypedData_v4",
      params: [mockAccount.address, JSON.stringify(typedData.basic)],
    });

    expect(result).toEqual(
      "0x32f3d5975ba38d6c2fba9b95d5cbed1febaa68003d3d588d51f2de522ad54117760cfc249470a75232552e43991f53953a3d74edf6944553c6bef2469bb9e5921b",
    );
  });

  test("should handle eth_sendTransaction", async () => {
    const provider = toProvider({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      wallet: mockWallet,
    });

    const tx = prepareTransaction({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      to: TEST_WALLET_B,
      value: 100n,
    });

    const balanceBefore = await getWalletBalance({
      address: mockAccount.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    const result = await provider.request({
      method: "eth_sendTransaction",
      params: [tx],
    });

    expect(ox__Hex.validate(result)).toBe(true);
    const receipt = await waitForReceipt({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      transactionHash: result,
    });

    expect(receipt.status).toBe("success");

    const balanceAfter = await getWalletBalance({
      address: mockAccount.address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    expect(balanceAfter.value).toBeLessThan(balanceBefore.value);
  });

  test("should handle eth_estimateGas", async () => {
    const provider = toProvider({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      wallet: mockWallet,
    });

    const tx = prepareTransaction({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      to: TEST_WALLET_B,
      value: 100n,
    });

    const result = await provider.request({
      method: "eth_estimateGas",
      params: [tx],
    });

    expect(result).toBeGreaterThan(0n);
  });

  test("should throw error when account is not connected", async () => {
    const walletWithoutAccount = {
      ...mockWallet,
      getAccount: () => undefined,
    };

    const provider = toProvider({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      wallet: walletWithoutAccount,
    });

    await expect(
      provider.request({
        method: "eth_accounts",
        params: [],
      }),
    ).rejects.toThrow("Account not connected");
  });

  test("should use custom connect override when provided", async () => {
    const customConnect = vi.fn().mockResolvedValue(mockAccount);

    const provider = toProvider({
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      connectOverride: customConnect,
      wallet: mockWallet,
    });

    await provider.request({
      method: "eth_requestAccounts",
      params: [],
    });

    expect(customConnect).toHaveBeenCalledWith(mockWallet);
  });
});
