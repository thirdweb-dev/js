import { describe, it, expect, vi, afterEach } from "vitest";
import { FRAX_ETHER_CONTRACT } from "~test/test-contracts.js";
import { previewMint } from "./previewMint.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc4626.previewMint", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the previewMint result", async () => {
    const shares = await previewMint({
      contract: FRAX_ETHER_CONTRACT,
      shares: 107390n,
    });
    expect(shares).toMatchInlineSnapshot(`115326n`);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
