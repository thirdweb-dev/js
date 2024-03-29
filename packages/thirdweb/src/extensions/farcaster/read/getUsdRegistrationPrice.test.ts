import { describe, it, expect } from "vitest";

import { TEST_CLIENT } from "~test/test-clients.js";
import { getUsdRegistrationPrice } from "./getUsdRegistrationPrice.js";
import { FORKED_OPTIMISM_CHAIN } from "~test/chains.js";

describe("farcaster.getRegistrationPrice", () => {
  it("should return the price to register a new fid in USD", async () => {
    const price = await getUsdRegistrationPrice({
      client: TEST_CLIENT,
      chain: FORKED_OPTIMISM_CHAIN,
    });
    expect(price).toBe(3);
  });

  it("should return the price to register a new fid with extra storage in USD", async () => {
    const price = await getUsdRegistrationPrice({
      client: TEST_CLIENT,
      chain: FORKED_OPTIMISM_CHAIN,
      extraStorage: 3,
    });
    expect(price).toBe(12);
  });
});
