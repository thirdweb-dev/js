import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { baseSepolia } from "../../chains/chain-definitions/base-sepolia.js";
import { getWalletBalance } from "./getWalletBalance.js";

describe.runIf(process.env.TW_SECRET_KEY)("getWalletBalance", () => {
  it("should work for native currency", async () => {
    // Use a known address with ETH on Base Sepolia
    // This is a public address that should have some ETH for testing
    const testAddress = "0x742d35Cc6645C0532b6C766684f4b4E99Bf87E8A"; // Base deployer address

    const result = await getWalletBalance({
      address: testAddress,
      chain: baseSepolia,
      client: TEST_CLIENT,
    });

    expect(result).toBeDefined();
    expect(result.chainId).toBe(84532); // Base Sepolia chain ID
    expect(result.decimals).toBe(18);
    expect(result.symbol).toBe("ETH");
    expect(result.name).toBe("Sepolia Ether");
    expect(result.tokenAddress).toBeDefined();
    expect(result.value).toBeTypeOf("bigint");
    expect(result.displayValue).toBeTypeOf("string");
  });

  it("should work for ERC20 token", async () => {
    // Use a known ERC20 token on Base Sepolia
    // Using the official test token: Base Sepolia USD Coin
    const usdcAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // USDC on Base Sepolia
    const testAddress = "0x742d35Cc6645C0532b6C766684f4b4E99Bf87E8A"; // Address with potential balance

    const result = await getWalletBalance({
      address: testAddress,
      chain: baseSepolia,
      client: TEST_CLIENT,
      tokenAddress: usdcAddress,
    });

    expect(result).toBeDefined();
    expect(result.chainId).toBe(84532);
    expect(result.decimals).toBe(6); // USDC has 6 decimals
    expect(result.symbol).toBeDefined();
    expect(result.name).toBeDefined();
    expect(result.tokenAddress).toBe(usdcAddress);
    expect(result.value).toBeTypeOf("bigint");
    expect(result.displayValue).toBeTypeOf("string");
  });
});
