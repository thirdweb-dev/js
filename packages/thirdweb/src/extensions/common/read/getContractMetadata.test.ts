import { describe, it, expect } from "vitest";
import { getContractMetadata } from "./getContractMetadata.js";
import { USDT_CONTRACT } from "../../../../test/src/test-contracts.js";

describe.runIf(process.env.TW_SECRET_KEY)("shared.getContractMetadata", () => {
  it("should return the correct contract metadata", async () => {
    const metadata = await getContractMetadata({
      contract: USDT_CONTRACT,
    });
    expect(metadata).toMatchInlineSnapshot(`
      {
        "name": "Tether USD",
        "symbol": "USDT",
      }
    `);
  });
});
