import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { baseSepolia } from "../../chains/chain-definitions/base-sepolia.js";
import { getTokenBalance } from "./getTokenBalance.js";

// Create a mock account for testing
const testAccount = {
  address: "0x742d35Cc6645C0532b6C766684f4b4E99Bf87E8A", // Base deployer address
};

describe.runIf(process.env.TW_SECRET_KEY)("getTokenBalance", () => {
  it("should work for native token", async () => {
    const result = await getTokenBalance({
      account: testAccount,
      chain: baseSepolia,
      client: TEST_CLIENT,
    });

    expect(result).toBeDefined();
    expect(result.decimals).toBe(18);
    expect(result.name).toBe("Sepolia Ether");
    expect(result.symbol).toBe("ETH");
    expect(result.value).toBeTypeOf("bigint");
    expect(result.displayValue).toBeTypeOf("string");
  });

  it("should work for ERC20 token", async () => {
    // Use a known ERC20 token on Base Sepolia
    const usdcAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // USDC on Base Sepolia

    const result = await getTokenBalance({
      account: testAccount,
      chain: baseSepolia,
      client: TEST_CLIENT,
      tokenAddress: usdcAddress,
    });

    expect(result).toBeDefined();
    expect(result.decimals).toBe(6); // USDC has 6 decimals
    expect(result.symbol).toBeDefined();
    expect(result.name).toBeDefined();
    expect(result.value).toBeTypeOf("bigint");
    expect(result.displayValue).toBeTypeOf("string");
  });
});
