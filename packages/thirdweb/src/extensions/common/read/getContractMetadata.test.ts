import { describe, it, expect, vi, afterEach } from "vitest";
import { getContractMetadata } from "./getContractMetadata.js";
import { USDC_CONTRACT } from "../../../../test/src/test-contracts.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("shared.getContractMetadata", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });

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
