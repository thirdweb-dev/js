import { describe, expect, it } from "vitest";
import type { Wallet } from "../interfaces/wallet.js";
import {
  hasSponsoredTransactionsEnabled,
  isSmartWallet,
} from "./is-smart-wallet.js";

describe("isSmartWallet", () => {
  it("should return true for smart wallet ID", () => {
    const wallet = {
      id: "smart",
    } as Wallet;
    expect(isSmartWallet(wallet)).toBe(true);
  });

  it("should return true for wallet with smartAccount config", () => {
    const wallet = {
      id: "inApp",
      getConfig: () => ({
        smartAccount: {
          chain: { id: 1, name: "test", rpc: "test" },
        },
      }),
    } as Wallet;
    expect(isSmartWallet(wallet)).toBe(true);
  });

  it("should return true for wallet with EIP7702 config", () => {
    const wallet = {
      id: "inApp",
      getConfig: () => ({
        executionMode: {
          mode: "EIP7702",
        },
      }),
    } as Wallet;
    expect(isSmartWallet(wallet)).toBe(true);
  });

  it("should return true for wallet with EIP4337 config", () => {
    const wallet = {
      id: "inApp",
      getConfig: () => ({
        executionMode: {
          mode: "EIP4337",
          smartAccount: {
            chain: { id: 1, name: "test", rpc: "test" },
            sponsorGas: true,
          },
        },
      }),
    } as Wallet;
    expect(isSmartWallet(wallet)).toBe(true);
  });

  it("should return false for non-smart wallet", () => {
    const wallet = {
      id: "inApp",
      getConfig: () => ({}),
    } as Wallet;
    expect(isSmartWallet(wallet)).toBe(false);
  });

  it("should return false when getConfig returns null", () => {
    const wallet = {
      id: "inApp",
      getConfig: () => null,
      // biome-ignore lint/suspicious/noExplicitAny: Testing invalid config
    } as any as Wallet;
    expect(isSmartWallet(wallet)).toBe(false);
  });

  it("should return false when getConfig returns undefined", () => {
    const wallet = {
      id: "inApp",
      getConfig: () => undefined,
    } as Wallet;
    expect(isSmartWallet(wallet)).toBe(false);
  });

  it("should return false when smartAccount is null", () => {
    const wallet = {
      id: "inApp",
      // biome-ignore lint/suspicious/noExplicitAny: Testing invalid config
      getConfig: () => ({ smartAccount: null }) as any,
    } as Wallet;
    expect(isSmartWallet(wallet)).toBe(false);
  });
});

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

  it("should handle inApp wallet with EIP7702 config", () => {
    const mockInAppWallet = {
      id: "inApp",
      getConfig: () => ({
        executionMode: {
          mode: "EIP7702",
          sponsorGas: true,
        },
      }),
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockInAppWallet)).toBe(true);

    const mockInAppWalletDisabled = {
      id: "inApp",
      getConfig: () => ({
        executionMode: {
          mode: "EIP7702",
        },
      }),
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockInAppWalletDisabled)).toBe(
      false,
    );
  });

  it("should handle inApp wallet with EIP4337 config", () => {
    const mockInAppWallet = {
      id: "inApp",
      getConfig: () => ({
        executionMode: {
          mode: "EIP4337",
          smartAccount: {
            chain: { id: 1, name: "test", rpc: "test" },
            sponsorGas: true,
          },
        },
      }),
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockInAppWallet)).toBe(true);

    const mockInAppWalletDisabled = {
      id: "inApp",
      getConfig: () => ({
        executionMode: {
          mode: "EIP4337",
          smartAccount: {
            chain: { id: 1, name: "test", rpc: "test" },
            sponsorGas: false,
          },
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
