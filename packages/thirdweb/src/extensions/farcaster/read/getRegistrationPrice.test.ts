import { describe, expect, it } from "vitest";

import { FORKED_OPTIMISM_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { getRegistrationPrice } from "./getRegistrationPrice.js";

describe("farcaster.getRegistrationPrice", () => {
  it("should return the price to register a new fid", async () => {
    const price = await getRegistrationPrice({
      chain: FORKED_OPTIMISM_CHAIN,
      client: TEST_CLIENT,
    });
    expect(price).toBe(824603002115370n);
  });

  it("should return the price to register a new fid with extra storage", async () => {
    const price = await getRegistrationPrice({
      chain: FORKED_OPTIMISM_CHAIN,
      client: TEST_CLIENT,
      extraStorage: 3,
    });
    expect(price).toBe(3298412008461477n);
  });
});
