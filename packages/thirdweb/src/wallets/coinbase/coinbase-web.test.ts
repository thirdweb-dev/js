import type { ProviderInterface } from "@coinbase/wallet-sdk";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {} from "../../chains/utils.js";
import { COINBASE } from "../constants.js";
import type { Wallet } from "../interfaces/wallet.js";
import {
  autoConnectCoinbaseWalletSDK,
  connectCoinbaseWalletSDK,
  getCoinbaseWebProvider,
  isCoinbaseSDKWallet,
} from "./coinbase-web.js";

// Mock dependencies
vi.mock("@coinbase/wallet-sdk", () => ({
  default: class {
    makeWeb3Provider() {
      return {
        request: vi.fn(),
        on: vi.fn(),
        removeListener: vi.fn(),
        disconnect: vi.fn(),
      };
    }
  },
}));

vi.mock("../../utils/address.js", () => ({
  getAddress: vi.fn((address) => address),
}));

vi.mock("../../chains/utils.js", () => ({
  getCachedChain: vi.fn((chainId) => ({ id: chainId })),
  getChainMetadata: vi.fn(async (_chain) => ({
    name: "Test Chain",
    nativeCurrency: { name: "Test Coin", symbol: "TC", decimals: 18 },
    explorers: [{ url: "https://explorer.test" }],
  })),
}));

vi.mock("../../utils/normalizeChainId.js", () => ({
  normalizeChainId: vi.fn((chainId) => Number(chainId)),
}));

describe("Coinbase Web", () => {
  let provider: ProviderInterface;

  beforeEach(async () => {
    provider = await getCoinbaseWebProvider();
  });

  test("getCoinbaseWebProvider initializes provider", async () => {
    expect(provider).toBeDefined();
    expect(provider.request).toBeInstanceOf(Function);
  });

  test("isCoinbaseSDKWallet returns true for Coinbase wallet", () => {
    const wallet: Wallet = { id: COINBASE } as Wallet;
    expect(isCoinbaseSDKWallet(wallet)).toBe(true);
  });

  test("isCoinbaseSDKWallet returns false for non-Coinbase wallet", () => {
    const wallet: Wallet = { id: "other" } as unknown as Wallet;
    expect(isCoinbaseSDKWallet(wallet)).toBe(false);
  });

  test("connectCoinbaseWalletSDK connects to the wallet", async () => {
    provider.request = vi
      .fn()
      .mockResolvedValueOnce(["0x123"])
      .mockResolvedValueOnce("0x1");
    const emitter = { emit: vi.fn() };
    const options = { client: {} };

    const [account, chain] = await connectCoinbaseWalletSDK(
      // biome-ignore lint/suspicious/noExplicitAny: Inside tests
      options as any,
      // biome-ignore lint/suspicious/noExplicitAny: Inside tests
      emitter as any,
      provider,
    );

    expect(account.address).toBe("0x123");
    expect(chain.id).toBe(1);
  });

  test("autoConnectCoinbaseWalletSDK auto-connects to the wallet", async () => {
    provider.request = vi
      .fn()
      .mockResolvedValueOnce(["0x123"])
      .mockResolvedValueOnce("0x1");
    const emitter = { emit: vi.fn() };
    const options = { client: {} };

    const [account, chain] = await autoConnectCoinbaseWalletSDK(
      // biome-ignore lint/suspicious/noExplicitAny: Inside tests
      options as any,
      // biome-ignore lint/suspicious/noExplicitAny: Inside tests
      emitter as any,
      provider,
    );

    expect(account.address).toBe("0x123");
    expect(chain.id).toBe(1);
  });
});
