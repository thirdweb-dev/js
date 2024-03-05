import { describe, it, expect, vi, afterEach } from "vitest";
import { FRAX_ETHER_CONTRACT } from "~test/test-contracts.js";
import { convertToAssets } from "./convertToAssets.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc4626.convertToAssets", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the convertToAssets result", async () => {
    const shares = await convertToAssets({
      contract: FRAX_ETHER_CONTRACT,
      shares: 100000000n,
    });
    expect(shares).toMatchInlineSnapshot(`107389811n`);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
