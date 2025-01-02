import { describe, expect, it } from "vitest";

import { FORKED_OPTIMISM_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { getUsdStoragePrice } from "./getUsdStoragePrice.js";

describe("farcaster.getUsdStoragePrice", () => {
  it("should return the price to rent 1 unit of storage", async () => {
    const price = await getUsdStoragePrice({
      client: TEST_CLIENT,
      chain: FORKED_OPTIMISM_CHAIN,
    });
    expect(price).toBe(3);
  });

  it("should return the price to rent 3 units of storage", async () => {
    const price = await getUsdStoragePrice({
      client: TEST_CLIENT,
      chain: FORKED_OPTIMISM_CHAIN,
      units: 3,
    });
    expect(price).toBe(9);
  });

  it("should error when 0 units specified", async () => {
    await expect(
      getUsdStoragePrice({ client: TEST_CLIENT, units: 0 }),
    ).rejects.toThrow("Expected units to be greater than or equal to 1, got 0");
  });
});
