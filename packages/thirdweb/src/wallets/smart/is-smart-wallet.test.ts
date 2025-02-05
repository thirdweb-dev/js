import { describe, expect, it } from "vitest";
import type { Wallet } from "../interfaces/wallet.js";
import { isSmartWallet } from "./is-smart-wallet.js";

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
