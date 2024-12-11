import { describe, expect, it } from "vitest";
import type { Wallet } from "../../../wallets/interfaces/wallet";
import { hasSponsoredTransactionsEnabled } from "./wallet";

describe("hasSponsoredTransactionsEnabled", () => {
  it("should return false for undefined wallet", () => {
    expect(hasSponsoredTransactionsEnabled(undefined)).toBe(false);
  });

  it("should handle smart wallet with sponsorGas config", () => {
    const mockSmartWallet = {
      id: "smart",
      getConfig: () => ({ sponsorGas: true }),
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockSmartWallet)).toBe(true);

    const mockSmartWalletDisabled = {
      id: "smart",
      getConfig: () => ({ sponsorGas: false }),
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockSmartWalletDisabled)).toBe(
      false,
    );
  });

  it("should handle smart wallet with gasless config", () => {
    const mockSmartWallet = {
      id: "smart",
      getConfig: () => ({ gasless: true }),
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockSmartWallet)).toBe(true);
  });

  it("should handle inApp wallet with smartAccount config", () => {
    const mockInAppWallet = {
      id: "inApp",
      getConfig: () => ({
        smartAccount: {
          sponsorGas: true,
        },
      }),
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockInAppWallet)).toBe(true);

    const mockInAppWalletDisabled = {
      id: "inApp",
      getConfig: () => ({
        smartAccount: {
          sponsorGas: false,
        },
      }),
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockInAppWalletDisabled)).toBe(
      false,
    );
  });

  it("should handle inApp wallet with gasless config", () => {
    const mockInAppWallet = {
      id: "inApp",
      getConfig: () => ({
        smartAccount: {
          gasless: true,
        },
      }),
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockInAppWallet)).toBe(true);
  });

  it("should return false for regular wallet without smart account config", () => {
    const mockRegularWallet = {
      id: "inApp",
      getConfig: () => ({}),
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockRegularWallet)).toBe(false);
  });
});
