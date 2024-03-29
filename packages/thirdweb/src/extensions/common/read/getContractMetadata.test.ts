import { describe, it, expect } from "vitest";
import { getContractMetadata } from "./getContractMetadata.js";
import { USDC_CONTRACT } from "../../../../test/src/test-contracts.js";

describe("shared.getContractMetadata", () => {
  it("should return the correct contract metadata", async () => {
    const metadata = await getContractMetadata({
      contract: USDC_CONTRACT,
    });
    expect(metadata).toMatchInlineSnapshot(`
      {
        "name": "USD Coin",
        "symbol": "USDC",
      }
    `);
  });
});
