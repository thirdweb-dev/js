import { describe, it, expect, vi, afterEach } from "vitest";
import { FRAX_ETHER_CONTRACT } from "~test/test-contracts.js";
import { previewRedeem } from "./previewRedeem.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc4626.previewRedeem", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the previewRedeem result", async () => {
    const shares = await previewRedeem({
      contract: FRAX_ETHER_CONTRACT,
      shares: 107390n,
    });
    expect(shares).toMatchInlineSnapshot(`115325n`);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
