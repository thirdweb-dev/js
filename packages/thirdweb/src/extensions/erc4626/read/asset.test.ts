import { describe, it, expect, vi, afterEach } from "vitest";

import { asset } from "./asset.js";
import { FRAX_ETHER_CONTRACT } from "~test/test-contracts.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc4626.asset", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the assets result", async () => {
    const underlyingAsset = await asset({
      contract: FRAX_ETHER_CONTRACT,
    });
    expect(underlyingAsset).toBe("0x5E8422345238F34275888049021821E8E08CAa1f");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
