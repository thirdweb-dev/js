import { describe, it, expect, vi, afterEach } from "vitest";
import { FRAX_ETHER_CONTRACT } from "~test/test-contracts.js";
import { previewWithdraw } from "./previewWithdraw.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc4626.previewWithdraw", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the previewWithdraw result", async () => {
    const shares = await previewWithdraw({
      contract: FRAX_ETHER_CONTRACT,
      assets: 100000n,
    });
    expect(shares).toMatchInlineSnapshot(`93119n`);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
