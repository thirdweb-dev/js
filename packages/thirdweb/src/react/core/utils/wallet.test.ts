import { describe, expect, it } from "vitest";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import { hasSponsoredTransactionsEnabled } from "../../../wallets/smart/is-smart-wallet.js";

describe("hasSponsoredTransactionsEnabled", () => {
  it("should return false for undefined wallet", () => {
    expect(hasSponsoredTransactionsEnabled(undefined)).toBe(false);
  });

  it("should handle smart wallet with sponsorGas config", () => {
    const mockSmartWallet = {
      getConfig: () => ({ sponsorGas: true }),
      id: "smart",
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockSmartWallet)).toBe(true);

    const mockSmartWalletDisabled = {
      getConfig: () => ({ sponsorGas: false }),
      id: "smart",
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockSmartWalletDisabled)).toBe(
      false,
    );
  });

  it("should handle smart wallet with gasless config", () => {
    const mockSmartWallet = {
      getConfig: () => ({ gasless: true }),
      id: "smart",
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockSmartWallet)).toBe(true);
  });

  it("should handle inApp wallet with smartAccount config", () => {
    const mockInAppWallet = {
      getConfig: () => ({
        smartAccount: {
          sponsorGas: true,
        },
      }),
      id: "inApp",
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockInAppWallet)).toBe(true);

    const mockInAppWalletDisabled = {
      getConfig: () => ({
        smartAccount: {
          sponsorGas: false,
        },
      }),
      id: "inApp",
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockInAppWalletDisabled)).toBe(
      false,
    );
  });

  it("should handle inApp wallet with gasless config", () => {
    const mockInAppWallet = {
      getConfig: () => ({
        smartAccount: {
          gasless: true,
        },
      }),
      id: "inApp",
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockInAppWallet)).toBe(true);
  });

  it("should return false for regular wallet without smart account config", () => {
    const mockRegularWallet = {
      getConfig: () => ({}),
      id: "inApp",
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockRegularWallet)).toBe(false);
  });
});
