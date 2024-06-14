import { describe, expect, it } from "vitest";
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
});
