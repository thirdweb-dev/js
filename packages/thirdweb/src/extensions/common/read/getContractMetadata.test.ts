import { describe, expect, it } from "vitest";
import { USDT_CONTRACT } from "../../../../test/src/test-contracts.js";
import { getContractMetadata } from "./getContractMetadata.js";

describe.runIf(process.env.TW_SECRET_KEY)("shared.getContractMetadata", () => {
  it("should return the correct contract metadata", async () => {
    const metadata = await getContractMetadata({
      contract: USDT_CONTRACT,
    });

    // Test the existing interface that consumers expect (from the original snapshot)
    expect(metadata).toMatchObject({
      name: "Tether USD",
      symbol: "USDT",
    });

    // Ensure the required properties exist
    expect(metadata).toHaveProperty("name");
    expect(metadata).toHaveProperty("symbol");
    expect(typeof metadata.name).toBe("string");
    expect(typeof metadata.symbol).toBe("string");
  });
});
