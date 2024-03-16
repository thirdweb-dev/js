import { describe, it, expect, vi, afterEach } from "vitest";

import { TEST_CLIENT } from "~test/test-clients.js";
import { getStoragePrice } from "./getStoragePrice.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("farcaster.getStoragePrice", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });

  it("should return the price to rent 1 unit of storage", async () => {
    const price = await getStoragePrice({
      client: TEST_CLIENT,
    });
    expect(price).toBe(824603002115370n);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("should return the price to rent 3 units of storage", async () => {
    const price = await getStoragePrice({
      client: TEST_CLIENT,
      units: 3,
    });
    expect(price).toBe(824603002115370n * 3n);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("should error when 0 units specified", async () => {
    await expect(
      getStoragePrice({ client: TEST_CLIENT, units: 0 }),
    ).rejects.toThrow("Expected units to be greater than or equal to 1, got 0");
  });
});
