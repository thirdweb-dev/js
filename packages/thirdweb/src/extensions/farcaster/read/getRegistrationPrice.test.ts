import { describe, it, expect, vi, afterEach } from "vitest";

import { getRegistrationPrice } from "./getRegistrationPrice.js";
import { TEST_CLIENT } from "~test/test-clients.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("farcaster.getRegistrationPrice", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the price to register a new fid", async () => {
    const price = await getRegistrationPrice({
      client: TEST_CLIENT,
    });
    expect(price).toBe(814540083517510n);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
