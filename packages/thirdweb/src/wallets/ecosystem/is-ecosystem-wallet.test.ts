import { describe, expect, it } from "vitest";
import { createWallet } from "../create-wallet.js";
import { isEcosystemWallet } from "./is-ecosystem-wallet.js";

describe("isEcosystemWallet", () => {
  it('should return true for wallet IDs starting with "ecosystem."', () => {
    const walletId = "ecosystem.123";
    expect(isEcosystemWallet(walletId)).toBe(true);
  });

  it('should return false for wallet IDs not starting with "ecosystem."', () => {
    const walletId = "com.coinbase.wallet";
    expect(isEcosystemWallet(walletId)).toBe(false);
  });

  it("should handle edge cases like empty wallet IDs", () => {
    const walletId = "";
    expect(isEcosystemWallet(walletId)).toBe(false);
  });

  it("should return true for ecosystem wallet objects", () => {
    const walletId = "ecosystem.coinbase";
    expect(isEcosystemWallet(createWallet(walletId))).toBe(true);
  });

  it("should return false for non-ecosystem wallets", () => {
    const walletId = "com.coinbase.wallet";
    expect(isEcosystemWallet(createWallet(walletId))).toBe(false);
  });
});
