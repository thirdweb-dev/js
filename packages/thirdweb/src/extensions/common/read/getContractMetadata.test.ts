import { describe, expect, it } from "vitest";
import { USDT_CONTRACT } from "../../../../test/src/test-contracts.js";
import { getContractMetadata } from "./getContractMetadata.js";

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
