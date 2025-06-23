import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { base } from "../../chains/chain-definitions/base.js";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import { sepolia } from "../../chains/chain-definitions/sepolia.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { convertFiatToCrypto } from "./fiatToCrypto.js";

describe.runIf(process.env.TW_SECRET_KEY)("Pay: fiatToCrypto", () => {
  it("should convert fiat price to token on Ethereum mainnet", async () => {
    const data = await convertFiatToCrypto({
      chain: ethereum,
      client: TEST_CLIENT,
      from: "USD",
      fromAmount: 1,
      to: NATIVE_TOKEN_ADDRESS,
    });
    expect(data.result).toBeDefined();
    // Should be a number
    expect(!Number.isNaN(data.result)).toBe(true);
    // Since eth is around US$3000, 1 USD should be around 0.0003
    // we give it some safe margin so the test won't be flaky
    expect(data.result < 0.001).toBe(true);
  });

  it("should convert fiat price to token on Base mainnet", async () => {
    const data = await convertFiatToCrypto({
      chain: base,
      client: TEST_CLIENT,
      from: "USD",
      fromAmount: 1,
      to: NATIVE_TOKEN_ADDRESS,
    });

    expect(data.result).toBeDefined();
    // Should be a number
    expect(!Number.isNaN(data.result)).toBe(true);
    // Since eth is around US$3000, 1 USD should be around 0.0003
    // we give it some safe margin so the test won't be flaky
    expect(data.result < 0.001).toBe(true);
  });

  it("should return zero if the fromAmount is zero", async () => {
    const data = await convertFiatToCrypto({
      chain: base,
      client: TEST_CLIENT,
      from: "USD",
      fromAmount: 0,
      to: NATIVE_TOKEN_ADDRESS,
    });
    expect(data.result).toBe(0);
  });

  it("should throw error for testnet chain (because testnets are not supported", async () => {
    await expect(
      convertFiatToCrypto({
        chain: sepolia,
        client: TEST_CLIENT,
        from: "USD",
        fromAmount: 1,
        to: NATIVE_TOKEN_ADDRESS,
      }),
    ).rejects.toThrowError(
      `Cannot fetch price for a testnet (chainId: ${sepolia.id})`,
    );
  });

  it("should throw error if `to` is set to an invalid EVM address", async () => {
    await expect(
      convertFiatToCrypto({
        chain: ethereum,
        client: TEST_CLIENT,
        from: "USD",
        fromAmount: 1,
        to: "haha",
      }),
    ).rejects.toThrowError(
      "Invalid `to`. Expected a valid EVM contract address",
    );
  });
});
