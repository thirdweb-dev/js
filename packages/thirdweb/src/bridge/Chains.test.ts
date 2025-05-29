import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { chains } from "./Chains.js";

describe.runIf(process.env.TW_SECRET_KEY)("chains", () => {
  it("should fetch chains", async () => {
    // Setup
    const client = TEST_CLIENT;

    // Test
    const result = await chains({ client });

    // Verify
    expect(result).toBeInstanceOf(Array);

    // Basic structure validation
    if (result.length > 0) {
      const chain = result.find((chain) => chain.chainId === 1);
      expect(chain).toHaveProperty("chainId");
      expect(chain).toHaveProperty("name");
      expect(chain).toHaveProperty("icon");
      expect(chain).toHaveProperty("nativeCurrency");
      expect(chain?.nativeCurrency).toHaveProperty("name");
      expect(chain?.nativeCurrency).toHaveProperty("symbol");
      expect(chain?.nativeCurrency).toHaveProperty("decimals");
    }
  });
});
