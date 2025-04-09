import { describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { base } from "../../chains/chain-definitions/base.js";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import { sepolia } from "../../chains/chain-definitions/sepolia.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { convertCryptoToFiat } from "./cryptoToFiat.js";

describe.runIf(process.env.TW_SECRET_KEY)("Pay: crypto-to-fiat", () => {
  it("should convert ETH price to USD on Ethereum mainnet", async () => {
    const data = await convertCryptoToFiat({
      chain: ethereum,
      fromTokenAddress: NATIVE_TOKEN_ADDRESS,
      fromAmount: 1,
      to: "USD",
      client: TEST_CLIENT,
    });
    expect(data.result).toBeDefined();
    // Should be a number
    expect(!Number.isNaN(data.result)).toBe(true);
    // Since eth is around US$3000, we can add a test to check if the price is greater than $1500 (as a safe margin)
    // let's hope that scenario does not happen :(
    expect(Number(data.result) > 1500).toBe(true);
  });

  it("should convert ETH price to USD on Base mainnet", async () => {
    const data = await convertCryptoToFiat({
      chain: base,
      fromTokenAddress: NATIVE_TOKEN_ADDRESS,
      fromAmount: 1,
      to: "USD",
      client: TEST_CLIENT,
    });
    expect(data.result).toBeDefined();
    // Should be a number
    expect(!Number.isNaN(data.result)).toBe(true);
    expect(data.result).toBeGreaterThan(0);
  });

  it("should return zero if fromAmount is zero", async () => {
    const data = await convertCryptoToFiat({
      chain: base,
      fromTokenAddress: NATIVE_TOKEN_ADDRESS,
      fromAmount: 0,
      to: "USD",
      client: TEST_CLIENT,
    });
    expect(data.result).toBe(0);
  });

  it("should throw error for testnet chain (because testnets are not supported", async () => {
    await expect(
      convertCryptoToFiat({
        chain: sepolia,
        fromTokenAddress: NATIVE_TOKEN_ADDRESS,
        fromAmount: 1,
        to: "USD",
        client: TEST_CLIENT,
      }),
    ).rejects.toThrowError(
      `Cannot fetch price for a testnet (chainId: ${sepolia.id})`,
    );
  });

  it("should throw error if fromTokenAddress is set to an invalid EVM address", async () => {
    await expect(
      convertCryptoToFiat({
        chain: ethereum,
        fromTokenAddress: "haha",
        fromAmount: 1,
        to: "USD",
        client: TEST_CLIENT,
      }),
    ).rejects.toThrowError(
      "Invalid fromTokenAddress. Expected a valid EVM contract address",
    );
  });

  it("should throw error if fromTokenAddress is set to a wallet address", async () => {
    await expect(
      convertCryptoToFiat({
        chain: base,
        fromTokenAddress: TEST_ACCOUNT_A.address,
        fromAmount: 1,
        to: "USD",
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
      convertCryptoToFiat({
        chain: base,
        fromTokenAddress: NATIVE_TOKEN_ADDRESS,
        fromAmount: 1,
        to: "USD",
        client: TEST_CLIENT,
      }),
    ).rejects.toThrowError(
      `Failed to fetch USD value for token (${NATIVE_TOKEN_ADDRESS}) on chainId: ${base.id}`,
    );
    vi.restoreAllMocks();
  });
});
