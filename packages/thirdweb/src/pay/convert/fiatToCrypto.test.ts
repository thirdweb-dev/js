import { describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { base } from "../../chains/chain-definitions/base.js";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import { sepolia } from "../../chains/chain-definitions/sepolia.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { convertFiatToCrypto } from "./fiatToCrypto.js";

describe.runIf(process.env.TW_SECRET_KEY)("Pay: fiatToCrypto", () => {
  it("should convert fiat price to token on Ethereum mainnet", async () => {
    const data = await convertFiatToCrypto({
      chain: ethereum,
      from: "USD",
      fromAmount: 1,
      to: NATIVE_TOKEN_ADDRESS,
      client: TEST_CLIENT,
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
      from: "USD",
      fromAmount: 1,
      to: NATIVE_TOKEN_ADDRESS,
      client: TEST_CLIENT,
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
      from: "USD",
      fromAmount: 0,
      to: NATIVE_TOKEN_ADDRESS,
      client: TEST_CLIENT,
    });
    expect(data.result).toBe(0);
  });

  it("should throw error for testnet chain (because testnets are not supported", async () => {
    await expect(
      convertFiatToCrypto({
        chain: sepolia,
        to: NATIVE_TOKEN_ADDRESS,
        fromAmount: 1,
        from: "USD",
        client: TEST_CLIENT,
      }),
    ).rejects.toThrowError(
      `Cannot fetch price for a testnet (chainId: ${sepolia.id})`,
    );
  });

  it("should throw error if `to` is set to an invalid EVM address", async () => {
    await expect(
      convertFiatToCrypto({
        chain: ethereum,
        to: "haha",
        fromAmount: 1,
        from: "USD",
        client: TEST_CLIENT,
      }),
    ).rejects.toThrowError(
      "Invalid `to`. Expected a valid EVM contract address",
    );
  });

  it("should throw error if `to` is set to a wallet address", async () => {
    await expect(
      convertFiatToCrypto({
        chain: base,
        to: TEST_ACCOUNT_A.address,
        fromAmount: 1,
        from: "USD",
        client: TEST_CLIENT,
      }),
    ).rejects.toThrowError(
      `Error: ${TEST_ACCOUNT_A.address} on chainId: ${base.id} is not a valid contract address.`,
    );
  });
  it("should throw if response is not OK", async () => {
    global.fetch = vi.fn();
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
    });
    await expect(
      convertFiatToCrypto({
        chain: ethereum,
        to: NATIVE_TOKEN_ADDRESS,
        fromAmount: 1,
        from: "USD",
        client: TEST_CLIENT,
      }),
    ).rejects.toThrowError(
      `Failed to convert USD value to token (${NATIVE_TOKEN_ADDRESS}) on chainId: 1`,
    );
    vi.restoreAllMocks();
  });
});
