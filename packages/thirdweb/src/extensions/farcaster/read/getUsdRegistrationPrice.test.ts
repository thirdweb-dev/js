import { describe, expect, it } from "vitest";

import { FORKED_OPTIMISM_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { getUsdRegistrationPrice } from "./getUsdRegistrationPrice.js";

describe("farcaster.getRegistrationPrice", () => {
  it("should return the price to register a new fid in USD", async () => {
    const price = await getUsdRegistrationPrice({
      chain: FORKED_OPTIMISM_CHAIN,
      client: TEST_CLIENT,
    });
    expect(price).toBe(3);
  });

  it("should return the price to register a new fid with extra storage in USD", async () => {
    const price = await getUsdRegistrationPrice({
      chain: FORKED_OPTIMISM_CHAIN,
      client: TEST_CLIENT,
      extraStorage: 3,
    });
    expect(price).toBe(12);
  });
});
