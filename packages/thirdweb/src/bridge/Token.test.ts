import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { tokens } from "./Token.js";

describe.runIf(process.env.TW_SECRET_KEY)("tokens", () => {
  it("should fetch tokens", async () => {
    // Setup
    const client = TEST_CLIENT;

    // Test
    const result = await tokens({ client });

    // Verify
    expect(result).toBeInstanceOf(Array);

    // Basic structure validation
    if (result.length > 0) {
      const token = result[0];
      expect(token).toBeDefined();
      expect(token).toHaveProperty("chainId");
      expect(token).toHaveProperty("address");
      expect(token).toHaveProperty("decimals");
      expect(token).toHaveProperty("symbol");
      expect(token).toHaveProperty("name");
      expect(token).toHaveProperty("priceUsd");

      if (token) {
        expect(typeof token.chainId).toBe("number");
        expect(typeof token.address).toBe("string");
        expect(typeof token.decimals).toBe("number");
        expect(typeof token.symbol).toBe("string");
        expect(typeof token.name).toBe("string");
        expect(typeof token.priceUsd).toBe("number");
      }
    }
  });

  it("should filter tokens by chainId", async () => {
    // Setup
    const client = TEST_CLIENT;

    // Test
    const result = await tokens({
      chainId: 1,
      client,
    });

    // Verify
    expect(result).toBeInstanceOf(Array);

    // All tokens should have chainId 1
    for (const token of result) {
      expect(token.chainId).toBe(1);
    }
  });

  it("should respect limit parameter", async () => {
    // Setup
    const client = TEST_CLIENT;

    // Test
    const result = await tokens({
      client,
      limit: 5,
    });

    // Verify
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it("should filter tokens by symbol", async () => {
    // Setup
    const client = TEST_CLIENT;

    // Test
    const result = await tokens({
      client,
      symbol: "ETH",
    });

    // Verify
    expect(result).toBeInstanceOf(Array);

    // All tokens should have symbol "ETH"
    for (const token of result) {
      expect(token.symbol).toContain("ETH");
    }
  });
});
