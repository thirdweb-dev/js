import { describe, it, expect, vi, afterEach } from "vitest";

import { TEST_CLIENT } from "~test/test-clients.js";
import { getUsdRegistrationPrice } from "./getUsdRegistrationPrice.js";
import { FORKED_OPTIMISM_CHAIN } from "~test/chains.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("farcaster.getRegistrationPrice", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });

  it("should return the price to register a new fid in USD", async () => {
    const price = await getUsdRegistrationPrice({
      client: TEST_CLIENT,
      chain: FORKED_OPTIMISM_CHAIN,
    });
    expect(price).toBe(3);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("should return the price to register a new fid with extra storage in USD", async () => {
    const price = await getUsdRegistrationPrice({
      client: TEST_CLIENT,
      chain: FORKED_OPTIMISM_CHAIN,
      extraStorage: 3,
    });
    expect(price).toBe(12);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
