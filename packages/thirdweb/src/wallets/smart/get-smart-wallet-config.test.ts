import { describe, expect, it } from "vitest";
import { optimism } from "../../chains/chain-definitions/optimism.js";
import type { Wallet } from "../interfaces/wallet.js";
import { getSmartWallet } from "./get-smart-wallet-config.js";
import type { SmartWalletOptions } from "./types.js";

describe("getSmartWallet", () => {
  const mockSmartWalletConfig: SmartWalletOptions = {
    chain: optimism,
    sponsorGas: false,
  };

  it("should return config for smart wallet ID", () => {
    const wallet = {
      id: "smart",
      getConfig: () => mockSmartWalletConfig,
    } as Wallet<"smart">;

    expect(getSmartWallet(wallet)).toBe(mockSmartWalletConfig);
  });

  it("should return smartAccount config for wallet with smartAccount", () => {
    const wallet = {
      id: "inApp",
      getConfig: () => ({
        smartAccount: mockSmartWalletConfig,
      }),
    } as Wallet;

    expect(getSmartWallet(wallet)).toBe(mockSmartWalletConfig);
  });

  it("should throw error for non-smart wallet", () => {
    const wallet = {
      id: "inApp",
      getConfig: () => ({}),
    } as Wallet;

    expect(() => getSmartWallet(wallet)).toThrow(
      "Wallet is not a smart wallet",
    );
  });

  it("should throw error when getConfig returns null", () => {
    const wallet = {
      id: "inApp",
      getConfig: () => null,
      // biome-ignore lint/suspicious/noExplicitAny: Testing invalid config
    } as any as Wallet;

    expect(() => getSmartWallet(wallet)).toThrow(
      "Wallet is not a smart wallet",
    );
  });

  it("should throw error when smartAccount is null", () => {
    const wallet = {
      id: "inApp",
      getConfig: () => ({ smartAccount: null }),
      // biome-ignore lint/suspicious/noExplicitAny: Testing invalid config
    } as any as Wallet;

    expect(() => getSmartWallet(wallet)).toThrow(
      "Wallet is not a smart wallet",
    );
  });
});
