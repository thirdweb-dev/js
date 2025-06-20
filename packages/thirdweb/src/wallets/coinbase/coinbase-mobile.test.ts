import type { ProviderInterface } from "@coinbase/wallet-sdk";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getCoinbaseMobileProvider } from "./coinbase-mobile.js";
import type { CoinbaseWalletCreationOptions } from "./coinbase-web.js";

// Mock dependencies
vi.mock("expo-linking", () => ({
  addEventListener: vi.fn(),
}));

vi.mock("@mobile-wallet-protocol/client", () => ({
  EIP1193Provider: class {
    constructor() {
      // biome-ignore lint/correctness/noConstructorReturn: Inside tests
      return {
        request: vi.fn(),
      };
    }
  },
  handleResponse: vi.fn(),
  Wallets: {
    CoinbaseSmartWallet: {},
  },
}));

vi.mock("@coinbase/wallet-mobile-sdk", () => ({
  configure: vi.fn(),
  handleResponse: vi.fn(),
}));

vi.mock("@coinbase/wallet-mobile-sdk/build/WalletMobileSDKEVMProvider", () => ({
  WalletMobileSDKEVMProvider: class {
    constructor() {
      // biome-ignore lint/correctness/noConstructorReturn: Inside tests
      return {
        request: vi.fn(),
      };
    }
  },
}));

describe("Coinbase Mobile", () => {
  let provider: undefined | ProviderInterface;

  beforeEach(() => {
    provider = undefined;
  });

  test("getCoinbaseMobileProvider initializes smart wallet provider", async () => {
    const options: CoinbaseWalletCreationOptions = {
      mobileConfig: { callbackURL: "https://example.com" },
      walletConfig: { options: "smartWalletOnly" },
    };

    provider = await getCoinbaseMobileProvider(options);
    expect(provider).toBeDefined();
    expect(provider.request).toBeInstanceOf(Function);
  });

  test("getCoinbaseMobileProvider initializes coinbase app provider", async () => {
    const options: CoinbaseWalletCreationOptions = {
      mobileConfig: { callbackURL: "https://example.com" },
    };

    provider = await getCoinbaseMobileProvider(options);
    expect(provider).toBeDefined();
    expect(provider.request).toBeInstanceOf(Function);
  });
});
