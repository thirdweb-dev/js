import { describe, it, expect } from "vitest";

import { getRegistrationPrice } from "./getRegistrationPrice.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { FORKED_OPTIMISM_CHAIN } from "~test/chains.js";

describe("farcaster.getRegistrationPrice", () => {
  it("should return the price to register a new fid", async () => {
    const price = await getRegistrationPrice({
      client: TEST_CLIENT,
      chain: FORKED_OPTIMISM_CHAIN,
    });
    expect(price).toBe(824603002115370n);
  });

  it("should return the price to register a new fid with extra storage", async () => {
    const price = await getRegistrationPrice({
      client: TEST_CLIENT,
      chain: FORKED_OPTIMISM_CHAIN,
      extraStorage: 3,
    });
    expect(price).toBe(3298412008461477n);
  });
});
