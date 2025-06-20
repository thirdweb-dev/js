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
      getConfig: () => ({
        smartAccount: {
          chain: { id: 1, name: "test", rpc: "test" },
        },
      }),
      id: "inApp",
    } as Wallet;
    expect(isSmartWallet(wallet)).toBe(true);
  });

  it("should return true for wallet with EIP7702 config", () => {
    const wallet = {
      getConfig: () => ({
        executionMode: {
          mode: "EIP7702",
        },
      }),
      id: "inApp",
    } as Wallet;
    expect(isSmartWallet(wallet)).toBe(true);
  });

  it("should return true for wallet with EIP4337 config", () => {
    const wallet = {
      getConfig: () => ({
        executionMode: {
          mode: "EIP4337",
          smartAccount: {
            chain: { id: 1, name: "test", rpc: "test" },
            sponsorGas: true,
          },
        },
      }),
      id: "inApp",
    } as Wallet;
    expect(isSmartWallet(wallet)).toBe(true);
  });

  it("should return false for non-smart wallet", () => {
    const wallet = {
      getConfig: () => ({}),
      id: "inApp",
    } as Wallet;
    expect(isSmartWallet(wallet)).toBe(false);
  });

  it("should return false when getConfig returns null", () => {
    const wallet = {
      getConfig: () => null,
      id: "inApp",
      // biome-ignore lint/suspicious/noExplicitAny: Testing invalid config
    } as any as Wallet;
    expect(isSmartWallet(wallet)).toBe(false);
  });

  it("should return false when getConfig returns undefined", () => {
    const wallet = {
      getConfig: () => undefined,
      id: "inApp",
    } as Wallet;
    expect(isSmartWallet(wallet)).toBe(false);
  });

  it("should return false when smartAccount is null", () => {
    const wallet = {
      // biome-ignore lint/suspicious/noExplicitAny: Testing invalid config
      getConfig: () => ({ smartAccount: null }) as any,
      id: "inApp",
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

  it("should handle inApp wallet with EIP7702 config", () => {
    const mockInAppWallet = {
      getConfig: () => ({
        executionMode: {
          mode: "EIP7702",
          sponsorGas: true,
        },
      }),
      id: "inApp",
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockInAppWallet)).toBe(true);

    const mockInAppWalletDisabled = {
      getConfig: () => ({
        executionMode: {
          mode: "EIP7702",
        },
      }),
      id: "inApp",
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockInAppWalletDisabled)).toBe(
      false,
    );
  });

  it("should handle inApp wallet with EIP4337 config", () => {
    const mockInAppWallet = {
      getConfig: () => ({
        executionMode: {
          mode: "EIP4337",
          smartAccount: {
            chain: { id: 1, name: "test", rpc: "test" },
            sponsorGas: true,
          },
        },
      }),
      id: "inApp",
    } as Wallet;
    expect(hasSponsoredTransactionsEnabled(mockInAppWallet)).toBe(true);

    const mockInAppWalletDisabled = {
      getConfig: () => ({
        executionMode: {
          mode: "EIP4337",
          smartAccount: {
            chain: { id: 1, name: "test", rpc: "test" },
            sponsorGas: false,
          },
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
