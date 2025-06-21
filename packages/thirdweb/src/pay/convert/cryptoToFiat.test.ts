import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { base } from "../../chains/chain-definitions/base.js";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import { sepolia } from "../../chains/chain-definitions/sepolia.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { convertCryptoToFiat } from "./cryptoToFiat.js";

describe.runIf(process.env.TW_SECRET_KEY)("Pay: crypto-to-fiat", () => {
  it("should convert ETH price to USD on Ethereum mainnet", async () => {
    const data = await convertCryptoToFiat({
      chain: ethereum,
      client: TEST_CLIENT,
      fromAmount: 1,
      fromTokenAddress: NATIVE_TOKEN_ADDRESS,
      to: "USD",
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
      client: TEST_CLIENT,
      fromAmount: 1,
      fromTokenAddress: NATIVE_TOKEN_ADDRESS,
      to: "USD",
    });
    expect(data.result).toBeDefined();
    // Should be a number
    expect(!Number.isNaN(data.result)).toBe(true);
    expect(data.result).toBeGreaterThan(0);
  });

  it("should return zero if fromAmount is zero", async () => {
    const data = await convertCryptoToFiat({
      chain: base,
      client: TEST_CLIENT,
      fromAmount: 0,
      fromTokenAddress: NATIVE_TOKEN_ADDRESS,
      to: "USD",
    });
    expect(data.result).toBe(0);
  });

  it("should throw error for testnet chain (because testnets are not supported)", async () => {
    await expect(
      convertCryptoToFiat({
        chain: sepolia,
        client: TEST_CLIENT,
        fromAmount: 1,
        fromTokenAddress: NATIVE_TOKEN_ADDRESS,
        to: "USD",
      }),
    ).rejects.toThrowError(
      `Cannot fetch price for a testnet (chainId: ${sepolia.id})`,
    );
  });

  it("should throw error if fromTokenAddress is set to an invalid EVM address", async () => {
    await expect(
      convertCryptoToFiat({
        chain: ethereum,
        client: TEST_CLIENT,
        fromAmount: 1,
        fromTokenAddress: "haha",
        to: "USD",
      }),
    ).rejects.toThrowError(
      "Invalid fromTokenAddress. Expected a valid EVM contract address",
    );
  });
});
