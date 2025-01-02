import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { createWallet } from "../../../wallets/create-wallet.js";
import { hasSmartAccount } from "./isSmartWallet.js";

describe("isSmartWallet", () => {
  it("should work if id is inApp and has smartAccount in wallet config", () => {
    const wallet = createWallet("inApp", {
      smartAccount: {
        chain: ANVIL_CHAIN,
        sponsorGas: true,
        overrides: {
          bundlerUrl: "your-bundler-url",
        },
      },
    });
    expect(hasSmartAccount(wallet)).toBe(true);
  });
});
