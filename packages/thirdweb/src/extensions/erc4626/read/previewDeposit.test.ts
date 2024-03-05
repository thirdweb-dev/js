import { describe, it, expect, vi, afterEach } from "vitest";
import { FRAX_ETHER_CONTRACT } from "~test/test-contracts.js";
import { previewDeposit } from "./previewDeposit.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("erc4626.previewDeposit", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should return the previewDeposit result", async () => {
    const shares = await previewDeposit({
      contract: FRAX_ETHER_CONTRACT,
      assets: 100000n,
    });
    expect(shares).toMatchInlineSnapshot(`93118n`);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
